import { ApplicationStatus } from "@/types/types";
import { useState } from "react";
import Spinner from "@/Components/ui/Spinner"

interface ApplyButtonProps {
  status: ApplicationStatus | "none";
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export const ApplyButton = ({ 
  status, 
  onClick, 
  disabled = false 
}: ApplyButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  // Define button states
  const buttonConfig = {
    none: { 
      text: "Apply Now", 
      color: "bg-[#7263f3]",
      disabled: false
    },
    pending: { 
      text: "Pending", 
      color: "bg-blue-500",
      disabled: true 
    },
    accepted: { 
      text: "Approved", 
      color: "bg-green-500",
      disabled: true 
    },
    rejected: { 
      text: "Apply Again", 
      color: "bg-[#7263f3]",
      disabled: false 
    },
    completed: { 
      text: "Apply Again", 
      color: "bg-[#7263f3]",
      disabled: false 
    }
  };

  const { text, color, disabled: statusDisabled } = buttonConfig[status];
  const isDisabled = disabled || isLoading || statusDisabled;

  return (
    <button
      className={`${color} text-white py-4 rounded-full w-full transition-colors disabled:opacity-75`}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {isLoading ? <Spinner size="sm" /> : text}
    </button>
  );
};