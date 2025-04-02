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
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <UserX className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Student Verification Required
            </h2>
            <p className="text-gray-600 mb-6">
              This platform is exclusively for verified students of The Ship Campus, PCG. <br/>
              Please verify your student status to create service posts and access all features.
            </p>
            <div className="flex gap-4 justify-center">
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

      <div className="flex-1 mb-10 mx-auto w-[90%] flex flex-col">
        <h2 className="flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black">
          Create a Service Post
        </h2>

        <div className="flex-1 pt-8 w-[90%] mx-auto flex justify-center items-center">
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