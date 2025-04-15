import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useChatContext } from "@/context/chatContext";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { formatDates } from "@/utils/formatDates";
import Image from "next/image";
import { useGlobalContext } from "@/context/globalContext";

interface Applicant {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
    email: string;
  };
  status: string;
  serviceId: string;
  serviceTitle: string;
  createdAt: string;
  updatedAt: string;
}

const MyApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const { setHasApplicants } = useGlobalContext(); 

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("/api/v1/my-services/applicants");
        setApplicants(response.data);
        // Update global state with applicant status
        setHasApplicants(response.data.length > 0);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [setHasApplicants]);

  const { sendMessage } = useChatContext();

  const handleStatusChange = async (applicantId: string, newStatus: "accepted" | "rejected") => {
    const applicant = applicants.find(app => app._id === applicantId);
    
    if (!applicant) {
      toast.error("Applicant not found");
      return;
    }

    const toastId = toast.loading(`Processing ${newStatus}...`);
    
    try {
      await axios.put(
        `/api/v1/services/${applicant.serviceId}/applicants/${applicantId}`, 
        { status: newStatus }
      );
      
      const updatedApplicants = applicants.filter(app => app._id !== applicantId);
      setApplicants(updatedApplicants);
      
      // Update global state with new applicant status
      setHasApplicants(updatedApplicants.length > 0);
      
      toast.success(
        `${applicant.user.name} ${newStatus} successfully!`,
        { id: toastId }
      );

      if (newStatus === "accepted") {
        try {
          const messageContent = `Hello ${applicant.user.name},\n\nI have accepted your application for "${applicant.serviceTitle}". Thank you for your interest! How may I assist you further?\n\nBest regards`;
          await sendMessage(
            applicant.user._id, 
            messageContent,
            applicant.serviceId
          );
        } catch (messageError) {
          console.error("Failed to send acceptance message:", messageError);
          toast.error("Application accepted but failed to send notification", {
            id: "message-error"
          });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(
        `Failed to ${newStatus} ${applicant.user.name}`,
        { id: toastId }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263f3]"></div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-xl font-medium">No applicants found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {applicants.map((applicant) => (
        <div 
          key={applicant._id} 
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex gap-4 items-center">
            <div className="flex-shrink-0">
              {applicant.user.profilePicture ? (
                <Image
                  src={applicant.user.profilePicture}
                  alt={applicant.user.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {applicant.user.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{applicant.user.name}</h3>
              <p className="text-gray-600 text-sm">{applicant.user.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm">
              Applied for: <span className="font-medium text-[#7263f3]">{applicant.serviceTitle}</span>
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              Applied: {formatDates(applicant.createdAt)}
            </Badge>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => handleStatusChange(applicant._id, "accepted")}
              size="sm"
              className="bg-[#7263f3] hover:bg-[#5a4bd1] text-white shadow-sm transition-colors"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleStatusChange(applicant._id, "rejected")}
              size="sm"
              variant="outline"
              className="border-[#F44336] text-[#F44336] hover:bg-[#F44336]/10 transition-colors shadow-sm"
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyApplicants;