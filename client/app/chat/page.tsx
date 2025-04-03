"use client";
import { ChatList } from "@/Components/Chat/ChatList";
import { useGlobalContext } from "@/context/globalContext";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DefaultChatPage() {
    const { userProfile } = useGlobalContext();
    const router = useRouter();
  
    if (!userProfile) {
      router.push("/");
      return null;
    }
  
    return (
      <div className="flex h-screen">
        {/* Left sidebar - 30% width */}
        <div className="w-[30%] border-r">
          <ChatList />
        </div>
        
        {/* Right empty state - 70% width */}
        <div className="w-[70%] flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <MessageSquare className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Select a conversation</h3>
            <p>Choose from your existing conversations</p>
          </div>
        </div>
      </div>
    );
  }