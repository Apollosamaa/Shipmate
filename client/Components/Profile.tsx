"use client"
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { LogOut, Settings, UserCheck, UserX, Loader2, BadgeCheck } from "lucide-react"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useGlobalContext } from '@/context/globalContext'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

function Profile() {
    const { userProfile, setUserProfile } = useGlobalContext();
    const { profilePicture, name, email, isVerified } = userProfile;
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerificationClick = async () => {
        if (isVerified) return;
        
        setIsVerifying(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (userProfile.isVerified) {
                toast.success("Your student status is already verified!");
                return;
            }
            
            router.push('/verify-student');
        } catch (error) {
            toast.error("Failed to check verification status");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <DropdownMenu>
            <div className="flex items-center gap-4">
                <Button 
                    variant={isVerified ? "default" : "outline"} 
                    size="sm"
                    onClick={handleVerificationClick}
                    className={`flex items-center gap-2 ${
                        isVerified 
                            ? "bg-[#7263f3] hover:bg-[#5a4bd1] text-white" 
                            : "hover:bg-gray-100"
                    }`}
                    disabled={isVerifying}
                >
                    {isVerifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isVerified ? (
                        <>
                            <BadgeCheck className="h-4 w-4" />
                            <span>Verified</span>
                        </>
                    ) : (
                        <>
                            <UserX className="h-4 w-4" />
                            <span>Not Verified</span>
                        </>
                    )}
                </Button>
                
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <div className="relative w-9 h-9 rounded-md overflow-hidden">
                        <Image
                            src={profilePicture || "/avatar.png"}
                            alt="avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                </DropdownMenuTrigger>
            </div>
            
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                        <div className="flex items-center gap-1 pt-1">
                            {isVerified ? (
                                <span className="text-xs text-green-600 flex items-center">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Verified Student
                                </span>
                            ) : (
                                <span className="text-xs text-yellow-600 flex items-center">
                                    <UserX className="h-3 w-3 mr-1" />
                                    Not Verified
                                </span>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => router.push('/settings')}
                >
                    <Settings className="mr-2 h-4 w-4"/>
                    <span>Settings</span>
                </DropdownMenuItem>
                
                {!isVerified && (
                    <DropdownMenuItem 
                        className="cursor-pointer text-[#7263f3]"
                        onClick={() => router.push('/verify-student')}
                    >
                        <UserCheck className="mr-2 h-4 w-4"/>
                        <span>Verify Student Status</span>
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuItem 
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={() => router.push("http://localhost:8000/logout")}
                >
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Profile