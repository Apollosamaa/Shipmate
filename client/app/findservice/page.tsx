"use client"
import Header from '@/Components/Header'
import SearchForm from '@/Components/SearchForm';
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext'
import { grip, list, table } from '@/utils/Icons';
import Image from 'next/image';
import React from 'react'

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

  const { saveService, services, applyService } = useServicesContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  

  return (
    <div>
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
      <h2 className="text-3xl font-bold text-black py-8">Recent Services</h2>

      <button onClick={toggleGridColumns}>
        <span>
          {columns === 3 ? "Grid View" : columns === 2 ? "Table View" : "List View"}
        </span>
      </button>
      </div>
    </div>
  )
}

export default page
