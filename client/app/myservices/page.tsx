"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import MyService from "@/Components/ServiceItem/MyService";
import MyServiceSavedView from "@/Components/ServiceItem/MyServiceSavedView";
import MyServiceViewOnly from "@/Components/ServiceItem/MyServiceViewOnly";
import MyApplicants from "@/Components/ServiceItem/MyApplicants";
import { useGlobalContext } from "@/context/globalContext";
import { useServicesContext } from "@/context/servicesContext";
import { Service } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";

function page() {
  const { userServices, services } = useServicesContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();

  const [activeTab, setActiveTab] = useState("posts");
  const [selectedMobileTab, setSelectedMobileTab] = useState("posts");

  const userId = userProfile?._id || userProfile?.sub;
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login");
    }
  }, [isAuthenticated]);

  // Requested Services (services where the user has applied)
  const requestServices = services.filter((service: Service) =>
    service.applicants.some((applicant: any) => applicant?.user === userId)
  );

  // Saved Services (services the user has liked)
  const savedServices = services.filter((service: Service) =>
    service.likes.includes(userId)
  );

  if (loading) {
    return null;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedMobileTab(value);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p className="text-xl font-medium">{message}</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 mt-4 md:mt-8 w-full md:w-[90%] mx-auto flex flex-col px-4 md:px-0">
        {/* Desktop Tabs */}
        <div className="hidden md:flex self-center items-center gap-2 md:gap-6 mb-6">
          {[
            { id: "posts", label: "My Service Posts" },
            { id: "applicants", label: "My Applicants" },
            { id: "request", label: "Requested Services" },
            { id: "saved", label: "Saved Services" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 md:px-8 md:py-2 rounded-full font-medium text-sm md:text-base transition-colors ${
                activeTab === tab.id
                  ? "bg-[#7263f3] text-white shadow-md"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Selector */}
        <div className="md:hidden mb-6 w-full">
          <Select value={selectedMobileTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="posts">My Service Posts</SelectItem>
              <SelectItem value="applicants">My Applicants</SelectItem>
              <SelectItem value="request">Requested Services</SelectItem>
              <SelectItem value="saved">Saved Services</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="my-4 md:my-8">
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {userServices.length > 0 ? (
                userServices.map((service: Service) => (
                  <MyService key={service._id} service={service} />
                ))
              ) : (
                <EmptyState message="No service post found" />
              )}
            </div>
          )}

          {/* Applicants Tab */}
          {activeTab === "applicants" && <MyApplicants />}

          {/* Requested Services Tab */}
          {activeTab === "request" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {requestServices.length > 0 ? (
                requestServices.map((service: Service) => (
                  <MyServiceViewOnly key={service._id} service={service} />
                ))
              ) : (
                <EmptyState message="No service request found" />
              )}
            </div>
          )}

          {/* Saved Services Tab */}
          {activeTab === "saved" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {savedServices.length > 0 ? (
                savedServices.map((service: Service) => (
                  <MyServiceSavedView key={service._id} service={service} />
                ))
              ) : (
                <EmptyState message="No saved service found" />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;