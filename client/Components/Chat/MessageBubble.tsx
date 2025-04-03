"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  isSender: boolean;
  senderImage?: string;
  senderName?: string;
  timestamp: Date | string; // Update to accept both types
  isRead?: boolean;
}

export const MessageBubble = ({ 
  content, 
  isSender, 
  senderImage,
  senderName,
  timestamp,
  isRead = true
}: MessageBubbleProps) => {
  // Convert timestamp to Date if it's a string
  const messageDate = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return (
    <div className={`flex gap-2 ${isSender ? "justify-end" : "justify-start"} mb-1`}>
      {!isSender && (
        <Avatar className="h-8 w-8 mt-auto">
          <AvatarImage src={senderImage} />
          <AvatarFallback>
            {senderName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-xs p-3 rounded-lg ${
        isSender 
          ? "bg-[#7263f3] text-white rounded-tr-none" 
          : "bg-gray-100 rounded-tl-none"
      }`}>
        <p className="text-sm">{content}</p>
        <p className={`text-xs mt-1 ${
          isSender ? "text-[#e0dcff]" : "text-gray-500"
        }`}>
          {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isSender && (
            <span className={`ml-2 ${
              isRead ? "text-[#e0dcff]" : "text-[#ffffff80]"
            }`}>
              {isRead ? "✓✓" : "✓"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};