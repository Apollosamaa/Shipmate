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
import React, { useState } from 'react'
import Footer from '@/Components/Footer';

function page() {
  const [columns, setColumns] = useState(3);
  const [showFilters, setShowFilters] = useState(false);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  }

  const getIcon = () => {
    if (columns === 3) return grip;
    if (columns === 2) return table;
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
      if (filters.academicAssistance && service.category.includes("Academic Assistance"))
        return true;
      if (filters.technicalIT && service.category.includes("Technical & IT"))
        return true;
      if (filters.creativeMedia && service.category.includes("Creative & Media"))
        return true;
      if (filters.eventEntertainment && service.category.includes("Event & Entertainment"))
        return true;
      if (filters.healthWellness && service.category.includes("Health & Wellness"))
        return true;
      if (filters.transportationWellness && service.category.includes("Transportation & Delivery"))
        return true;
      if (filters.miscellaneous && service.category.includes("Miscellaneous"))
        return true;
    })
    : services;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative px-4 md:px-8 lg:px-16 bg-[#D7DEDC] overflow-hidden">
        {/* Change from text-center to text-center md:text-left */}
        <h1 className="py-6 md:py-8 text-black font-bold text-2xl md:text-3xl relative z-10 text-center md:text-left">
          Find Your Service Here
        </h1>
        
        <div className="pb-6 md:pb-8 pt-2 relative z-10">
          <SearchForm />
        </div>

        {/* Background images - hidden on mobile for better performance */}
        <div className="hidden md:block">
          <Image 
            src="/material0.jpg"
            alt="material1"
            width={200}
            height={500}
            className="clip-path w-[10rem] lg:w-[15rem] opacity-80 py-5 absolute z-0 top-[0] right-[-5rem] lg:right-[-11rem] h-full object-cover"
          />

          <Image 
            src="/material1.jpg"
            alt="material1"
            width={200}
            height={500}
            className="clip-path opacity-70 w-[10rem] lg:w-[15rem] py-5 absolute z-0 top-[0] right-[1rem] h-full object-cover"
          />

          <Image 
            src="/material2.jpg"
            alt="material2"
            width={200}
            height={500}
            className="clip-path opacity-60 w-[10rem] lg:w-[15rem] py-5 absolute z-0 top-[0] right-[7rem] lg:right-[13rem] h-full object-cover"
          />

          <Image 
            src="/material3.jpg"
            alt="material3"
            width={200}
            height={500}
            className="clip-path opacity-50 w-[10rem] lg:w-[15rem] py-5 absolute z-0 top-[0] right-[13rem] lg:right-[25rem] h-full object-cover"
          />

          <Image 
            src="/material4.jpg"
            alt="material4"
            width={200}
            height={500}
            className="clip-path opacity-50 w-[10rem] lg:w-[15rem] py-5 absolute z-0 top-[0] right-[19rem] lg:right-[37rem] h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[95%] md:w-[90%] mx-auto mb-8 md:mb-14 flex-grow flex flex-col">
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          <h2 className="text-2xl md:text-3xl font-bold text-black py-4 md:py-8 text-center md:text-left">Recent Services</h2>

          {/* View toggle button - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
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
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Filters - centered on mobile */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block mx-auto md:mx-0`}>
            <div className="w-full max-w-xs md:w-[22rem] md:pr-4">
              <Filters />
            </div>
          </div>

          {/* Mobile filters toggle button - centered */}
          <div className="md:hidden flex justify-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2 bg-[#7263F3] text-white rounded-md"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Services grid - centered on mobile */}
          <div className={`w-full grid gap-4 md:gap-8 ${
            columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : 
            columns === 2 ? "grid-cols-1 sm:grid-cols-2" : 
            "grid-cols-1"
          }`}>
            {services.length > 0 ? (
              filteredServices.map((service: Service) => (
                <ServiceCard key={service._id} service={service} />
              ))
            ) : (
              <div className="col-span-full mt-4 flex justify-center">
                <p className="text-xl md:text-2xl text-gray-400 font-bold">No Services Found!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page