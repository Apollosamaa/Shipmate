import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
}

const MyApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("/api/v1/my-services/applicants");
        setApplicants(response.data);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

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
      
      setApplicants(applicants.filter(app => app._id !== applicantId));
      toast.success(
        `${applicant.user.name} ${newStatus} successfully!`,
        { id: toastId }
      );
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
    <div className="space-y-4 mt-6">
      
      {applicants.map((applicant) => (
        <div key={applicant._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {applicant.user.profilePicture ? (
                <img 
                  src={applicant.user.profilePicture} 
                  alt={applicant.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {applicant.user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{applicant.user.name}</h3>
              <p className="text-gray-600">{applicant.user.email}</p>
              <p className="text-sm mt-1">
                Applied for: <span className="font-medium">{applicant.serviceTitle}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Applied on: {new Date(applicant.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 my-auto">
              <button
                onClick={() => handleStatusChange(applicant._id, "accepted")}
                className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(applicant._id, "rejected")}
                className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyApplicants;