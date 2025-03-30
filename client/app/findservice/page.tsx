"use client"
import Header from '@/Components/Header'
import SearchForm from '@/Components/SearchForm';
import ServiceCard from '@/Components/ServiceItem/ServiceCard';
import Filters from '@/Components/Filters';
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext'
import { Service } from '@/types/types';
import { grip, list, table } from '@/utils/Icons';
import Image from 'next/image';
import React from 'react'
import Footer from '@/Components/Footer';

function page() {

  const [columns, setColumns] = React.useState(3);

  //cycle 1,2,3
  const toggleGridColumns = () => {
    setColumns((prev)=>(prev === 3 ? 2: prev === 2 ? 1 :3))
  }

  const getIcon = () => {
    if(columns === 3 ) return grip;
    if(columns === 2 ) return table;
    return list;
  }

  const { saveService, services, applyService, filters } = useServicesContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  
  const filteredServices = 
    filters.academicAssistance ||  
    filters.technicalIT ||
    filters.creativeMedia ||
    filters.eventEntertainment ||
    filters.healthWellness ||
    filters.transportationWellness ||
    filters.miscellaneous ?
    services.filter((service:Service) => {
      if(filters.academicAssistance && service.category.includes("Academic Assistance"))
        return true;
      if(filters.technicalIT && service.category.includes("Technical & IT"))
        return true;
      if(filters.creativeMedia && service.category.includes("Creative & Media"))
        return true;
      if(filters.eventEntertainment && service.category.includes("Event & Entertainment"))
        return true;
      if(filters.healthWellness && service.category.includes("Health & Wellness"))
        return true;
      if(filters.transportationWellness && service.category.includes("Transportation & Delivery"))
        return true;
      if(filters.miscellaneous && service.category.includes("Miscellaneous"))
        return true;
    })
    : services;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="relative px-16 bg-[#D7DEDC] overflow-hidden">
        <h1 className="py-8 text-black font-bold text-3xl relative z-10">Find Your Service Here</h1>
        <div className="pb-8 pt-2 relative z-10">
          <SearchForm />
        </div>

        <Image 
          src="/material0.jpg"
          alt="material1"
          width={200}
          height={500}
          className="clip-path w-[15rem] opacity-80 py-5 absolute z-0 top-[0] right-[-11rem] h-full object-cover"
        />

        <Image 
          src="/material1.jpg"
          alt="material1"
          width={200}
          height={500}
          className="clip-path opacity-70 w-[15rem] py-5 absolute z-0 top-[0] right-[1rem] h-full object-cover"
        />

        <Image 
          src="/material2.jpg"
          alt="material2"
          width={200}
          height={500}
          className="clip-path opacity-60 w-[15rem] py-5 absolute z-0 top-[0] right-[13rem] h-full object-cover"
        />

        <Image 
          src="/material3.jpg"
          alt="material3"
          width={200}
          height={500}
          className="clip-path opacity-50 w-[15rem] py-5 absolute z-0 top-[0] right-[25rem] h-full object-cover"
        />

        <Image 
          src="/material4.jpg"
          alt="material4"
          width={200}
          height={500}
          className="clip-path opacity-50 w-[15rem] py-5 absolute z-0 top-[0] right-[37rem] h-full object-cover"
        />

        <Image 
          src="/material5.jpg"
          alt="material5"
          width={200}
          height={500}
          className="clip-path opacity-40 w-[15rem] py-5 absolute z-0 top-[0] right-[49rem] h-full object-cover"
        />

        <Image 
          src="/material6.jpg"
          alt="material6"
          width={200}
          height={500}
          className="clip-path opacity-40 w-[15rem] py-5 absolute z-0 top-[0] right-[61rem] h-full object-cover"
        />
        
      </div>

      <div className="w-[90%] mx-auto mb-14">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-black py-8">Recent Services</h2>

          <button 
            onClick={toggleGridColumns}
            className="flex items-center gap-4 border border-gray-400 px-8 py-2 rounded-full font-medium"  
          >
            <span>
              {columns === 3 ? "Grid View" : columns === 2 ? "Table View" : "List View"}
            </span>
            <span className="text-lg">{getIcon()}</span>
          </button>
        </div>

        <div className="flex gap-8">
          <Filters />

          <div className={`self-start flex-1 grid gap-8 ${columns === 3 ? "grid-cols-3": columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {services.length > 0 ? (
                filteredServices.map((service: Service) => (
                  
                  <ServiceCard key={service._id} service={service} />
                ))
                
              ) : (
                <div className="mt-1 flex items-center"><p className="text-2xl text-gray-400 font-bold">No Services Found!</p></div>
              )}
          </div>
        </div>
      </div>
      < Footer />
    </div>
  )
}

export default page
