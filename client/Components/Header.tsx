"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/globalContext'
import { LogIn, UserPlus, Menu, X } from 'lucide-react'
import Profile from './Profile'
import { MessageSquare } from "lucide-react";
import { ChatDropdown } from './Chat/ChatDropDown'
import axios from 'axios'

function Header() {
    const {isAuthenticated, hasApplicants, setHasApplicants} = useGlobalContext();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (isAuthenticated) {
            const checkApplicants = async () => {
                try {
                    const response = await axios.get("/api/v1/my-services/applicants");
                    setHasApplicants(response.data.length > 0);
                } catch (error) {
                    console.error("Failed to check applicants:", error);
                }
            };
            checkApplicants();
        }
    }, [isAuthenticated, setHasApplicants]);

    return (
        <header className="px-4 py-4 md:px-10 md:py-6 bg-[#D7DeDC] text-gray-500 flex justify-between items-center relative">
            <div className="flex items-center justify-between w-full md:w-auto">
                <Link href={"/"} className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={45} height={45} />
                    <h1 className="font-extrabold text-2xl text-[#7263f3]">Shipmate</h1>
                </Link>

                {/* Mobile menu button */}
                <div className="flex items-center gap-4 md:hidden relative">
                    {isAuthenticated && (
                        <>
                            <ChatDropdown mobile />
                            <Profile mobile />
                        </>
                    )}
                    <button 
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-200 focus:outline-none relative"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        {hasApplicants && !isMenuOpen && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                <ul className="flex items-center gap-4 lg:gap-8">
                    <li>
                        <Link 
                            href="/findservice" 
                            className={`py-2 px-4 lg:px-6 rounded-md text-sm lg:text-base ${
                                pathname === '/findservice' 
                                    ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                    : "hover:text-[#7263F3] hover:bg-[#7263F3]/10 transition-colors"
                                }`}>
                                Find Service 
                        </Link>
                    </li>
                    <li className="relative">
                        <Link 
                            href="/myservices" 
                            className={`py-2 px-4 lg:px-6 rounded-md text-sm lg:text-base ${
                                pathname === '/myservices' 
                                    ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                    : "hover:text-[#7263F3] hover:bg-[#7263F3]/10 transition-colors"
                                }`}>
                                My Services
                                {hasApplicants && (
                                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/post" 
                            className={`py-2 px-4 lg:px-6 rounded-md text-sm lg:text-base ${
                                pathname === '/post' 
                                    ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                    : "hover:text-[#7263F3] hover:bg-[#7263F3]/10 transition-colors"
                                }`}>
                                Post a Service 
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-2">
                <ChatDropdown />
                {isAuthenticated ? (
                    <Profile />
                ) : (
                    <div className="flex items-center gap-2 lg:gap-6">
                        <Link 
                            href={"http://localhost:8000/login"}
                            className="py-2 px-4 lg:px-6 rounded-md flex items-center gap-2 lg:gap-4 text-sm lg:text-base text-white bg-[#7263F3] border-[#7263F3] hover:bg-[#7263F3]/90 transition-all duration-200 ease-in-out"
                        >
                            <LogIn className="w-4 h-4"/> Login
                        </Link>
                        <Link 
                            href={"http://localhost:8000/login"}
                            className="py-2 px-4 lg:px-6 rounded-md flex items-center gap-2 lg:gap-4 text-sm lg:text-base border-[#7263F3] text-[#7263F3] hover:bg-[#7263F3]/10 transition-all duration-200 ease-in-out"
                        >
                            <UserPlus className="w-4 h-4"/> Register
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu - Combined Navigation + Auth */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-[#D7DeDC] z-50 p-4 shadow-lg">
                    <ul className="flex flex-col gap-4 mb-4">
                        <li>
                            <Link 
                                href="/findservice" 
                                className={`block py-2 px-4 rounded-md ${
                                    pathname === '/findservice' 
                                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                        : "hover:text-[#7263F3] hover:bg-[#7263F3]/10"
                                    }`}
                                onClick={toggleMenu}>
                                    Find Service 
                            </Link>
                        </li>
                        <li className="relative">
                            <Link 
                                href="/myservices" 
                                className={`block py-2 px-4 rounded-md ${
                                    pathname === '/myservices' 
                                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                        : "hover:text-[#7263F3] hover:bg-[#7263F3]/10"
                                    }`}
                                onClick={toggleMenu}>
                                    My Services
                                    {hasApplicants && (
                                        <span className="absolute top-2.5 right-4 h-2 w-2 rounded-full bg-red-500"></span>
                                    )}
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/post" 
                                className={`block py-2 px-4 rounded-md ${
                                    pathname === '/post' 
                                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                        : "hover:text-[#7263F3] hover:bg-[#7263F3]/10"
                                    }`}
                                onClick={toggleMenu}>
                                    Post a Service 
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Auth Buttons - only show when not authenticated */}
                    {!isAuthenticated && (
                        <div className="flex flex-col gap-3 pt-2 border-t border-gray-300">
                            <Link 
                                href={"http://localhost:8000/login"}
                                className="py-2 px-4 rounded-md flex items-center justify-center gap-3 text-white bg-[#7263F3] hover:bg-[#7263F3]/90"
                                onClick={toggleMenu}
                            >
                                <LogIn className="w-4 h-4"/> Login
                            </Link>
                            <Link 
                                href={"http://localhost:8000/login"}
                                className="py-2 px-4 rounded-md flex items-center justify-center gap-3 text-[#7263F3] border border-[#7263F3] hover:bg-[#7263F3]/10"
                                onClick={toggleMenu}
                            >
                                <UserPlus className="w-4 h-4"/> Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header