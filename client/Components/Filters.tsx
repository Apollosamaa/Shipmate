import React from 'react'
import { Button } from "./ui/button"
import { useServicesContext } from '@/context/servicesContext';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

function Filters() {
  const { 
    searchServices,
    handleFilterChange,
    filters,
    setFilters,
    setSearchQuery,
   } = useServicesContext();

  const clearAllFilters = () => {
    setFilters({
      academicAssistance: false,
      technicalIT: false,
      creativeMedia: false,
      eventEntertainment: false,
      healthWellness: false,
      transportationDelivery: false,
      miscellaneous: false,
    })

    setSearchQuery({ tags: "", title: ""});
  }

  return (
    <div className="w-[22rem] pr-4 space-y-6">
      <div>
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-4">Service Type</h2>

            <Button
              variant={"ghost"}
              className="h-auto text-red-500 hover:text-red-700"
              onClick={()=>{
                clearAllFilters();
                searchServices();
              }}
            >
                Clear All
            </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="academicAssistance"
              checked={filters.academicAssistance}
              onCheckedChange={()=> handleFilterChange("academicAssistance")}
            />
            <Label htmlFor="academicAssistance">Academic Assistance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="technicalIT"
              checked={filters.technicalIT}
              onCheckedChange={()=> handleFilterChange("technicalIT")}
            />
            <Label htmlFor="technicalIT">Technical & IT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="creativeMedia"
              checked={filters.creativeMedia}
              onCheckedChange={()=> handleFilterChange("creativeMedia")}
            />
            <Label htmlFor="creativeMedia">Creative & Media</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eventEntertainment"
              checked={filters.eventEntertainment}
              onCheckedChange={()=> handleFilterChange("eventEntertainment")}
            />
            <Label htmlFor="eventEntertainment">Event & Entertainment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="healthWellness"
              checked={filters.healthWellness}
              onCheckedChange={()=> handleFilterChange("healthWellness")}
            />
            <Label htmlFor="healthWellness">Health & Wellness</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transportationDelivery"
              checked={filters.transportationDelivery}
              onCheckedChange={()=> handleFilterChange("transportationDelivery")}
            />
            <Label htmlFor="transportationDelivery">Transportation & Delivery</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="miscellaneous"
              checked={filters.miscellaneous}
              onCheckedChange={()=> handleFilterChange("miscellaneous")}
            />
            <Label htmlFor="miscellaneous">Miscellaneous</Label>
          </div>
        </div>
        
      </div>

      
    </div>
    
  )
}

export default Filters
