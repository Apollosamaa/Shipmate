"use client"
import Footer from '@/Components/Footer';
import Header from '@/Components/Header'
import ServiceCard from '@/Components/ServiceItem/ServiceCard'
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext';
import { Service } from '@/types/types';
import { formatDates } from '@/utils/formatDates';
import formatMoney from '@/utils/formatMoney';
import { Bookmark } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { bookmark, bookmarkEmpty } from "@/utils/Icons"

function page() {

  const {services, saveService, applyToService} = useServicesContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter()
  const { id } = params;

  const [isSaved, setIsSaved] = React.useState(false);
  const [isApplied, setIsApplied] = React.useState(false);

  const service = services.find((service: Service) => service._id === id);
  const otherServices = services.filter((service: Service) => service._id !== id);

  useEffect(() => {
    if (service) {
      setIsApplied(service.applicants.some((applicant: { user: string }) => applicant.user === userProfile._id));
    }
  }, [service, userProfile._id]);  
  
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
    <main>
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
                {isSaved? bookmark : bookmarkEmpty}
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

            <h2 className="font-bold text-2xl mt-2">Service Description</h2>
          </div>

          <div className="wysiwyg mt-2" dangerouslySetInnerHTML={{__html: description}}></div>
        </div>

        <div className="w-[26%] flex flex-col gap-8">
          <button className={`text-white py-4 rounded-full hover:text-white ${isApplied ? "bg-green-500 hover:bg-green-500" : "bg-[#7263f3] hover:bg-[#7263f3]/90"}`}
            onClick={()=> {
              if(isAuthenticated){
                if(!isApplied) {
                  applyToService(service._id)
                  setIsApplied(true)
                } else{
                  toast.error("You have already applied to this service")
                }
              } else {
                router.push("http://localhost:8000/login")
              }
            }}>
            {isApplied ? "Applied" : "Apply Now"}
          </button>

          <div className="p-6 flex flex-col gap-2 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Other Information</h3>
            <div className="flex flex-col gap-2">
              <p>
                <span  className="font-bold">Posted:</span> {formatDates(createdAt)}
              </p>

              <p>
                <span className="font-bold">Price negotiable: </span>
                <span className={` ${
                negotiable? "text-green-400" : "text-red-400"}`}>{negotiable ? "Yes" : "No" }</span>
              </p>

              <p>
                <span className="font-bold">Category:</span> {category[0]}
              </p>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-2 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Tags</h3>
            <p>Other relevant tags for the service provided.</p>

            <div className="flex flex-wrap gap-4">
              {service.tags.map((tag: string, index: number) => (
                <span key={index} className="px-4 py-1 rounded-full text-sm font-medium flex items-center bg-indigo-500/20 text-[#7263f3]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default page
