"use client"
import Footer from '@/Components/Footer';
import Header from '@/Components/Header'
import ServiceCard from '@/Components/ServiceItem/ServiceCard'
import { useGlobalContext } from '@/context/globalContext';
import { useServicesContext } from '@/context/servicesContext';
import { Service, Rating } from '@/types/types';
import { formatDates } from '@/utils/formatDates';
import formatMoney from '@/utils/formatMoney';
import { Bookmark, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { bookmark, bookmarkEmpty } from "@/utils/Icons"
import { getApplicationStatus } from '@/utils/applicationStatus';
import { ApplyButton } from '@/Components/ui/ApplyButton';
import { Star, StarHalf } from 'lucide-react';

function page() {
  const {services, saveService, applyToService} = useServicesContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter()
  const { id } = params;

  const [isSaved, setIsSaved] = React.useState(false);

  const service = services.find((service: Service) => service._id === id);
  const otherServices = services.filter((service: Service) => service._id !== id);

  const status = getApplicationStatus(service, userProfile?._id);

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push("http://localhost:8000/login");
      return;
    }
  
    try {
      const result = await applyToService(service._id);
      toast.success(result?.message || "Application submitted!");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to apply. Please try again.");
      }
    }
  }; 
  
  useEffect(() => {
    if(service){
      setIsSaved(service.likes.includes(userProfile._id))
    }
  }, [service, userProfile._id])

  if(!service) return null;

  const { 
    title,
    description,
    price,
    provider,
    applicants,
    category,
    createdAt,
    negotiable,
  } = service;

  const { name , profilePicture } = provider;

  const handleSave = (id: string) => {
    setIsSaved((prev) => !prev);
    saveService(id);
  };

  return (
    <main>
      <Header />
      
      {/* Mobile back button */}
      <div className="md:hidden p-4 flex items-center gap-2 border-b">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#7263f3]">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>
      
      <div className="p-4 md:p-8 mb-8 mx-auto w-full md:w-[90%] rounded-md flex flex-col lg:flex-row gap-4 md:gap-8">
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden lg:flex lg:w-[26%] flex-col gap-8">
          <ServiceCard activeService service={service}/>

          {otherServices.map((service: Service) => (
            <ServiceCard key={service._id} service={service}/>
          ))}
        </div>

        {/* Main content - now first on mobile */}
        <div className="w-full lg:flex-1 bg-white p-4 md:p-6 rounded-md order-1 lg:order-none">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 md:w-14 md:h-14 relative rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
                  <Image 
                    src={profilePicture || "/avatar.png"} 
                    alt={name || "name"} 
                    width={45} 
                    height={45} 
                    className="rounded-md"
                  />
                </div>

                <div>
                  <p className="font-bold text-sm md:text-base">{name}</p>
                  <p className="font-sm text-xs md:text-sm">Provider</p>
                </div>
              </div>

              <button 
                className={`text-xl md:text-2xl ${
                  isSaved ? "text-[#7263f3]" : "text-gray-400"}`} 
                onClick={()=> handleSave(service._id)}
              >
                {isSaved? bookmark : bookmarkEmpty}
              </button>
            </div>
            
            <h1 className="text-xl md:text-2xl font-semibold mt-2">{title}</h1>
            
            <div className="mt-2 grid grid-cols-2 md:flex gap-2 md:gap-4 justify-between items-center">
              <p className="py-2 px-2 md:px-4 flex flex-col items-center justify-center gap-1 bg-green-500/20 rounded-xl">
                <span className="font-sm text-xs md:text-sm">Price</span>
                <span className="font-bold text-sm md:text-base">{formatMoney(price, "MYR")}</span>
              </p>

              <p className="py-2 px-2 md:px-4 flex flex-col items-center justify-center gap-1 bg-purple-500/20 rounded-xl">
                <span className="font-sm text-xs md:text-sm">Posted</span>
                <span className="font-bold text-sm md:text-base">{formatDates(createdAt)}</span>
              </p>

              <p className="py-2 px-2 md:px-4 flex flex-col items-center justify-center gap-1 bg-yellow-500/20 rounded-xl">
                <span className="font-sm text-xs md:text-sm">Category</span>
                <span className="font-bold text-sm md:text-base">{category[0]}</span>
              </p>

              <p className="py-2 px-2 md:px-4 flex flex-col items-center justify-center gap-1 bg-blue-500/20 rounded-xl">
                <span className="font-sm text-xs md:text-sm">Applicants</span>
                <span className="font-bold text-sm md:text-base">{applicants.length}</span>
              </p>
            </div>

            <h2 className="font-bold text-xl md:text-2xl mt-4">Service Description</h2>
          </div>

          <div className="wysiwyg mt-4 text-sm md:text-base" dangerouslySetInnerHTML={{__html: description}}></div>
        </div>

        {/* Right sidebar - appears after content on mobile */}
        <div className="w-full lg:w-[26%] flex flex-col gap-4 md:gap-8 order-2 lg:order-none">
          {/* Apply button moved to be first in this section */}
          <ApplyButton status={status} onClick={handleApply} />

          <div className="p-4 md:p-6 flex flex-col gap-2 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Other Information</h3>
            <div className="flex flex-col gap-2 text-sm md:text-base">
              <p>
                <span className="font-bold">Posted:</span> {formatDates(createdAt)}
              </p>

              <p>
                <span className="font-bold">Price negotiable: </span>
                <span className={`${negotiable? "text-green-400" : "text-red-400"}`}>
                  {negotiable ? "Yes" : "No"}
                </span>
              </p>

              <p>
                <span className="font-bold">Category:</span> {category[0]}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 flex flex-col gap-2 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Tags</h3>
            <p className="text-sm md:text-base">Other relevant tags for the service provided.</p>

            <div className="flex flex-wrap gap-2 md:gap-4 mt-2">
              {service.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center bg-indigo-500/20 text-[#7263f3]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 flex flex-col gap-2 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Service Ratings</h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.floor(service.averageRating || 0)
                        ? "fill-[#7263f3] text-[#7263f3]"
                        : star === Math.ceil(service.averageRating || 0) && (service.averageRating || 0) % 1 >= 0.5
                        ? "fill-[#7263f3]/50 text-[#7263f3]/50"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-bold">{(service.averageRating || 0).toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({service.ratings?.length || 0} reviews)</span>
            </div>

            <div className="mt-2 space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = service.ratings?.filter((r: Rating) => r.rating === rating).length || 0;
                const percentage = service.ratings?.length 
                  ? (count / service.ratings.length) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs md:text-sm">
                    <span className="w-4">{rating}</span>
                    <Star className="fill-[#7263f3] text-[#7263f3]" size={14} />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#7263f3] h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 md:p-6 flex flex-col gap-4 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            
            {service.ratings?.length > 0 ? (
              <div className="space-y-4">
                {service.ratings.slice(0, 3).map((rating: Rating) => (
                  <div key={rating._id || Math.random()} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= rating.rating
                                ? "fill-[#7263f3] text-[#7263f3]"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{rating.rating.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {typeof rating.user !== 'string' && rating.user.profilePicture && (
                        <Image
                          src={rating.user.profilePicture}
                          alt={rating.user.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <p className="text-sm font-medium">
                        {typeof rating.user === 'string' ? 'Anonymous' : rating.user.name}
                      </p>
                      {rating.createdAt && (
                        <span className="text-xs text-gray-400">
                          {formatDates(rating.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    {rating.review && (
                      <p className="text-sm text-gray-700 mt-1">
                        {rating.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet</p>
            )}
            
            {service.ratings?.length > 3 && (
              <button 
                className="text-sm text-[#7263f3] hover:underline mt-2 text-left"
                onClick={() => {}}
              >
                View all {service.ratings.length} reviews
              </button>
            )}
          </div>
        </div>

        {/* Mobile browse more section - hidden if not needed */}
        {otherServices.length > 0 && (
          <div className="lg:hidden w-full flex flex-col gap-4 order-3">
            <h3 className="text-lg font-semibold">Browse More Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherServices.slice(0, 4).map((service: Service) => (
                <ServiceCard key={service._id} service={service}/>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

export default page