"use client";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { MailCheck, Loader2 } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";

interface FormData {
  studentId: string;
  schoolEmail: string;
}

export default function VerifyStudentPage() {

    const { setUserProfile } = useGlobalContext();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        studentId: "",
        schoolEmail: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            const response = await fetch('http://localhost:8000/api/v1/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Needed for cookies/auth
                body: JSON.stringify({
                    studentId: formData.studentId.trim().toUpperCase(),
                    schoolEmail: formData.schoolEmail.trim().toLowerCase()
                })
            });
      
            if (!response.ok) throw new Error("Verification failed");

            setUserProfile((prev: { 
                isVerified?: boolean; 
                verificationData?: any;
                [key: string]: any 
            }) => ({
                ...prev,
                isVerified: true,
                verificationData: {
                    studentId: formData.studentId,
                    schoolEmail: formData.schoolEmail
                }
            }));
            toast.success("Verified!");
            router.push('/findservice');

        } catch (error) {
            toast.error("Failed to verify. Please try again.");
        } finally {
            setIsSubmitting(false);   
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-[#7263f3]">
                            Student Verification
                        </CardTitle>
                        <CardDescription className="text-center">
                            Verify with your student ID and school email
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium mb-1">
                                    Student ID *
                                </label>
                                <Input
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    placeholder="Enter student ID"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7263f3] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="schoolEmail" className="block text-sm font-medium mb-1">
                                    School Email *
                                </label>
                                <Input
                                    id="schoolEmail"
                                    name="schoolEmail"
                                    type="email"
                                    value={formData.schoolEmail}
                                    onChange={handleChange}
                                    placeholder="Enter peninsula student email"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7263f3] focus:border-transparent"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#7263f3] hover:bg-[#5a4bd1] text-white py-2 px-4 rounded-md transition-colors"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <MailCheck className="mr-2 h-4 w-4" />
                                        Verify Now
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}