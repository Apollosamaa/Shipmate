"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { useChatContext } from "@/context/chatContext";
import { useState } from "react";

interface ChatButtonProps {
    userId: string;
    serviceId?: string;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "default";
    className?: string;
    openInNewTab?: boolean;
}

interface Conversation {
    _id: string;
    user: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    lastMessage: {
        content: string;
        createdAt: Date;
    };
    unreadCount: number;
}

export const ChatButton = ({ 
    userId, 
    serviceId, 
    variant = "outline",
    size = "sm",
    className = "",
    openInNewTab = false
}: ChatButtonProps) => {
    const router = useRouter();
    const { conversations = [], sendMessage, fetchConversations } = useChatContext();
    const [isStarting, setIsStarting] = useState(false);

    const navigateToChat = (path: string) => {
        if (openInNewTab) {
            // Open in new tab
            window.open(path, '_blank', 'noopener,noreferrer');
        } else {
            // Navigate in same tab
            router.push(path);
        }
    };

    const handleClick = async () => {
        setIsStarting(true);
        try {
            // Ensure conversations is an array before calling find
            const existingConv = Array.isArray(conversations) 
                ? conversations.find((conv: Conversation) => conv.user._id === userId)
                : null;

            if (existingConv) {
                navigateToChat(`/chat/${existingConv._id}${serviceId ? `?service=${serviceId}` : ''}`);
                return;
            }

            // If no existing conversation, create one
            await sendMessage(userId, "Hello!", serviceId);
            
            // Wait for conversations to refresh
            await fetchConversations();
            
            // Get the updated conversations
            const updatedConvs = await fetchConversations();
            const newConv = Array.isArray(updatedConvs)
                ? updatedConvs.find((conv: Conversation) => conv.user._id === userId)
                : null;

            if (newConv) {
                navigateToChat(`/chat/${newConv._id}${serviceId ? `?service=${serviceId}` : ''}`);
            } else {
                console.error("Failed to create new conversation");
                // Fallback: redirect to chat with userId directly
                navigateToChat(`/chat/${userId}${serviceId ? `?service=${serviceId}` : ''}`);
            }
        } catch (error) {
            console.error("Failed to start conversation:", error);
            // Fallback: redirect to chat with userId directly
            navigateToChat(`/chat/${userId}${serviceId ? `?service=${serviceId}` : ''}`);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant={variant}
            size={size}
            disabled={isStarting}
            className={`flex items-center gap-2 ${className}`}
        >
            {isStarting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <MessageSquare className="w-4 h-4" />
                    Message
                </>
            )}
        </Button>
    );
};