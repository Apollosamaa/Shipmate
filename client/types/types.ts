interface Service {
    _id: string;
    title: string;
    description: string;
    price: number;
    negotiable: boolean;
    tags: string[];
    category: string[];
    applicants: string[];
    likes: string[];
    ratings: string[];
    provider: {
        profilePicture: string;
        name: string;
    }
    createdAt: string;
    updatedAt: string;
}

export type { Service };