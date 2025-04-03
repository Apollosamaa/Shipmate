import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useGlobalContext } from "./globalContext";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { userProfile } = useGlobalContext();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Set axios base URL
    axios.defaults.baseURL = "http://localhost:8000";

    const fetchConversations = useCallback(async () => {
        if (!userProfile?._id) return;
        
        try {
            setLoading(true);
            const res = await axios.get("/api/v1/chat/conversations", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            
            // Sort conversations by last message date (newest first)
            const sortedConversations = (res.data || []).sort((a, b) => {
                const dateA = new Date(a.lastMessage?.createdAt || 0);
                const dateB = new Date(b.lastMessage?.createdAt || 0);
                return dateB - dateA; // Newest first
            });
            
            setConversations(sortedConversations);
            setInitialLoadComplete(true);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setConversations([]);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [userProfile?._id]);

    const fetchMessages = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/v1/chat/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setMessages(res.data || []);
            setActiveChat(userId);
            return res.data;
        } catch (err) {
            setError(err);
            setMessages([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (receiverId, content, serviceId = null) => {
        try {
            // Optimistically update UI
            const tempMessage = {
                _id: `temp-${Date.now()}`,
                sender: { 
                    _id: userProfile._id, 
                    name: userProfile.name,
                    profilePicture: userProfile.profilePicture 
                },
                receiver: receiverId,
                content,
                createdAt: new Date().toISOString(),
                read: true
            };
    
            // Update messages immediately
            setMessages(prev => [...prev, tempMessage]);
    
            // Update conversations order
            setConversations(prev => {
                const updated = [...prev];
                const convIndex = updated.findIndex(c => c.user._id === receiverId);
                
                if (convIndex >= 0) {
                    const [movedConv] = updated.splice(convIndex, 1);
                    movedConv.lastMessage = {
                        content,
                        createdAt: new Date().toISOString()
                    };
                    movedConv.unreadCount = 0;
                    return [movedConv, ...updated];
                }
                return updated;
            });
    
            // Send to server
            const res = await axios.post("/api/v1/chat/messages", {
                receiverId,
                content,
                serviceId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
    
            // Replace temporary message with server response
            setMessages(prev => [
                ...prev.filter(m => m._id !== tempMessage._id),
                {
                    ...res.data,
                    sender: { 
                        _id: userProfile._id, 
                        name: userProfile.name,
                        profilePicture: userProfile.profilePicture 
                    },
                    receiver: typeof res.data.receiver === 'object' 
                        ? res.data.receiver 
                        : { _id: receiverId }
                }
            ]);
    
            return res.data;
        } catch (error) {
            console.error("Failed to send message:", error);
            // Rollback optimistic update on error
            setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
            throw error;
        }
    }, [userProfile]);

    const markMessagesAsRead = async (userId) => {
        try {
            await axios.patch(`/api/v1/chat/messages/mark-read`, { 
                senderId: userId 
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
        } catch (error) {
            console.error("Failed to mark messages as read:", error);
        }
    };

    useEffect(() => {
        if (!initialLoadComplete && userProfile?._id) {
            fetchConversations();
        }
    }, [fetchConversations, initialLoadComplete, userProfile]);

    const totalUnread = useMemo(() => (
        conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
    ), [conversations]);

    return (
        <ChatContext.Provider value={{
            conversations,
            messages,
            activeChat,
            loading,
            error,
            totalUnread,
            fetchMessages,
            sendMessage,
            fetchConversations,
            markMessagesAsRead,
            initialLoadComplete
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);