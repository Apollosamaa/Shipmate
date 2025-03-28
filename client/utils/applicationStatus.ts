import type { Service, ApplicationStatus } from "@/types/types";

export const getApplicationStatus = (
    service: Service,
    userId?: string
  ): ApplicationStatus | "none" => {
    if (!userId || !service?.applicants) return "none";
    
    const application = service.applicants.find(app => {
      // Handle ALL possible cases:
      // 1. Backend returns 'user' as string ID
      // 2. Backend returns populated { user: { _id: string } }
      // 3. Edge cases (null/undefined)
      const applicantUserId = 
        typeof app.user === "string" ? 
          app.user :               // Case 1: "user" is string
          app.user?._id?.toString(); // Case 2: "user" is object
      
      return applicantUserId === userId.toString();
    });
    
    return application?.status || "none";
  };