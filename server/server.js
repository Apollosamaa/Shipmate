import express from "express";
import {auth} from "express-openid-connect"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";
import Verification from "./models/VerificationModel.js";
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    routes:{
        postLogoutRedirect: process.env.CLIENT_URL
    }
};

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(auth(config));

// Add this new route before the dynamic route imports
app.post('/api/v1/unverify', asyncHandler(async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove verification
    await Verification.deleteOne({ userId: user._id });
    
    // Update user status
    user.isVerified = false;
    await user.save();

    return res.json({ 
        success: true,
        message: 'User unverified successfully for testing',
        user: {
            _id: user._id,
            email: user.email,
            isVerified: user.isVerified
        }
    });
}));

//function to check if user exists in the db
const ensureUserInDB = asyncHandler(async(user)=>{
    try{
        const existingUser = await User.findOne({auth0Id: user.sub})

        if(!existingUser){
            const newUser = new User({
                auth0Id: user.sub,
                email: user.email,
                name: user.name,
                isVerified: false,
                profilePicture: user.picture,
            });
            await newUser.save();
            console.log("user added to db", user);
        }else{
            console.log("user already exists in db", existingUser);
        }
    } catch (error){
        console.log("Error while checking user in DB", error.message);
    }
})

app.get("/", async(req, res)=>{
    if(req.oidc.isAuthenticated()){
        await ensureUserInDB(req.oidc.user);
        return res.redirect(process.env.CLIENT_URL);
    }else{
        return res.send("Logged out");
    }
})

//routes
const routeFiles = fs.readdirSync("./routes").filter(file => file !== 'chatRoutes.js');

app.use("/api/v1/chat", chatRoutes);

// Then load other routes dynamically
routeFiles.forEach((file)=>{
    import(`./routes/${file}`)
    .then((route)=>{
        app.use("/api/v1/", route.default);
    })
    .catch((error)=>{
        console.log(`Error importing route ${file}`, error);
    })
})

const server = async () => {
    try {
        await connect();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Server error", error.message);
        process.exit(1);
    }
}

server();