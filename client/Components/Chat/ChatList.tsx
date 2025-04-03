"use client";
import { useChatContext } from "@/context/chatContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/Components/ui/button";

interface ConversationUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface LastMessage {
  content: string;
  createdAt?: Date | string;
}

interface Conversation {
  _id: string;
  user: ConversationUser;
  lastMessage: LastMessage;
  unreadCount: number;
}

interface ChatListProps {
  compact?: boolean;
}

export const ChatList = ({ compact = false }: ChatListProps) => {
  const { conversations, loading, fetchConversations } = useChatContext();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const [initialLoad, setInitialLoad] = useState(false);

  // Sort conversations by last message date (newest first)
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.lastMessage?.createdAt || 0);
      const dateB = new Date(b.lastMessage?.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [conversations]);

  // Fetch conversations on mount
  useEffect(() => {
    if (!initialLoad) {
      const loadConversations = async () => {
        try {
          await fetchConversations();
          setInitialLoad(true);
        } catch (error) {
          console.error("Failed to load conversations:", error);
        }
      };
      loadConversations();
    }
  }, [fetchConversations, initialLoad]);

  const handleNewConversation = () => {
    router.push(`/chat/${serviceId}${serviceId ? `?service=${serviceId}` : ''}`);
  };

  return (
    <div className={compact ? "" : "border-r h-full overflow-y-auto"}>
      {!compact && (
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>
      )}
      
      {!initialLoad ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : sortedConversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <MessageSquare className="mx-auto h-8 w-8 mb-2" />
          <p>No conversations yet</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-[#7263f3]"
            onClick={handleNewConversation}
          >
            Start a new conversation
          </Button>
        </div>
      ) : (
        sortedConversations.map((conversation: Conversation) => (
          <Link
            key={conversation._id}
            href={`/chat/${conversation._id}`}
            className={`flex items-center gap-3 p-4 border-b hover:bg-gray-50 ${
              pathname.includes(`/chat/${conversation._id}`) 
                ? "bg-[#7263f3]/10" 
                : ""
            }`}
          >
            <Avatar>
              <AvatarImage src={conversation.user.profilePicture} />
              <AvatarFallback>
                {conversation.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{conversation.user.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage.content}
              </p>
            </div>
            {conversation.unreadCount > 0 && (
              <span className="bg-[#7263f3] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </Link>
        ))
      )}
    </div>
  );
};