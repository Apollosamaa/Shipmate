"use client"
import { useGlobalContext } from '@/context/globalContext';
import { Separator } from "@/Components/ui/separator"
import React, { useEffect } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

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
    tags,
    setTags,
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

  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    if(newTag.trim() && !tags.includes(newTag.trim())){
      setTags((prev: string)=> [...prev, newTag.trim()]);
      setNewTag("");
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag:string) => tag !== tagToRemove));
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

      <Separator/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="tex-lg font-semibold">Tags</h3>
          <Label htmlFor="serviceTags" className="text-sm text-muted-foreground mt-2">
            Tags help categorize your service, making it easier for others to find it.
          </Label>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input 
              type="text"
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
              placeholder="Enter a tag"
            />

            <Button 
              type="button"
              onClick={handleAddTag}
            >
              Add Tag
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string, index: number) => (
              <div key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center space-x-1">
                <span>{tag}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-foreground hover:text-red-300 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceTitle
