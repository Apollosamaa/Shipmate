"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useGlobalContext } from '@/context/globalContext'
import { LogIn, UserPlus } from 'lucide-react'
import Profile from './Profile'
import { MessageSquare } from "lucide-react";
import { ChatDropdown } from './Chat/ChatDropDown'

function Header() {
    const {isAuthenticated, user} = useGlobalContext();
    const pathname = usePathname();
  return (
    <header className="px-10 py-6 bg-[#D7DeDC] text-gray-500 flex justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={45} height={45} />
            <h1 className="font-extrabold text-2xl text-[#7263f3]">Shipmate</h1>
      </Link>

      <ul className="flex items-center gap-8">
        <li>
            <Link 
                href="/findservice" 
                className={`py-2 px-6 rounded-md ${
                    pathname === '/findservice' 
                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                        : ""
                    }`}>
                    Find Service 
            </Link>
            <Link 
                href="/myservices" 
                className={`py-2 px-6 rounded-md ${
                    pathname === '/myservices' 
                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                        : ""
                    }`}>
                    My Services
            </Link>
            <Link 
                href="/post" 
                className={`py-2 px-6 rounded-md ${
                    pathname === '/post' 
                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                        : ""
                    }`}>
                    Post a Services 
            </Link>
        </li>
      </ul>

      <div className="flex items-center gap-2">
        <ChatDropdown />
        {isAuthenticated ? (
            <Profile />
        ) : (
            <div className="flex item-center gap-6">
                <Link 
                    href={"http://localhost:8000/login"}
                    className="py-2 px-6 rounded-md flex items-center gap-4 text-white bg-[#7263F3] border-[#7263F3] hover:bg-[#7263F3]/90 transition-all duration-200 ease-in-out"
                >
                    <LogIn className="w-4 h-4"/> Login
                </Link>
                <Link 
                    href={"http://localhost:8000/login"}
                    className="py-2 px-6 rounded-md flex items-center gap-4 border-[#7263F3] text-[#7263F3] hover:bg-[#7263F3]/10 transition-all duration-200 ease-in-out"
                >
                    <UserPlus className="w-4 h-4"/> Register
                </Link>
            </div>)}
      </div>
    </header>
  )
}

export default Header
