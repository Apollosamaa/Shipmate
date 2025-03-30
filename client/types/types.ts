export type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

interface UserReference {
    _id: string;
    name: string;
    profilePicture?: string;
}

interface Rating {
    user: string | UserReference; // Can be just ID or populated user
    rating: number;
    review?: string;
    _id?: string; // For mongoose documents
    createdAt?: string;
}

interface Applicant {
    user: string | UserReference; // Can be just ID or populated user
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
    likes: string[]; // Array of user IDs
    ratings: Rating[];
    averageRating?: number; // Added to match your ServiceModel
    provider: {
        _id: string; // Added to match your populated provider
        profilePicture?: string; // Made optional to match your usage
        name: string;
        email?: string; // Added as it's in your populate
    };
    createdAt: string;
    updatedAt: string;
}

export type { Service, Applicant, Rating, UserReference };