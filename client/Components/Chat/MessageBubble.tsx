"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  isSender: boolean;
  senderImage?: string;
  senderName?: string;
  timestamp: Date | string;
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
        <div className={`flex items-center justify-end gap-1 mt-1 ${
          isSender ? "text-[#e0dcff]" : "text-gray-500"
        }`}>
          <span className="text-xs">
            {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isSender && (
            <span className={`ml-1 ${
              isRead ? "text-[#e0dcff]" : "text-[#ffffff80]"
            }`}>
              {isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};