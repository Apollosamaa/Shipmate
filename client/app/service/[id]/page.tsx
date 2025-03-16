"use client"
import Header from '@/Components/Header'
import ServiceCard from '@/Components/ServiceItem/ServiceCard'
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext';
import { Service } from '@/types/types';
import { formatDates } from '@/utils/formatDates';
import formatMoney from '@/utils/formatMoney';
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
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">

                <div className="w-14 h-14 relative rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
                  <Image src={profilePicture || "/avatar.png"} alt={name} width={45} height={45} className="rounded-md"/>
                </div>

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
            <h1 className="text-2xl font-semibold">{title}</h1>
            <div className="mt-2 flex gap-4 justify-between items-center">
              <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-green-500/20 rounded-xl">
                <span className="font-sm">Price</span>
                <span className="font-bold">{formatMoney(price, "MYR")}</span>
              </p>

              <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-purple-500/20 rounded-xl">
                <span className="font-sm">Posted</span>
                <span className="font-bold">{formatDates(createdAt)}</span>
              </p>

              <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-yellow-500/20 rounded-xl">
                <span className="font-sm">Category</span>
                <span className="font-bold">{category[0]}</span>
              </p>

              <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-blue-500/20 rounded-xl">
                <span className="font-sm">Applicants</span>
                <span className="font-bold">{applicants.length}</span>
              </p>
            </div>

            <h2 className="font-bold text-2xl mt-2">Service Decsription</h2>
          </div>

          <div className="wysiwyg mt-2" dangerouslySetInnerHTML={{__html: description}}></div>
        </div>

        <div className="w-[26%] flex flex-col gap-8">

        </div>
      </div>
    </div>
  )
}

export default page
