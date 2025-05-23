"use client";
import { MessageSquare, MailWarning } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useChatContext } from "@/context/chatContext";
import { useGlobalContext } from "@/context/globalContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { ChatList } from "./ChatList";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ChatDropdownProps {
  mobile?: boolean;
}

export const ChatDropdown = ({ mobile = false }: ChatDropdownProps) => {
  const { isAuthenticated } = useGlobalContext();
  const { 
    totalUnread, 
    conversations, 
    loading, 
    fetchConversations,
    initialLoadComplete,
    error
  } = useChatContext();

  useEffect(() => {
    if (isAuthenticated && !initialLoadComplete) {
      fetchConversations();
    }
  }, [isAuthenticated, initialLoadComplete, fetchConversations]);

  if (!isAuthenticated) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size={mobile ? "sm" : "icon"} 
          className={`relative ${mobile ? "rounded-md" : "rounded-full"}`}
        >
          <MessageSquare className={`${mobile ? "h-4 w-4" : "h-5 w-5"}`} />
          {totalUnread > 0 && (
            <span className={`absolute ${mobile ? "-top-0.5 -right-0.5 h-4 w-4 text-[10px]" : "-top-1 -right-1 h-5 w-5 text-xs"} bg-[#7263f3] text-white rounded-full flex items-center justify-center`}>
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" forceMount>
        <div className="border-b p-4">
          <h3 className="font-semibold">Messages</h3>
        </div>
        
        {error ? (
          <div className="p-4 text-center text-red-500">
            <p>Failed to load messages</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fetchConversations()}
            >
              Retry
            </Button>
          </div>
        ) : !initialLoadComplete ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
            <MailWarning className="h-8 w-8 mb-2" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation with someone</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <ChatList compact openInNewTab={true} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};