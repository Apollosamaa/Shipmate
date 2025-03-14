"use client"
import { useGlobalContext } from '@/context/globalContext';
import React from 'react'
import ServiceTitle from './ServiceTitle';
import ServiceDetails from './ServiceDetails';

function ServiceForm() {

    const {
        serviceTitle,
        serviceDescription,
        activeServiceCategory,
        price,
        negotiable,
        tags
    } = useGlobalContext();

    const sections = ["About", "Service Details", "Summary"];
    const [currentSection, setCurrentSection] = React.useState(sections[0]);

    const handleSectionChange = (section: string) => {
        setCurrentSection(section);
    };

    const renderStages = () => {
        switch (currentSection) {
            case "About":
                return <ServiceTitle />;
            case "Service Details":
                return <ServiceDetails />;

        }
    }

    const getCompletedColor = (section: string) => {
        switch (section) {
            case "About":
                return serviceTitle && activeServiceCategory.length > 0 ? "bg-[#7263f3] text-white" : "bg-gray-300";
            case "Service Details":
                return serviceDescription && price > 0 ? "bg-[#7263f3] text-white" : "bg-gray-300";
            default:
                return "bg-gray-300";
        }
    }

    return (
        <div className="w-full flex gap-6">
            <div className="self-start w-[10rem] bg-white rounded-md shadow-sm overflow-hidden">
                {sections.map((section, index) => (
                    <button key={index} className={`pl-4 py-3 relative flex self-start gap-2 font-medium items-center
                        ${
                            currentSection === section? "text-[#7263f3]" : "text-gray-500"
                        }`}
                        onClick={()=>handleSectionChange(section)}
                    >
                        <span className={`w-6 h-6 rounded-full flex items-center border border-gray-400/60 justify-center text-gray-500
                                ${currentSection === section ? "text-white" : ""} ${getCompletedColor(section)}
                            `}>
                            {index +1}
                        </span>
                        {section}
                        {currentSection === section && (
                            <span className="w-1 h-full absolute left-0 top-0 bg-[#7263f3] rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            <form action="" className="p-6 bg-white rounded-lg self-start">
                {renderStages()}

                <div className="flex justify-end gap-4 mt-4">
                    {currentSection !== "Summary" && 
                    (<button type="button" className="px-6 py-2 bg-[#7263f3] text-white rounded-md">Next </button>)}
                </div>

                {currentSection === "Summary" && 
                (<button type="submit" className="px-6 py-2 bg-[#7263f3] text-white rounded-md">Post Service</button>)}
            </form>
        </div>
    )
}

export default ServiceForm
