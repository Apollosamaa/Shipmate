"use client"
import React from 'react'
import { Service } from "@/types/types"

interface ServiceProps {
    service: Service;
}

function MyService({ service }: ServiceProps) {
  return (
    <div>
      Service
    </div>
  )
}

export default MyService
