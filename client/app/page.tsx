"use client"
import Header from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useGlobalContext } from "@/context/globalContext";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
            <Input type="text" placeholder="Search for services" className="flex-grow bg-white text-black"/>
            <Button className="bg-[#7263f3] text-white">
              <SearchIcon className="w-6 h-6"/>Search Services
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
