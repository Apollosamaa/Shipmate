"use client"
import React from 'react'
import { Service } from "@/types/types"
import { useServicesContext } from '@/context/servicesContext';
import Image from "next/image";
import { CardTitle } from '../ui/card';
import { formatDates } from '@/utils/formatDates';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/globalContext';

interface ServiceProps {
    service: Service;
}

function MyServiceSavedView({ service }: ServiceProps) {
    const { deleteService } = useServicesContext();
    const router = useRouter();
    const { userProfile } = useGlobalContext();

    const userApplication = service.applicants.find((applicant) => 
        typeof applicant === "object" && "user" in applicant && applicant.user === userProfile._id
    );
    const applicationStatus = userApplication?.status || "Unknown";

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div 
                className="flex items-center space-x-4 mb-4 cursor-pointer group"
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
                    <CardTitle className="text-xl font-bold truncate">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground group-hover:text-[#7263f3]/80">
                        {service.provider.name}
                    </p>
                </div>
            </div>

            <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-4">Posted {formatDates(service.createdAt)}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag, index) => (
                        <Badge 
                            key={index} 
                            variant="outline"
                            className="hover:bg-[#7263f3]/10 hover:text-[#7263f3] transition-colors"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyServiceSavedView