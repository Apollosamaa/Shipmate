interface Applicant {
    user: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    status: string;
    _id: string;
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
    ratings: string[];
    provider: {
        profilePicture: string;
        name: string;
    }
    createdAt: string;
    updatedAt: string;
}

export type { Service, Applicant };