"use client"
import { useGlobalContext } from '@/context/globalContext'
import React from 'react'
import dynamic from "next/dynamic";
import { Label } from '../ui/label';
import "react-quill-new/dist/quill.snow.css";
import { Separator } from "@/Components/ui/separator";
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });


function MyEditor() {
  const {
    setServiceDescription,
    serviceDescription,
    handleDescriptionChange,
  } = useGlobalContext()

  return (<ReactQuill 
  value={serviceDescription}
  onChange={handleDescriptionChange}
  style={{
    minHeight: "400px",
    maxHeight: "900px",
  }}
  modules={{toolbar: true}}
  className="custom-quill-editor"
  />);
}

function ServiceDetails() {
  const { price, handlePriceChange, negotiable, setNegotiable } = useGlobalContext();
  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">
            Service Description
          </h3>
          <Label htmlFor="serviceDescription" className="text-gray-500 mt-2">
            Provide a detailed description of the service you're offering. This will help customers understand your needs and preferences.
          </Label>
        </div>
        <div className="flex-1">
          <MyEditor />
        </div>
      </div>

      <Separator className="my-2"/>
      <div className="relative grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-black font-bold">
            Price
          </h3>
          <Label htmlFor="price" className="text-gray-500 mt-2">
            Enter the price for the service. If the price is varies, please specify details in descriptions above. Such as whether it is a starting price or if additional costs may apply.
          </Label>
        </div>

        <div>
          <Input
            type="number"
            id="price"
            placeholder="Enter Price without RM"
            value={price}
            onChange={handlePriceChange}
            className="mt-2"
            />

          <div className="flex gap-2 mt-2 justify-between">
            <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
              <Checkbox id="negotiable" checked={negotiable} onCheckedChange={setNegotiable}/>
              <Label htmlFor="negotiable" className="text-gray-500">
                Negotiable
              </Label>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}

export default ServiceDetails
