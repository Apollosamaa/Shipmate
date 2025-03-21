"use client"
import Footer from '@/Components/Footer';
import Header from '@/Components/Header'
import MyService from '@/Components/ServiceItem/MyService';
import MyServiceViewOnly from '@/Components/ServiceItem/MyServiceViewOnly';
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext'
import { Service } from '@/types/types';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function page() {
  const { userServices, services } = useServicesContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext(); 

  const [activeTab, setActiveTab] = React.useState("posts")

  const userId = userProfile?._id || userProfile?.sub;
console.log("User ID:", userId);

  const router = useRouter();

  useEffect(()=> {
    if(!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login")
    }
  }, [isAuthenticated])

  console.log("All Services:", services);

  services.forEach((service: Service) => {
    console.log(`Checking Service: ${service.title}`, service.applicants);
  });

  const requestServices = services.filter((service: Service) => 
    service.applicants.some((applicant: any) => {
      console.log("Applicant:", applicant);
      return applicant?.user === userId;
    })
  );

  console.log("Filtered Requested Services:", requestServices);


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

          {activeTab === "request" &&
            requestServices.map((service: Service) => (<MyServiceViewOnly key={service._id} service={service}/>))}
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default page
