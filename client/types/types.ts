export type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

interface UserReference {
    _id: string;
    name: string;
    profilePicture?: string;
}

interface Rating {
    user: string | UserReference; 
    rating: number;
    review?: string;
    _id?: string; 
    createdAt?: string;
}

interface Applicant {
    user: string | UserReference; 
    status: ApplicationStatus;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

interface Service {
    _id: string;
    title: string;
    description: string;
    price: number;
    negotiable: boolean;
    tags: string[];
    category: string[];
    applicants: Applicant[];
    likes: string[];
    ratings: Rating[];
    averageRating?: number; 
    provider: {
        _id: string; 
        profilePicture?: string; 
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    _id: string;
    sender: string | UserReference;
    receiver: string | UserReference;
    content: string;
    conversationId?: string;
    serviceId?: string;
    read: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Conversation {
    _id: string;
    participants: UserReference[];
    lastMessage: Message;
    unreadCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export type { Service, Applicant, Rating, UserReference, };