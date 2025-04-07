"use client";
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "@/context/chatContext";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { MessageBubble } from "./MessageBubble";
import { ArrowLeft, Send, Loader2, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Message, UserReference } from "@/types/types";

interface ChatWindowProps {
    userId: string;
    showBackButton?: boolean;
    onBack?: () => void;
}

export const ChatWindow = ({ 
    userId, 
    showBackButton = false,
    onBack = () => {}
  }: {
    userId: string;
    showBackButton?: boolean;
    onBack?: () => void;
  }) => {
    const [isMobile, setIsMobile] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recipientInfo, setRecipientInfo] = useState<UserReference | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null);

    const {
        messages,
        sendMessage,
        activeConversation,
        markMessagesAsRead,
        fetchMessages,
        error
    } = useChatContext();

    const { userProfile } = useGlobalContext();
    const serviceId = searchParams.get("service");

    // Find and set recipient information when messages or activeConversation changes
    useEffect(() => {
        if (activeConversation?.participants) {
            const recipient = activeConversation.participants.find(
                (p: UserReference) => p._id !== userProfile._id
            );
            if (recipient) {
                setRecipientInfo(recipient);
                return;
            }
        }
    
        if (messages.length > 0) {
            for (const msg of messages) {
                // Check if the message contains a valid recipient
                if (typeof msg.sender === 'object' && msg.sender._id !== userProfile._id) {
                    setRecipientInfo(msg.sender);
                    return;
                } else if (typeof msg.receiver === 'object' && msg.receiver._id !== userProfile._id) {
                    setRecipientInfo(msg.receiver);
                    return;
                }
            }
        }
        
        // If no valid recipient found, set default (but keep existing if we had it)
        setRecipientInfo(prev => prev || { 
            _id: userId, 
            name: 'Chat',
            profilePicture: ''
        });
    }, [messages, activeConversation, userProfile._id, userId]);

    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            try {
                await fetchMessages(userId);
            } catch (err) {
                console.error("Failed to load messages:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            loadMessages();
        }
    }, [userId, fetchMessages]);

    useEffect(() => {
        if (messages.length > 0) {
            markMessagesAsRead(userId);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, userId, markMessagesAsRead]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendMessage(userId, message, serviceId || undefined);
            setMessage("");
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center gap-4 bg-white">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>...</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold">Loading...</h2>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full">
                {/* Same header as above */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-red-500">
                        <p>Failed to load messages</p>
                        <Button 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                            className="mt-2"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
                {(showBackButton || isMobile) && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onBack}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                )}

                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={recipientInfo?.profilePicture || '/default-avatar.png'} />
                        <AvatarFallback>
                            {recipientInfo?.name?.charAt(0).toUpperCase() || 'C'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">
                            {recipientInfo?.name || "Chat"}
                        </h2>
                        {serviceId && (
                            <p className="text-xs text-gray-500">
                                About: Service #{serviceId.slice(0, 6)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageSquare className="h-8 w-8 mb-2" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation</p>
                    </div>
                ) : (
                    messages.map((msg: Message) => (
                        <MessageBubble
                            key={msg._id}
                            content={msg.content}
                            isSender={typeof msg.sender === 'object' 
                                ? msg.sender._id === userProfile._id
                                : msg.sender === userProfile._id}
                            senderImage={typeof msg.sender === 'object' 
                                ? msg.sender.profilePicture
                                : undefined}
                            senderName={typeof msg.sender === 'object' 
                                ? msg.sender.name
                                : 'You'}
                            timestamp={msg.createdAt} // This can be string or Date
                            isRead={msg.read}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form 
                onSubmit={handleSubmit} 
                className="p-4 border-t bg-white sticky bottom-0"
            >
                <div className="flex gap-2">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        disabled={!message.trim() || isSending}
                    >
                        {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};