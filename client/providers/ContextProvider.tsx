"use client"
import React from 'react'
import { GlobalContextProvider } from "@/context/globalContext"
import { ServicesContextProvider } from "@/context/servicesContext"

interface Props {
    children: React.ReactNode;
}

function ContextProvider({children}: Props) {
  return (
    <GlobalContextProvider><ServicesContextProvider>
      {children}
    </ServicesContextProvider></GlobalContextProvider>
  )
}

export default ContextProvider
