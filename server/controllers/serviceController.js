import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Service from "../models/ServiceModel.js";

export const createService = asyncHandler(async (req, res) => {
    try{

        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        const isAuth = req.oidc.isAuthenticated() || user.email;

        if(!isAuth){
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const {
            title, 
            description, 
            category,
            tags, 
            price, 
            negotiable,
        } = req.body;

        if (!title) { return res.status(400).json({
                message: "Title is required",
            });
        }

        if (!description) {
            return res.status(400).json({
                message: "Description is required",
            });
        }

        if (!category) {
            return res.status(400).json({
                message: "Category is required",
            });
        }

        if (!price){
            return res.status(400).json({
                message: "Price is required",
            });
        }

        const service = new Service(
            {
                title,
                description,
                category,
                tags,
                price,
                negotiable,
                provider: user._id,
            }
        );

        await service.save();

        return res.status(201).json(service);
    }catch (error) {
        console.log("Error in createService: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

export const getServices = asyncHandler(async (req, res) => {
    try{
        const services = await Service.find({}).populate(
            "provider",
            "name email profilePicture",
        ).sort({ createdAt: -1}); //sort by latest date

        return res.status(200).json(services);
    }catch (error) {
        console.log("Error in getServices: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

//get services by user
export const getServicesByUser = asyncHandler(async (req, res) => {
    try{

        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const services = await Service.find({ provider: user._id }).populate(
            "provider",
            "name profilePicture",
        )

        return res.status(200).json(services);
    } catch (error) {
        console.log("Error in getServiceByUser: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

//saerch services
export const searchServices = asyncHandler(async (req, res) => {
    try{
        const { tags, title} = req.query;

        let query = {};

        if (tags){
            query.tags = { $in: tags.split(",") };
        }

        if (title) {
            query.title = { $regex: title, $options: "i" };
        }

        const services = await Service.find(query).populate(
            "provider",
            "name profilePicture",
        )

        return res.status(200).json(services);
    } catch ( error ){
        console.log("Error in searchServices: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

//apply for services
export const applyService = asyncHandler(async (req, res) =>{
    try {
        const service = await Service.findById(req.params.id);

        if(!service){
            return res.status(404).json({
                message: "Service not found",
            });
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if user has already applied and is still pending or accepted
        const existingApplication = service.applicants.find(applicant =>
            applicant.user.equals(user._id) && 
            (applicant.status === "pending" || applicant.status === "accepted")
        );

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this service.",
            });
        }

        // Add user to applicants list with "pending" status
        service.applicants.push({ user: user._id, status: "pending" });

        await service.save();
        return res.status(200).json(service);
    } catch ( error ){
        console.log("Error in applyService: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

//like and unlike services
export const saveService = asyncHandler(async (req, res) => {
    try{
        const service = await Service.findById(req.params.id);

        if (!service){
            return res.status(404).json({
                message: "Service not found",
            });
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isSaved = service.likes.includes(user._id);

        if(isSaved){
            service.likes = service.likes.filter((like) => !like.equals(user._id));
        }else{
            service.likes.push(user._id);
        }

        await service.save();

        return res.status(200).json(service);
    }catch(error){
        console.log("Error in saveService: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

//get service by id 
export const getServiceById = asyncHandler(async (req, res) => {
    try{
        const {id} = req.params;

        const service = await Service.findById(id).populate(
            "provider",
            "name email profilePicture",
        );

        if (!service) {
            return res.status(404).json({
                message: "Service not found",
            });
        }

        return res.status(200).json(service);
    } catch(error) {
        console.log("Error in getServiceById: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }    
})