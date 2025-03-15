"use client"
import Header from '@/Components/Header'
import MyService from '@/Components/ServiceItem/MyService';
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext'
import { Service } from '@/types/types';
import { useRouter } from 'next/navigation';
import React from 'react'

function page() {
  const { userServices, services } = useServicesContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext(); 

  const [activeTab, setActiveTab] = React.useState("posts")

  const userId = userProfile?.id;
  const router = useRouter();

  const requestServices = services.filter((service: Service) => {
    return service.applicants.includes(userId);
  })

  if(loading){
    return null;
  }

  return (
    <div>
      <Header/>

      <div className="mt-8 w-[90%] mx-auto flex flex-col">
        <div className="self-center flex items-center gap-6">
          <button className={`border border-gray-400 px-8 py-2 rounded-full font-medium
            ${
              activeTab === "posts" ? "border-transparent bg-[#7263f3] text-white" : "border-gray-400"
            }
            `}
            onClick={()=> setActiveTab("posts")}
          >
              My Service Posts
          </button>
          <button className={`border border-gray-400 px-8 py-2 rounded-full font-medium
            ${
              activeTab === "request" ? "border-transparent bg-[#7263f3] text-white" : "border-gray-400"
            }
            `}
            onClick={()=> setActiveTab("request")}
          >
            Requested Services
          </button>
        </div>
        

        {activeTab === "posts" && userServices.length === 0 && (
          <div className="mt-8 flex items-center">
            <p className="text-2xl font-bold">No Service posts found.</p>
          </div>
        )}

        {activeTab === "request" && requestServices.length === 0 && (
          <div className="mt-8 flex items-center">
            <p className="text-2xl font-bold">No services request found.</p>
          </div>
        )}

        <div className="my-8 grid grid-cols-2 gap-6">
          {activeTab === "posts" &&
            userServices.map((service: Service) => (<MyService key={service._id} service={service}/>))}
        </div>

      </div>
    </div>
  )
}

export default page
