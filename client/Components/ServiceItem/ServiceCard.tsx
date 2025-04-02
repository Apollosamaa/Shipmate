import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext';
import { Service } from '@/types/types';
import { Bookmark, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { Separator } from '../ui/separator';
import formatMoney from '@/utils/formatMoney';
import { formatDates } from '@/utils/formatDates';
import { bookmark, bookmarkEmpty } from '@/utils/Icons'
import { Star } from 'lucide-react';

interface ServiceProps {
    service: Service;
    activeService?: boolean;
}

function ServiceCard({ service, activeService}: ServiceProps) {

    const { saveService } = useServicesContext();
    const { userProfile, isAuthenticated } = useGlobalContext();
    const [isSaved, setIsSaved] = React.useState(false);

    const {
        title,
        price,
        provider,
        applicants,
        category,
        createdAt,
    } = service;

    const { name, profilePicture} = provider;

    const router = useRouter();

    const handleSave = (id:string) => {
        setIsSaved((prev) =>!prev);
        saveService(id);
    }

    useEffect(()=> {
        setIsSaved(service.likes.includes(userProfile._id))
    }, [service.likes, userProfile._id])

    const shortDescription = "Lorem ipsum dolor sit amet, consectetur adipis. Curabitur velit vit arcu.";

    const serviceCategoryBg = (category: string) => {
        switch (category) {
            case "Academic Assistance":
                return "bg-green-500/20 text-green-600";
            case "Technical & IT":
                return "bg-blue-500/20 text-blue-600";
            case "Creative & Media":
                return "bg-yellow-500/20 text-yellow-600";
            case "Event & Entertainment":
                return "bg-purple-500/20 text-purple-600";
            case "Health & Wellness":
                return "bg-pink-500/20 text-pink-600";
            case "Transportation & Delivery":
                return "bg-teal-500/20 text-teal-600";
            case "Miscellaneous":
                return "bg-gray-500/20 text-gray-600";
            default:
                return "bg-gray-500/20 text-gray-600";
        }
    };

    return (
        <div className={`p-8 rounded-xl flex flex-col gap-5
            ${
                activeService
                    ? "bg-gray-50 shadow-md border-b-2 border-[#7263f3]"
                    : "bg-white"
            }
        `}>
            <div className="flex justify-between">
                <div className="group flex gap-1 items-center cursor-pointer" onClick={()=> router.push(`/service/${service._id}`)}>
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <Image src={profilePicture || "/avatar.png"} alt={name || "name"} width={40} height={40} className="rounded-md"/>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h4 className="group-hover:underline font-bold">{title}</h4>
                        <p className="text-xs">
                            {name}: {applicants.length}{" "}
                            {applicants.length > 1 ? "Applicants" : "Applicants"}
                        </p>
                    </div>
                </div>

                <button className={`text-2xl ${
                        isSaved ? "text-[#7263f3]" : "text-gray-400"
                    }`} onClick={() => {
                        isAuthenticated ? handleSave(service._id) : router.push("http://localhost:8000/login")
                    }}>
                    {isSaved ? bookmark : bookmarkEmpty}
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={16}
                            className={
                                star <= Math.floor(service.averageRating || 0)
                                    ? "fill-[#7263f3] text-[#7263f3]"
                                    : star === Math.ceil(service.averageRating || 0) && 
                                    (service.averageRating || 0) % 1 >= 0.5
                                    ? "fill-[#7263f3]/50 text-[#7263f3]/50"
                                    : "text-gray-300"
                            }
                        />
                    ))}
                    <span className="text-sm font-medium ml-1">
                        ({service.ratings?.length || 0})
                    </span>
                </div>
            </div>


            <div className="flex itmes-center gap-2">
                {category.map((category, index)=>(
                    <span key={index} className={`py-1 px-3 text-xs font-medium rounded-md border ${serviceCategoryBg(category)}`}>
                        {category}
                    </span>
                ))}
            </div>

            

            <Separator />

            <div className="flex justify-between items-center gap-6">
                <p>
                    <span className="font-bold">
                        {formatMoney( price, "MYR")}
                    </span>
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-lg">
                        <Calendar size={16} />
                    </span>
                    Posted: {formatDates(createdAt)}
                </p>
            </div>
        </div>
    )
}

export default ServiceCard
