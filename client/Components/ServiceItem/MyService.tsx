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
        <div className="p-8 bg-white rounded-xl flex flex-col gap-5">
            <div className="flex items-center space-x-4 mb-2 cursor-default" onClick={()=>router.push(`/service/${service._id}`)}>
                <Image alt={`logo`} src={service.provider.profilePicture || '/avatar.png'} width={48} height={48} className="rounded-full"/>

                <div>
                    <CardTitle className="text-xl font-bold truncate">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-semibold">
                        {applicants?.length > 0 ? `${applicants.length} Applicant(s)` : "No Applicants Yet"}
                    </p>
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
                    <div className="self-end">
                        <Button variant="ghost" size="icon" className="text-gray-500">
                            <Pencil size={14}/>
                            <span className="sr-only">Edit Service</span>
                        </Button>

                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-300" onClick={()=> deleteService(service._id)}>
                            <Trash size={14} />
                            <span className="sr-only">Delete Service</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyService
