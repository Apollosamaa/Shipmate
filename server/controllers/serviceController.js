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

//apply a services
export const applyService = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
        return res.status(404).json({ message: "Service not found" });
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        // Check if user is the provider
        if (service.provider.equals(user._id)) {
        return res.status(400).json({ message: "You can't apply to your own service" });
        }

        // Find ANY existing application (regardless of status)
        const existingApplication = service.applicants.find(applicant =>
        applicant.user.equals(user._id)
        );

        if (existingApplication) {
        // Block only if status is pending/accepted
        if (['pending', 'accepted'].includes(existingApplication.status)) {
            return res.status(400).json({ 
            message: "You have already applied for this service." 
            });
        }
        
        // For rejected/completed, update status to pending
        existingApplication.status = "pending";
        existingApplication.updatedAt = new Date();
        } else {
        // New application
        service.applicants.push({ 
            user: user._id, 
            status: "pending",
            createdAt: new Date()
        });
        }

        await service.save();
        return res.status(200).json(service);
    } catch (error) {
        console.error("Error in applyService:", error);
        return res.status(500).json({ message: "Internal Server Error" });
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

//delete service
export const deleteService = asyncHandler(async (req, res) => {
    try{
        const {id} = req.params;

        const service = await Service.findById(id);
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        if(!service) {
            return res.status(404).json({
                message: "Service not found",
            });
        }

        if(!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        await service.deleteOne(
            {
                _id: id,
            }
        )
    
        return res.status(200).json({
            message: "Service deleted successfully",
        });
    } catch (error) {
        console.log("Error in deleteService: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
})

//get applicants
export const getMyApplicants = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const services = await Service.find({ provider: user._id })
            .populate("applicants.user", "name profilePicture email");

        const pendingApplicants = services.flatMap(service => 
            service.applicants
                .filter(applicant => applicant.status === "pending") // Only pending
                .map(applicant => ({
                    serviceId: service._id,
                    serviceTitle: service.title,
                    applicantId: applicant.user._id,
                    ...applicant.toObject() // Spread applicant details
                }))
        );

        res.status(200).json(pendingApplicants);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//update applicants status
export const updateApplicantStatus = asyncHandler(async (req, res) => {
    try {
        const { id: serviceId, applicantId } = req.params;
        const { status } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        const applicant = service.applicants.id(applicantId);
        if (!applicant) return res.status(404).json({ message: "Applicant not found" });

        applicant.status = status;
        await service.save();

        res.status(200).json({ message: "Status updated" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update service status (for applicants to mark as completed)
export const updateServiceStatus = asyncHandler(async (req, res) => {
    try {
        const { id: serviceId } = req.params;
        const { status } = req.body;
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Find the applicant's application
        const application = service.applicants.find(app => 
            app.user.equals(user._id)
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Only allow updating to "completed" status if currently "accepted"
        if (status === "completed" && application.status !== "accepted") {
            return res.status(400).json({ 
                message: "Only accepted services can be marked as completed" 
            });
        }

        application.status = status;
        application.updatedAt = new Date();
        await service.save();

        return res.status(200).json(service);
    } catch (error) {
        console.error("Error updating service status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



