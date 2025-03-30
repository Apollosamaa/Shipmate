import React, { createContext, useContext, useState, useEffect } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import toast from "react-hot-toast";

const ServicesContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = "true"; 

export const ServicesContextProvider = ({children}) => {
    const { userProfile} = useGlobalContext();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userServices, setUserServices] = useState([]);

    const [searchQuery, setSearchQuery] = useState({
        tags: "",
        title: "",
    })

    //filters
    const [filters, setFilters] = useState({
        academicAssistance: false,
        technicalIT: false,
        creativeMedia: false,
        eventEntertainment: false,
        healthWellness: false,
        transportationDelivery: false,
        miscellaneous: false,
    })

    const getServices = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/services");
            setServices(res.data);
        } catch (error) {
            console.log("Error in getServices: ", error);
        } finally {
            setLoading(false);
        }
    };

    const createService = async (serviceData) =>{
        try {
            const res = await axios.post("/api/v1/services", serviceData);

            toast.success("Service created successfully");

            setServices((prevServices) => [res.data, ...prevServices]);

            //update userServices
            if(userProfile._id){
                setUserServices((prevUserServices) => [res.data, ...prevUserServices]);
            }
        } catch (error) {
            console.log("Error creating service", error);
        }
    };

    const getUserServices = async (user) => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/services/user/" + user);
            setUserServices(res.data);
        } catch (error) {
            console.log("Error getting user services", error);
        } finally {
            setLoading(false);
        }
    };

    const searchServices = async (tags, title) => {
        setLoading(true);
        try {
            //build query string
            const query = new URLSearchParams(); 

            if(tags) query.append("tags", tags);
            if(title) query.append("title", title);

            // send request
            const res = await axios.get(`/api/v1/services/search?${query.toString()}`);

            //set services to response data
            setServices(res.data);
        } catch (error) {
            console.log("Error getting services", error);
        } finally {
            setLoading(false);
        }
    }

    // get service by id
    const getServiceById = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/services/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error getting service by id", error);
        } finally {
            setLoading(false);
        }
    };

    // save or like a service
    const saveService = async (serviceId, userId) => {
        setLoading(true);
        try {
            const res = await axios.put(`/api/v1/services/save/${serviceId}`);
            const isNowSaved = res.data.likes.includes(userProfile?._id);
            toast.success(isNowSaved ? "Service saved successfully" : "Service unsaved");
            getServices();
        } catch (error) {
            console.log("Error saving service", error);
        } finally {
            setLoading(false);
        }
    };

    // apply to a service
    const applyToService = async (serviceId) => {
        try {
          const res = await axios.put(`/api/v1/services/apply/${serviceId}`);
          await getServices(); // Refresh services data
          return res.data;
        } catch (error) {
          console.error("Error applying to service:", error.response?.data || error.message);
          throw error; // Re-throw to handle in component
        }
      };

    // delete a service
    const deleteService = async (serviceId) => {
        try {
            await axios.delete(`/api/v1/services/${serviceId}`);
            setServices((prevServices)=> prevServices.filter((service) => service._id !== serviceId))
            setUserServices((prevServices)=> prevServices.filter((service) => service._id !== serviceId))

            toast.success("Service deleted Successfully");
        } catch (error) {
            console.log("Error deleting service", error);
        }
    };

    // handle search changes
    const handleSearchChange = (searchName, value) => {
        setSearchQuery((prev) => ({ ...prev, [searchName]: value}))
    };

    // handle filter changes
    const handleFilterChange = (filterName) => {
        setFilters((prev)=> ({...prev, [filterName]: !prev[filterName]}))
    };

    // mark services as completed
    const updateApplicationStatus = async (serviceId, userId, status) => {
        try {
            const res = await axios.put(`/api/v1/services/status/${serviceId}`, { status });
            
            // Update local state
            setServices(prevServices => 
                prevServices.map(service => 
                    service._id === serviceId ? res.data : service
                )
            );
            
            // Also update userServices if needed
            setUserServices(prevUserServices => 
                prevUserServices.map(service => 
                    service._id === serviceId ? res.data : service
                )
            );
            
            toast.success("Status updated successfully");
            return res.data;
        } catch (error) {
            console.error("Error updating application status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
            throw error;
        }
    };

    const addRating = async (serviceId, userId, ratingValue, reviewText) => {
        try {
        const res = await axios.post(`/api/v1/services/rate/${serviceId}`, {
            userId,
            rating: ratingValue,
            review: reviewText || "",
        });
        
        // Update both states
        setServices(prev => prev.map(s => s._id === res.data._id ? res.data : s));
        setUserServices(prev => prev.map(s => s._id === res.data._id ? res.data : s));
        
        toast.success("Rating submitted successfully");
        return res.data;
        } catch (error) {
        console.error("Error adding rating:", error);
        toast.error(error.response?.data?.message || "Failed to add rating");
        throw error;
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    useEffect(() =>{
        if(userProfile._id){
            getUserServices(userProfile._id);
        }
    }, [userProfile]);


    return (
        <ServicesContext.Provider value={{
            services,
            loading,
            createService,
            userServices,
            searchServices,
            getServiceById,
            saveService,
            applyToService,
            deleteService,
            handleSearchChange,
            searchQuery,
            setSearchQuery,
            filters,
            setFilters,
            handleFilterChange,
            updateApplicationStatus,
            addRating,
        }}>
            { children }
        </ServicesContext.Provider>
    )
};

export const useServicesContext = () => {
    return useContext(ServicesContext);
}