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