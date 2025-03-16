"use client"
import Header from '@/Components/Header'
import ServiceCard from '@/Components/ServiceItem/ServiceCard'
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext';
import { Service } from '@/types/types';
import { Bookmark } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

function page() {

  const {services, saveService} = useServicesContext();
  const { userProfile } = useGlobalContext();
  const params = useParams();
  const { id } = params;

  const [isSaved, setIsSaved] = React.useState(false);

  const service = services.find((service: Service) => service._id === id);
  const otherServices = services.filter((service: Service) => service._id !== id);

  useEffect(() => {
    if(service){
      setIsSaved(service.likes.includes(userProfile._id))
    }
  }, [service, userProfile._id])

  if(!service) return null;

  const { 
    title,
    description,
    price,
    provider,
    applicants,
    category,
    createdAt,
    negotiable,
  } = service;

  const { name , profilePicture } = provider;

  const handleSave = (id: string) => {
    setIsSaved((prev) => !prev);
    saveService(id);
  };

  return (
    <div>
      <Header />
      
      <div className="p-8 mb-8 mx-auto w-[90%] rounded-md flex gap-8">
        <div className="w-[26%] flex flex-col gap-8">
          <ServiceCard activeService service={service}/>

          {otherServices.map((service: Service) => (
            <ServiceCard key={service._id} service={service}/>
          ))}
        </div>

        <div className="flex-1 bg-white p-6 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image src={profilePicture || "/avatar.png"} alt={name} width={50} height={50} className="rounded-md"/>

              <div>
                <p className="font-bold">{name}</p>
                <p className="font-sm">Provider</p>
              </div>

              
            </div>

            <button className={`text-2xl ${
              isSaved ? "text-[#7263f3]" : "text-gray-400"}`} onClick={()=> handleSave(service._id)}>
              {isSaved? <Bookmark size={24}/> : <Bookmark size={24}/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
