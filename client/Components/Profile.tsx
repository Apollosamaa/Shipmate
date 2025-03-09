"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/Components/ui/dropdown-menu"
import { LogOut, Settings,} from "lucide-react"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useGlobalContext } from '@/context/globalContext'
import { Badge } from './ui/badge'
import Image from 'next/image'

function Profile() {
    const { userProfile } = useGlobalContext();

    const { profilePicture, name, email, isVerified} = userProfile;

    const router = useRouter();
  return (
    <DropdownMenu>
        <div className="flex itemscenter gap-4">
            <Badge>{isVerified ? "Student Verified" : "Not Verified"}</Badge>
            <DropdownMenuTrigger asChild className="cursor-pointer">
                <Image
                    src={profilePicture ? profilePicture : "/avatar.png"}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-lg"
                />
            </DropdownMenuTrigger>
        </div>
        
        <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4"/><span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" 
                onClick={()=> {
                    router.push("http://localhost:8000/logout");
                }}>
                <LogOut className="mr-2 h-4 w-4"/><span>Logout</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Profile
