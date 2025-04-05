"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/globalContext'
import { LogIn, UserPlus, Menu, X } from 'lucide-react' // Added Menu and X icons
import Profile from './Profile'
import { MessageSquare } from "lucide-react";
import { ChatDropdown } from './Chat/ChatDropDown'

function Header() {
    const {isAuthenticated, user} = useGlobalContext();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="px-4 py-4 md:px-10 md:py-6 bg-[#D7DeDC] text-gray-500 flex justify-between items-center">
            <div className="flex items-center justify-between w-full md:w-auto">
                <Link href={"/"} className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={45} height={45} />
                    <h1 className="font-extrabold text-2xl text-[#7263f3]">Shipmate</h1>
                </Link>

                {/* Mobile menu button */}
                <button 
                    className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-200 focus:outline-none"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
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
                    <li>
                        <Link 
                            href="/myservices" 
                            className={`py-2 px-4 lg:px-6 rounded-md text-sm lg:text-base ${
                                pathname === '/myservices' 
                                    ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                    : "hover:text-[#7263F3] hover:bg-[#7263F3]/10 transition-colors"
                                }`}>
                                My Services
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

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-[#D7DeDC] z-50 p-4 shadow-lg">
                    <ul className="flex flex-col gap-4">
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
                        <li>
                            <Link 
                                href="/myservices" 
                                className={`block py-2 px-4 rounded-md ${
                                    pathname === '/myservices' 
                                        ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                                        : "hover:text-[#7263F3] hover:bg-[#7263F3]/10"
                                    }`}
                                onClick={toggleMenu}>
                                    My Services
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
                </div>
            )}

            {/* Auth Section */}
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

            {/* Mobile Auth Buttons (shown only when menu is open) */}
            {isMenuOpen && !isAuthenticated && (
                <div className="md:hidden flex flex-col gap-4 mt-4 p-4">
                    <Link 
                        href={"http://localhost:8000/login"}
                        className="py-2 px-6 rounded-md flex items-center justify-center gap-4 text-white bg-[#7263F3] border-[#7263F3] hover:bg-[#7263F3]/90 transition-all duration-200 ease-in-out"
                        onClick={toggleMenu}
                    >
                        <LogIn className="w-4 h-4"/> Login
                    </Link>
                    <Link 
                        href={"http://localhost:8000/login"}
                        className="py-2 px-6 rounded-md flex items-center justify-center gap-4 border-[#7263F3] text-[#7263F3] hover:bg-[#7263F3]/10 transition-all duration-200 ease-in-out"
                        onClick={toggleMenu}
                    >
                        <UserPlus className="w-4 h-4"/> Register
                    </Link>
                </div>
            )}
        </header>
    )
}

export default Header