import Header from '@/Components/Header'
import ServiceForm from '@/Components/ServicePost/ServiceForm'
import React from 'react'

function page() {
  return (
    <div className="flex flex-col">
      <Header/>

      <h2 className="flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black">
        Create a Service Post
      </h2>

      <div className="flex-1 pt-8 w-[90%] mx-auto flex justify-center items-center">
        <ServiceForm/>
      </div>
      
    </div>
  )
}

export default page
