"use client"
import { useServicesContext } from '@/context/servicesContext';
import { Search } from 'lucide-react';
import React from 'react'

function SearchForm() {
    const { searchServices, handleSearchChange, searchQuery} = useServicesContext();
    return (
        <form 
            className="relative flex items-center" 
            onSubmit={(e) => {
                e.preventDefault();
                searchServices(searchQuery.tags, searchQuery.title);
            }}>
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    id="service-title" 
                    name="title" 
                    value={searchQuery.title} 
                    onChange={(e)=>{handleSearchChange("title", e.target.value)}}
                    placeholder="Service Title or Keywords"
                    className="w-full py-7 bg-white text-2xl text-black pl-[5rem] rounded-full"
                />
                <span>
                    <Search size={30} className="text-gray-400 text-2xl absolute left-8 top-[50%] translate-y-[-50%]" />
                </span>
            </div>

            <button 
                type="submit"
                className="bg-[#7263f3] hover:bg-[#7263f3]/90 text-white text-2xl px-14 py-2 rounded-full absolute right-2 top-[50%] transform translate-y-[-50%] h-[calc(100%-1rem)]"
                
            >
                Search
            </button>
        </form>
    )
}

export default SearchForm
