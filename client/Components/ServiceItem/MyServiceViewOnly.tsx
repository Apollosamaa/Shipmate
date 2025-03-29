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

interface ServiceProps {
    service: Service;
}

function MyService({ service }: ServiceProps) {
    const { updateApplicationStatus } = useServicesContext();
    const router = useRouter();
    const { userProfile } = useGlobalContext();

    const userApplication = service.applicants.find((applicant) => 
        typeof applicant === "object" && "user" in applicant && applicant.user === userProfile._id
    );
    const applicationStatus = userApplication?.status || "Unknown";
    const statusUpdatedDate = userApplication?.updatedAt || null;

    const handleCompleteService = async () => {
        try {
            await updateApplicationStatus(service._id, userProfile._id, "completed");
        } catch (error) {
            console.error("Failed to mark service as completed:", error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
            {/* Header with provider info */}
            <div 
                className="flex items-center gap-3 mb-4 cursor-pointer group"
                onClick={() => router.push(`/service/${service._id}`)}
            >
                <Image 
                    alt="Provider profile" 
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

            {/* Tags section */}
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

            {/* Status and action button row */}
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
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
                    <Button 
                        onClick={handleCompleteService}
                        size="sm"
                        className="bg-[#7263f3] hover:bg-[#5e52d6] text-white transition-colors shadow-sm"
                    >
                        Mark Complete
                    </Button>
                )}
            </div>
        </div>
    )
}

export default MyService