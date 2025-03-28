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

function page() {
  const { userServices, services } = useServicesContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();

  const [activeTab, setActiveTab] = useState("posts");

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 mt-8 w-[90%] mx-auto flex flex-col">
        <div className="self-center flex items-center gap-6">
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium ${
              activeTab === "posts"
                ? "border-transparent bg-[#7263f3] text-white"
                : "border-gray-400"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            My Service Posts
          </button>
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium ${
              activeTab === "applicants"
                ? "border-transparent bg-[#7263f3] text-white"
                : "border-gray-400"
            }`}
            onClick={() => setActiveTab("applicants")}
          >
            My Applicants
          </button>
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium ${
              activeTab === "request"
                ? "border-transparent bg-[#7263f3] text-white"
                : "border-gray-400"
            }`}
            onClick={() => setActiveTab("request")}
          >
            Requested Services
          </button>
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium ${
              activeTab === "saved"
                ? "border-transparent bg-[#7263f3] text-white"
                : "border-gray-400"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Services
          </button>
        </div>

        {activeTab === "posts" && userServices.length === 0 && (
          
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl font-medium">No service post found</p>
          </div>
        )}

        {activeTab === "request" && requestServices.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl font-medium">No service request found</p>
          </div>
        )}

        {activeTab === "saved" && savedServices.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl font-medium">No saved service found</p>
          </div>
        )}

        <div className="my-8">
          {activeTab === "posts" && (
            <div className="grid grid-cols-2 gap-6">
              {userServices.map((service: Service) => (
                <MyService key={service._id} service={service} />
              ))}
            </div>
          )}

          {activeTab === "request" && (
            <div className="grid grid-cols-2 gap-6">
              {requestServices.map((service: Service) => (
                <MyServiceViewOnly key={service._id} service={service} />
              ))}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="grid grid-cols-2 gap-6">
              {savedServices.map((service: Service) => (
                <MyServiceSavedView key={service._id} service={service} />
              ))}
            </div>
          )}

          {activeTab === "applicants" && <MyApplicants />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;