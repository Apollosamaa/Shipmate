"use client"
import { useGlobalContext } from '@/context/globalContext';
import React, { useState } from 'react';
import ServiceTitle from './ServiceTitle';
import ServiceDetails from './ServiceDetails';
import { useServicesContext } from '@/context/servicesContext';
import { Checkbox } from '@/Components/ui/checkbox';
import { useRouter } from 'next/navigation';
import formatMoney from '@/utils/formatMoney';

function ServiceForm() {
    const {
        serviceTitle,setServiceTitle,
        serviceDescription, setServiceDescription,
        activeServiceCategory, setActiveServiceCategory,
        price, setPrice,
        negotiable, setNegotiable,
        tags, setTags,
    } = useGlobalContext();

    const {
        createService
    } = useServicesContext();

    const sections = ["About", "Service Details", "Summary"];
    const [currentSection, setCurrentSection] = useState(sections[0]);
    const [agreeToTnC, setAgreeToTnC] = useState(false);

    const router = useRouter()

    const handleSectionChange = (section: string) => {
        setCurrentSection(section);
    };

    const renderStages = () => {
        switch (currentSection) {
            case "About":
                return <ServiceTitle />;
            case "Service Details":
                return <ServiceDetails />;
            case "Summary":
                return (
                    <div className="p-6 bg-gray-100 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Final Step: Review & Post</h2>
                        <p><strong>Service Title:</strong> {serviceTitle}</p>
                        <p><strong>Description:</strong></p><div className="wysiwyg mt-2" dangerouslySetInnerHTML={{ __html: serviceDescription }}></div>
                        <p><strong>Price:</strong> {formatMoney( price, "MYR")} {negotiable ? "(Negotiable)" : "(Fixed)"}</p>
                        <div className="flex items-center mt-4">
                        <Checkbox checked={agreeToTnC} onCheckedChange={(checked) => setAgreeToTnC(checked === true)} />
                        <span className="ml-2 text-gray-700">
                            I agree to the 
                            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Terms & Conditions</a>
                        </span>
                        </div>
                    </div>
                );
        }
    }

    const getCompletedColor = (section: string) => {
        switch (section) {
            case "About":
                return serviceTitle && activeServiceCategory.length > 0 && tags.length > 0 ? "bg-[#7263f3] text-white" : "bg-gray-300";
            case "Service Details":
                return serviceDescription && price > 0 ? "bg-[#7263f3] text-white" : "bg-gray-300";
            default:
                return "bg-gray-300";
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreeToTnC) {
            alert("Please agree to the Terms & Conditions before posting.");
            return;
        }
        createService({
            title: serviceTitle,
            description: serviceDescription,
            category: activeServiceCategory,
            price,
            negotiable,
            tags,
        });

        setServiceTitle("");
        setServiceDescription("");
        setActiveServiceCategory([]);
        setPrice(0);
        setNegotiable(false);
        setTags([]);
        setAgreeToTnC(false);

        router.push('/findservice');
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* Stages sidebar - becomes horizontal on mobile */}
            <div className="w-full lg:w-[15rem] bg-white rounded-md shadow-sm overflow-hidden flex lg:flex-col">
                {sections.map((section, index) => (
                    <button 
                        key={index} 
                        className={`px-4 py-3 relative flex gap-2 font-medium items-center text-sm lg:text-base
                            ${
                                currentSection === section? "text-[#7263f3]" : "text-gray-500"
                            }`}
                        onClick={()=>handleSectionChange(section)}
                    >
                        <span className={`w-6 h-6 rounded-full flex items-center border border-gray-400/60 justify-center 
                                ${currentSection === section ? "text-white" : ""} ${getCompletedColor(section)}
                            `}>
                            {index +1}
                        </span>
                        <span className="hidden sm:inline">{section}</span>
                        {currentSection === section && (
                            <span className="hidden lg:block w-1 h-full absolute left-0 top-0 bg-[#7263f3] rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            <form className="p-4 md:p-6 flex-1 bg-white rounded-lg" onSubmit={handleSubmit}>
                {renderStages()}

                <div className="flex justify-end gap-4 mt-6">
                    {currentSection !== "Summary" && 
                    (<button 
                        type="button" 
                        className="px-4 py-2 md:px-6 md:py-2 bg-[#7263f3] text-white rounded-md text-sm md:text-base"
                        onClick={() =>{
                            const currentIndex = sections.indexOf(currentSection);
                            setCurrentSection(sections[currentIndex +1]);
                        }}
                    >
                        Next
                    </button>)}
                
                    {currentSection === "Summary" && 
                    (<button 
                        type="submit" 
                        className="px-4 py-2 md:px-6 md:py-2 bg-[#7263f3] text-white rounded-md text-sm md:text-base" 
                        disabled={!agreeToTnC}
                    >
                        Post Service
                    </button>)}
                </div>
            </form>
        </div>
    )
}

export default ServiceForm
