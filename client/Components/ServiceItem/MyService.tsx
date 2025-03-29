"use client"
import React from 'react'
import { Service } from "@/types/types"
import { useServicesContext } from '@/context/servicesContext';
import Image from "next/image";
import { CardTitle } from '../ui/card';
import { formatDates } from '@/utils/formatDates';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServiceProps {
    service: Service;
}

function MyService({ service }: ServiceProps) {
    const { deleteService } = useServicesContext();
    const { applicants, provider } = service;
    const router = useRouter();

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div 
                className="flex items-center space-x-4 mb-4 cursor-pointer group"
                onClick={() => router.push(`/service/${service._id}`)}
            >
                <Image 
                    alt="Provider profile" 
                    src={provider.profilePicture || '/avatar.png'} 
                    width={48} 
                    height={48} 
                    className="rounded-full border-2 border-gray-200 group-hover:border-[#7263f3] transition-colors"
                />
                <div className="group-hover:text-[#7263f3] transition-colors">
                    <CardTitle className="text-xl font-bold truncate">{service.title}</CardTitle>
                    <p className="text-sm font-semibold text-muted-foreground group-hover:text-[#7263f3]/80">
                        {applicants?.length > 0 ? `${applicants.length} Applicant(s)` : "No Applicants Yet"}
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

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex-1"></div>
                    <div className="flex gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-[#7263f3] hover:bg-[#7263f3]/10"
                        >
                            <Pencil size={16}/>
                            <span className="sr-only">Edit Service</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => deleteService(service._id)}
                        >
                            <Trash size={16} />
                            <span className="sr-only">Delete Service</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyService