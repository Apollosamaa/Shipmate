"use client"
import Header from "@/Components/Header";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { useGlobalContext } from "@/context/globalContext";
import { CheckCircleIcon, PlusCircle, Search, SearchIcon, Users } from "lucide-react";
import Link from "next/link";
import Footer from "@/Components/Footer";
import { useState } from "react";

export default function Home() {

  const features = [
    {
      icon: <Search className="w-6 h-6 text-[#7263f3]"/>,
      title: "Find the Right Service",
      description: "Discover a variety of student-offered services, from tutoring to tech support, all in one place.",
      benefits: [
        "Browse available services",
        "Connect directly with providers",
        "Flexible pricing and scheduling"
      ],
      cta: "Explore Services",
      ctaLink: "/findservice",
    },
    {
      icon: <Users className="w-6 h-6 text-[#7263f3]" />,
      title: "Support Your Peers",
      description: "Hire fellow students for the services you need while helping others gain experience and earn.",
      benefits: [
        "Student-to-student collaboration",
        "Build a trusted network",
        "Encourage skill-sharing"
      ],
      cta: "Discover Talent",
      ctaLink: "/findservice",
    },
    {
      icon: <PlusCircle className="w-6 h-6 text-[#7263f3]" />,
      title: "Offer Your Skills",
      description: "Turn your skills into opportunities—list your services and start getting hired by students on campus.",
      benefits: [
        "Showcase what you can do",
        "Set your own rates",
        "Gain experience and reviews"
      ],
      cta: "Post a Service",
      ctaLink: "/post",
    }
  ];
  
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  return (
    <main>
      <Header/>

      <section className="py-20 bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center text-black">
          <h1 className="text-4xl text-[#7263f3] md:text-5xl font-bold mb-6">
            Your Campus Marketplace for Services
          </h1>
          <p className="text-xl mb-8">
            Offer and request services within the Ship Campus community with ease
          </p>
          <div className="max-w-2xl mx-auto flex gap-4">
            <Input
              type="text"
              placeholder="Search for services"
              className="flex-grow bg-white text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              className="bg-[#7263f3] text-white"
              onClick={() => router.push("/findservice")}
            >
              <SearchIcon className="w-6 h-6" />
              Search Services
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f0f5fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose{"  "}
            <span className="text-[#7263f3] font-extrabold">Shipmate</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {
              features.map((feature, index) => (
                <Card key={index} className="flex flex-col h-full rounded-xl border-none">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={feature.ctaLink}>
                        {feature.cta}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            }
          </div>

          <div className="mt-12 text-center">
          <Badge variant={"outline"} className="text-sm font-medium border border-gray-400">
            <span className="text-gray-700">Trusted by 200+ students in TSC</span>
          </Badge>

          </div>

        </div>
      </section>

      <section className="py-[7rem] bg-[#d7dedc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to get Started?
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button size={"lg"} asChild>
              <Link href={"/findservice"}>Find Service</Link>
            </Button>
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/post"}>Offer a Service</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
