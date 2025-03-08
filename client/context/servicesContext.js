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
    }

    useEffect(() => {
        getServices();
    }, []);


    return (
        <ServicesContext.Provider value={"hello from services context"}>
            { children }
        </ServicesContext.Provider>
    )
};

export const useServicesContext = () => {
    return useContext(ServicesContext);
}