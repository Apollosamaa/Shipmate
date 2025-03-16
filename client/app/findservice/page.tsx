"use client"
import Header from '@/Components/Header'
import SearchForm from '@/Components/SearchForm';
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext'
import React from 'react'

function page() {
  const { saveService, services, applyService } = useServicesContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  

  return (
    <div>
      <Header />

      <div className="relative px-16 bg-[#D7DEDC] overflow-hidden">
        <h1 className="py-8 text-black font-bold text-3xl">Find Your Service Here</h1>
        <div className="pb-8 relative z-10">
          <SearchForm />
        </div>
      </div>
    </div>
  )
}

export default page
