"use client"
import React from 'react'
import { Service } from "@/types/types"
import { useServicesContext } from '@/context/servicesContext';
import Image from "next/image";
import { CardTitle, CardDescription } from '../ui/card';
import { formatDates } from '@/utils/formatDates';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/globalContext';
import { ChatButton } from "@/Components/Chat/ChatButton";

interface ServiceProps {
    service: Service;
}

function MyServiceViewOnly({ service }: ServiceProps) {
    const { updateApplicationStatus } = useServicesContext();
    const router = useRouter();
    const { userProfile } = useGlobalContext();

    const userApplication = service.applicants.find((applicant) => 
        typeof applicant === "object" && "user" in applicant && applicant.user === userProfile._id
    );
    const applicationStatus = userApplication?.status || "Unknown";
    const statusUpdatedDate = userApplication?.updatedAt || null;

    const hasRated = service.ratings.some(rating => 
        typeof rating === "object" && "user" in rating && rating.user === userProfile._id
    );

    const handleCompleteService = async () => {
        try {
            await updateApplicationStatus(service._id, userProfile._id, "completed");
        } catch (error) {
            console.error("Failed to mark service as completed:", error);
        }
    };

    const handleRateService = () => {
        router.push(`/rate-service/${service._id}`);
    };

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
            {/* Top Section */}
            <div 
                className="flex items-center gap-3 mb-4 cursor-pointer group"
                onClick={() => router.push(`/service/${service._id}`)}
            >
                <Image 
                    alt={`${service.provider.name}'s profile`}
                    src={service.provider.profilePicture || '/avatar.png'} 
                    width={48} 
                    height={48} 
                    className="rounded-full border-2 border-gray-200 group-hover:border-[#7263f3] transition-colors"
                />
                <div className="group-hover:text-[#7263f3] transition-colors">
                    <CardTitle className="text-lg font-semibold line-clamp-1">{service.title}</CardTitle>
                    <CardDescription className="text-sm">by {service.provider.name}</CardDescription>
                </div>
            </div>

            {/* Tags Section */}
            {service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag, index) => (
                        <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs hover:bg-[#7263f3]/10 hover:text-[#7263f3] transition-colors"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Desktop Footer - Original Layout */}
            <div className="hidden md:block mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge 
                            variant={
                                applicationStatus === "accepted" ? "default" : 
                                applicationStatus === "pending" ? "secondary" : 
                                applicationStatus === "rejected" ? "destructive" : 
                                applicationStatus === "completed" ? "outline" : "outline"
                            }
                            className="capitalize px-2 py-1"
                        >
                            {applicationStatus}
                        </Badge>
                        {statusUpdatedDate && (
                            <span className="text-xs text-gray-400 ml-2">
                                {formatDates(statusUpdatedDate)}
                            </span>
                        )}
                    </div>

                    {applicationStatus === "accepted" && (
                        <div className="flex gap-2">
                            <ChatButton 
                                userId={service.provider._id.toString()}
                                serviceId={service._id.toString()}
                                variant="outline"
                                size="sm"
                                openInNewTab={true}
                            />
                            <Button 
                                onClick={handleCompleteService}
                                size="sm"
                                className="bg-[#7263f3] hover:bg-[#5e52d6] text-white shadow-sm"
                            >
                                Mark Complete
                            </Button>
                        </div>
                    )}

                    {applicationStatus === "completed" && !hasRated && (
                        <Button 
                            onClick={handleRateService}
                            size="sm"
                            variant="outline"
                            className="border-[#7263f3] text-[#7263f3] hover:bg-[#7263f3]/10 transition-colors shadow-sm"
                        >
                            Rate Service
                        </Button>
                    )}

                    {applicationStatus === "completed" && hasRated && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                            Rated
                        </Badge>
                    )}
                </div>
            </div>

            {/* Mobile Footer - Optimized Layout */}
            <div className="md:hidden mt-auto pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge 
                                variant={
                                    applicationStatus === "accepted" ? "default" : 
                                    applicationStatus === "pending" ? "secondary" : 
                                    applicationStatus === "rejected" ? "destructive" : 
                                    applicationStatus === "completed" ? "outline" : "outline"
                                }
                                className="capitalize px-2 py-1 text-xs"
                            >
                                {applicationStatus}
                            </Badge>
                        </div>
                        {statusUpdatedDate && (
                            <span className="text-xs text-gray-400">
                                {formatDates(statusUpdatedDate)}
                            </span>
                        )}
                    </div>

                    {applicationStatus === "accepted" && (
                        <div className="grid grid-cols-2 gap-2">
                            <ChatButton 
                                userId={service.provider._id.toString()}
                                serviceId={service._id.toString()}
                                variant="outline"
                                size="sm"
                                className="w-full"
                                openInNewTab={true}
                            />
                            <Button 
                                onClick={handleCompleteService}
                                size="sm"
                                className="w-full bg-[#7263f3] hover:bg-[#5e52d6] text-white shadow-sm"
                            >
                                Complete
                            </Button>
                        </div>
                    )}

                    {applicationStatus === "completed" && !hasRated && (
                        <Button 
                            onClick={handleRateService}
                            size="sm"
                            variant="outline"
                            className="w-full border-[#7263f3] text-[#7263f3] hover:bg-[#7263f3]/10 transition-colors shadow-sm"
                        >
                            Rate Service
                        </Button>
                    )}

                    {applicationStatus === "completed" && hasRated && (
                        <div className="flex justify-end">
                            <Badge variant="outline" className="text-green-600 border-green-200">
                                Rated
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyServiceViewOnly