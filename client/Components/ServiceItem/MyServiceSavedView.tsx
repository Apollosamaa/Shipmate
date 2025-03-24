
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

function MyService({ service }: ServiceProps) {
    const { deleteService } = useServicesContext();
    const router = useRouter();

    const { userProfile } = useGlobalContext();

    // Find the current user's application status
    const userApplication = service.applicants.find((applicant) => 
        typeof applicant === "object" && "user" in applicant && applicant.user === userProfile._id
    );
    const applicationStatus = userApplication?.status || "Unknown";



    return (
        <div className="p-8 bg-white rounded-xl flex flex-col gap-5">
            <div className="flex items-center space-x-4 mb-2 cursor-default" onClick={()=>router.push(`/service/${service._id}`)}>
                <Image alt={`logo`} src={service.provider.profilePicture || '/avatar.png'} width={48} height={48} className="rounded-full"/>

                <div>
                    <CardTitle className="text-xl font-bold truncate">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.provider.name}</p>
                </div>
            </div>
            <div>
                <p className="text-sm text-muted-foreground mb-4">Posted {formatDates(service.createdAt)}</p>

                <div className="flex justify-between">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {service.tags.map((tag, index)=>
                                <Badge key={index} variant="outline">
                                    {tag}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyService
