"use client"
import { useGlobalContext } from '@/context/globalContext';
import { Separator } from "@/Components/ui/separator"
import React, { useEffect } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

interface ServiceCategoryProps {
  "Academic Assistance": string;
  "Technical & IT": string;
  "Creative & Media": string;
  "Event & Entertainment": string;
  "Health & Wellness": string;
  "Transportation & Delivery": string;
  "Miscellaneous": string;
}

function ServiceTitle() {
  const {
    handleTitleChange,
    serviceTitle,
    activeServiceCategory,
    setActiveServiceCategory,
  } = useGlobalContext()

  const [serviceCategories, setServiceCategories] = React.useState<ServiceCategoryProps>({
    "Academic Assistance": "",
    "Technical & IT": "",
    "Creative & Media": "",
    "Event & Entertainment": "",
    "Health & Wellness": "",
    "Transportation & Delivery": "",
    "Miscellaneous": "",
  })

  const handleServiceCategoryChange = (category: keyof ServiceCategoryProps) => {
    setServiceCategories((prev)=> ({...prev, [category]: !prev[category]}));
  }

  useEffect(() => {
    const selectedCategories = Object.keys(serviceCategories).filter((category)=>{
      return serviceCategories[category as keyof ServiceCategoryProps];
    })

    setActiveServiceCategory(selectedCategories)
  }, [serviceCategories]);



  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            Service Title
          </h3>
          <Label htmlFor="serviceTitle" className="text-sm text-muted-foreground mt-2">
            A serviice title should clearly describe what you are offering to help others find it easily.
          </Label>
        </div>
        <Input
        type="text"
        id="serviceTItle"
        value={serviceTitle}
        onChange={handleTitleChange}
        placeholder="Enter Service Title"
        className="flex-1 w-full mt-2">
        </Input>
      </div>

      <Separator/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="tex-lg font-semibold">Service Categories</h3>
          <Label htmlFor="serviceCategory" className="text-sm text-muted-foreground mt-2">
            Select the category of service.
          </Label>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {Object.entries(serviceCategories).map(([category, checked])=> (
            <div key={category} className="flex items-canter space-x-2 border border-input rounded-md p-2">
              <Checkbox 
              id={category}
              checked={checked}
              onCheckedChange={()=>{
                handleServiceCategoryChange(category as keyof ServiceCategoryProps)
              }}/>
              <Label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServiceTitle
