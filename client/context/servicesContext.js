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
            toast.success("Application submitted successfully");
            getServices();
        } catch (error) {
            console.log("Error applying to services", error);
            toast.error(error.response.data.message);
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
    }

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
        }}>
            { children }
        </ServicesContext.Provider>
    )
};

export const useServicesContext = () => {
    return useContext(ServicesContext);
}