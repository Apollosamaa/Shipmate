"use client";
import React, { useState } from "react";
import { Applicant, Service } from "@/types/types";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

interface ExtendedApplicant extends Applicant {
    service: Service;
  }
  
  interface MyApplicantsTableProps {
    applicants: ExtendedApplicant[];
  }
  

const MyApplicantsTable: React.FC<MyApplicantsTableProps> = ({ applicants }) => {
  const [selectedService, setSelectedService] = useState<string>("");

  // Filter applicants by selected service
  const filteredApplicants = selectedService
    ? applicants.filter((app) => app.service.title === selectedService)
    : applicants;

    console.log("Applicants received:", applicants);

    console.log("Applicants received:", applicants);
    applicants.forEach(app => {
        console.log("Applicant name:", app.user?.name);
        console.log("Applicant profile:", app.user?.profilePicture);
    });


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Applicants</h2>

      {/* Service Filter Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filter by Service</label>
        <select
          className="mt-1 p-2 border rounded w-full"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">All Services</option>
          {[...new Set(applicants.map((app) => app.service.title))].map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>

      {/* Applicants Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Applicant</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((app) => (
                <tr key={app._id} className="border">
                    <td className="p-2 border">{app.service.title}</td>
                    <td className="p-2 border">{app.user?.name || "Unknown"}</td>


                  <td className="p-2 border">
                    <Badge
                      variant={
                        app.status === "pending"
                          ? "outline"
                          : app.status === "accepted"
                          ? "success"
                          : app.status === "completed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplicantsTable;