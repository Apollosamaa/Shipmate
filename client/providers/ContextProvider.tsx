"use client"
import React from 'react'
import { GlobalContextProvider } from "@/context/globalContext"
import { ServicesContextProvider } from "@/context/servicesContext"
import { ChatContextProvider } from '@/context/chatContext';

interface Props {
    children: React.ReactNode;
}

function ContextProvider({children}: Props) {
  return (
    <GlobalContextProvider><ServicesContextProvider><ChatContextProvider>
      {children}
      </ChatContextProvider></ServicesContextProvider></GlobalContextProvider>
  )
}

export default ContextProvider
