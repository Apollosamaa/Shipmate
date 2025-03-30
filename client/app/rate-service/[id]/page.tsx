"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { useServicesContext } from "@/context/servicesContext";
import { useGlobalContext } from "@/context/globalContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Star, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";

interface Service {
  _id: string;
  title: string;
  provider: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  // Add other properties you need from the service
}

export default function RateServicePage() {
    const { id } = useParams();
    const router = useRouter();
    const { addRating, getServiceById } = useServicesContext();
    const { userProfile } = useGlobalContext();
    
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [service, setService] = useState<Service | null>(null);
    const [characterCount, setCharacterCount] = useState(0);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const serviceData = await getServiceById(id as string);
                setService(serviceData as Service);
            } catch (error) {
                console.error("Failed to fetch service:", error);
                router.push("/myservices");
            }
        };

        fetchService();
    }, [id]);

    const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(e.target.value);
        setCharacterCount(e.target.value.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await addRating(id as string, userProfile._id, rating, review);
            router.push("/myservices?rated=true");
        } catch (error: unknown) {
            let message = "Failed to submit rating";
            if (error instanceof Error) {
                message = error.message.includes("<!DOCTYPE html>") 
                    ? "Server error - please try again later" 
                    : error.message;
            }
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!service) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading service details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#7263f3] mb-6 hover:underline"
                >
                    <ArrowLeft size={18} />
                    Back to My Services
                </button>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="flex items-start gap-4 mb-6">
                        {service.provider.profilePicture && (
                            <Image
                                src={service.provider.profilePicture}
                                alt={service.provider.name}
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-gray-200"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">{service.title}</h2>
                            <p className="text-gray-600">by {service.provider.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <CheckCircle className="text-green-500" size={16} />
                                <span className="text-sm text-gray-500">Service completed</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h1 className="text-2xl font-bold mb-6">How would you rate this service?</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Your Rating
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                            aria-label={`Rate ${star} star`}
                                        >
                                            <Star
                                                size={32}
                                                className={
                                                    star <= rating
                                                        ? "fill-[#7263f3] text-[#7263f3]"
                                                        : "text-gray-300"
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {rating === 0 ? "Select your rating" : 
                                     rating === 1 ? "Poor" :
                                     rating === 2 ? "Fair" :
                                     rating === 3 ? "Good" :
                                     rating === 4 ? "Very Good" : "Excellent"}
                                </p>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="review" className="block text-sm font-medium">
                                        Your Review (Optional)
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {characterCount}/500
                                    </span>
                                </div>
                                <textarea
                                    id="review"
                                    rows={5}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7263f3] focus:border-[#7263f3] transition-colors"
                                    value={review}
                                    onChange={handleReviewChange}
                                    maxLength={500}
                                    placeholder="Share details about your experience with this service..."
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#7263f3] hover:bg-[#5e52d6] transition-colors"
                                    disabled={isSubmitting || rating === 0}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : "Submit Rating"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}