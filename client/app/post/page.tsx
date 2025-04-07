"use client"
import Footer from '@/Components/Footer';
import Header from '@/Components/Header'
import ServiceForm from '@/Components/ServicePost/ServiceForm'
import { useGlobalContext } from '@/context/globalContext'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { UserCheck, UserX } from 'lucide-react'
import { toast } from 'react-hot-toast'

function CreateServicePage() {
  const { isAuthenticated, loading, userProfile } = useGlobalContext();
  const router = useRouter();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login");
    } else if (!loading && isAuthenticated && !userProfile?.isVerified) {
      setShowVerificationMessage(true);
    }
  }, [isAuthenticated, loading, userProfile]);

  if (showVerificationMessage) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center">
          <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
            <UserX className="h-12 w-12 md:h-16 md:w-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Student Verification Required
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              This platform is exclusively for verified students of The Ship Campus, PCG. <br/>
              Please verify your student status to create service posts and access all features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="default" 
                onClick={() => router.push('/verify-student')}
                className="bg-[#7263f3] hover:bg-[#5a4bd1]"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Verify Student Status
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="mt-0 sm:mt-0"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <div className="flex-1 mb-10 mx-auto w-full md:w-[90%] flex flex-col px-4 md:px-0">
        <h2 className="pt-6 md:pt-8 mx-auto w-full md:w-[90%] text-2xl md:text-3xl font-bold text-black">
          Create a Service Post
        </h2>

        <div className="pt-6 md:pt-8 w-full md:w-[90%] mx-auto flex justify-center items-center">
          {userProfile?.isVerified ? (
            <ServiceForm/>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default CreateServicePage