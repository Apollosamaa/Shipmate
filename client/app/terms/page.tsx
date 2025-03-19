"use client";
import React from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

function TermsPage() {
  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-6">
        <h1 className="text-3xl font-bold text-center mb-4">Terms & Conditions</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold">1. Service Authenticity & Responsibility</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Service providers must ensure their services are accurately described.</li>
            <li>Service seekers apply at their own discretion and responsibility.</li>
            <li>Users should conduct their own due diligence before engaging in any service.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">2. Payment & Pricing Policies</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Pricing must be clearly explained in the service description.</li>
            <li>Negotiations and payments are handled off-platform.</li>
            <li>Shipmate is not responsible for financial losses, but fraudulent users may be reported.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">3. Communication & Privacy</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Sharing personal contact details is optional and at the user's own risk.</li>
            <li>Users should communicate respectfully within the platform.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">4. Prohibited Services & Activities</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Illegal, fraudulent, or unethical services are strictly prohibited.</li>
            <li>Academic dishonesty and services promoting harm or violence are not allowed.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">5. Ratings & Reviews</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Users should provide honest and fair ratings.</li>
            <li>Fake reviews or rating manipulation are prohibited.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">6. Dispute Resolution & Liability</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Shipmate does not intervene in disputes but encourages open communication.</li>
            <li>Shipmate is not legally responsible for losses or damages arising from interactions between users.</li>
          </ul>
        </section>

        <p className="text-gray-700 text-center mt-6">By using Shipmate, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.</p>
      </div>
      <Footer />
    </div>
  );
}

export default TermsPage;
