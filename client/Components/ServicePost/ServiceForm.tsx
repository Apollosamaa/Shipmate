"use client"
import { useGlobalContext } from '@/context/globalContext';
import React, { useState } from 'react';
import ServiceTitle from './ServiceTitle';
import ServiceDetails from './ServiceDetails';
import { useServicesContext } from '@/context/servicesContext';
import { Checkbox } from '@/Components/ui/checkbox';
import { useRouter } from 'next/navigation';

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
                        <p><strong>Price:</strong> MYR {price} {negotiable ? "(Negotiable)" : "(Fixed)"}</p>
                        <div className="flex items-center mt-4">
                        <Checkbox checked={agreeToTnC} onCheckedChange={(checked) => setAgreeToTnC(checked === true)} />
                            <span className="ml-2 text-gray-700">I agree to the Terms & Conditions</span>
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

            <form action="" className="p-6 flex-1 bg-white rounded-lg self-start" onSubmit={handleSubmit}>
                {renderStages()}

                <div className="flex justify-end gap-4 mt-4">
                    {currentSection !== "Summary" && 
                    (<button type="button" className="px-6 py-2 bg-[#7263f3] text-white rounded-md"
                    onClick={() =>{
                        const currentIndex = sections.indexOf(currentSection);
                        setCurrentSection(sections[currentIndex +1]);
                    }}>Next </button>)}
                
                    {currentSection === "Summary" && 
                    (<button type="submit" className="self-end px-6 py-2 bg-[#7263f3] text-white rounded-md" disabled={!agreeToTnC}>Post Service</button>)}
                </div>
            </form>
        </div>
    )
}

export default ServiceForm
