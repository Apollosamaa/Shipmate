import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

const GlobalContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;
export const GlobalContextProvider = ({children}) => {

    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auth0User, setAuth0User] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [loading, setLoading] = useState(false)

    //input state
    const [serviceTitle, setServiceTitle] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [activeServiceCategory, setActiveServiceCategory] = useState([]);
    const [price, setPrice] = useState(0);
    const [negotiable, setNegotiable] = useState(false);
    const [tags, setTags] = useState([]);


    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/v1/check-auth");
                setIsAuthenticated(res.data.isAuthenticated);
                setAuth0User(res.data.user);
                setLoading(false);
            } catch (error) {
                console.log("Error checking auth", error);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();

        
    }, []);

    const getUserProfile = async (id) => {
        try {
            const res = await axios.get(`/api/v1/user/${id}`);
            setUserProfile(res.data);
        } catch (error) {
            console.log("Error getting user profile", error);
        }
    }

    //handle input change
    const handleTitleChange = (e) => {
        setServiceTitle(e.target.value.trimStart());
    };

    const handleDescriptionChange= (value) => {
        setServiceDescription(value.trimStart());
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }

    useEffect(()=> {
        if(isAuthenticated && auth0User) {
            getUserProfile(auth0User.sub);
        }
    }, [isAuthenticated, auth0User]);

    return (
        <GlobalContext.Provider value = {{
            isAuthenticated,
            auth0User,
            userProfile,
            loading,
            getUserProfile,
            serviceTitle,
            serviceDescription,
            activeServiceCategory,
            price,
            negotiable,
            tags,
            handleTitleChange,
            handleDescriptionChange,
            handlePriceChange,
            setActiveServiceCategory,
            setNegotiable,
            setTags,
        }}>
            { children }
        </GlobalContext.Provider>
    )
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};