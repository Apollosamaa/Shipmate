// app/messages/page.tsx
"use client";
import { useChatContext } from "@/context/chatContext";
import { useGlobalContext } from "@/context/globalContext";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { MessageSquare, PlusCircle } from "lucide-react";

// Type definitions
interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
  };
  createdAt: Date | string;
}

interface Conversation {
  _id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// Loading skeleton component
const ConversationSkeleton = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="rounded-full bg-gray-200 h-12 w-12 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
      </div>
    ))}
  </>
);

export default function MessagesPage() {
  const { conversations, loading } = useChatContext();
  const { userProfile } = useGlobalContext();

  // Format date without date-fns
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Messages
        </h1>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <ConversationSkeleton count={5} />
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No conversations yet</h3>
            <p className="text-gray-500 mt-2">
              Start a conversation by messaging a service provider
            </p>
          </div>
        ) : (
          conversations.map((conversation: Conversation) => (
            <ConversationItem 
              key={conversation._id}
              conversation={conversation}
              currentUserId={userProfile._id}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Separate component for conversation item
const ConversationItem = ({
  conversation,
  currentUserId,
  formatDate
}: {
  conversation: Conversation;
  currentUserId: string;
  formatDate: (date: string | Date) => string;
}) => {
  const { user, lastMessage, unreadCount } = conversation;
  const isCurrentUserSender = lastMessage.sender._id === currentUserId;

  return (
    <Link
      href={`/chat/${conversation._id}`}
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.profilePicture} />
        <AvatarFallback>
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate">{user.name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDate(lastMessage.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">
          {isCurrentUserSender && "You: "}
          {lastMessage.content}
        </p>
      </div>

      {unreadCount > 0 && (
        <span className="bg-[#7263f3] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};