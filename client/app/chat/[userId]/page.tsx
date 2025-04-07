// app/chat/[userId]/page.tsx - Updated version
"use client";
import { ChatWindow } from "@/Components/Chat/ChatWindow";
import { ChatList } from "@/Components/Chat/ChatList";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  const { userProfile } = useGlobalContext();
  const router = useRouter();
  const params = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile view
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (params?.userId) {
      setUserId(params.userId as string);
    }
  }, [params]);

  if (!userProfile) {
    router.push("/");
    return null;
  }

  if (isMobile) {
    return userId ? (
      <ChatWindow 
        userId={userId} 
        showBackButton={true}
        onBack={() => router.push('/chat')}
      />
    ) : (
      <div className="h-screen">
        <ChatList compact={false} openInNewTab={false} />
      </div>
    );
  }

  // Desktop view remains unchanged
  return (
    <div className="flex h-screen">
      <div className="w-[30%] border-r">
        <ChatList />
      </div>
      
      <div className="w-[70%]">
        {userId ? (
          <ChatWindow userId={userId} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p>Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}