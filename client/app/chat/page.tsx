// app/chat/page.tsx - Mobile-optimized version
"use client";
import { ChatList } from "@/Components/Chat/ChatList";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DefaultChatPage() {
  const { userProfile } = useGlobalContext();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!userProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="h-screen">
      <ChatList compact={false} openInNewTab={false} />
    </div>
  );
}