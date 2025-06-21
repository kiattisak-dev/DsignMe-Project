import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Palette,
  Zap,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Phone, Mail, MapPin } from "lucide-react";

const LogoPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 10;

  const portfolioImages = [
    {
      id: 1,
      url: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Modern Tech Startup Logo",
      category: "Technology",
      description: "Clean, minimalist logo design for a cutting-edge tech startup",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Creative Agency Branding",
      category: "Creative",
      description: "Bold and artistic logo for a creative design agency",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Corporate Identity Design",
      category: "Corporate",
      description: "Professional corporate logo with sophisticated typography",
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Startup Brand Identity",
      category: "Startup",
      description: "Dynamic logo design for an innovative startup company",
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Eco-Friendly Brand Logo",
      category: "Sustainability",
      description: "Green-inspired logo for an eco-conscious brand",
    },
    {
      id: 6,
      url: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Luxury Fashion Logo",
      category: "Fashion",
      description: "Elegant logo design for a high-end fashion brand",
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Food & Beverage Branding",
      category: "Food",
      description: "Vibrant logo for a modern restaurant chain",
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Fitness Brand Identity",
      category: "Fitness",
      description: "Energetic logo for a fitness and wellness company",
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Tech Innovation Logo",
      category: "Technology",
      description: "Futuristic logo for a tech innovation firm",
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Art Gallery Branding",
      category: "Art",
      description: "Sophisticated logo for a contemporary art gallery",
    },
  ];

  const services = [
    {
      icon: Palette,
      title: "Brand Logo Design",
      description:
        "Custom logo designs that capture your brand essence and make a lasting impression on your audience.",
      features: [
        "Brand Research & Analysis",
        "Multiple Design Concepts",
        "Vector Files (AI, EPS, SVG)",
        "Brand Guidelines Document",
      ],
      price: "Starting from $299",
      timeline: "5-7 business days",
      revisions: "3 rounds included",
    },
    {
      icon: Zap,
      title: "Logo Redesign",
      description:
        "Modernize and refresh your existing logo while maintaining brand recognition and-finished customer loyalty.",
      features: [
        "Current Logo Analysis",
        "Modern Design Updates",
        "Brand Consistency Check",
        "All File Formats",
      ],
      price: "Starting from $199",
      timeline: "3-5 business days",
      revisions: "2 rounds included",
    },
    {
      icon: Users,
      title: "Logo Variations",
      description:
        "Create multiple logo variations for different use cases and applications across various media.",
      features: [
        "Horizontal/Vertical Layouts",
        "Icon-only Versions",
        "Monochrome Variations",
        "Responsive Sizes",
      ],
      price: "Starting from $149",
      timeline: "2-3 business days",
      revisions: "2 rounds included",
    },
    {
      icon: Award,
      title: "Premium Logo Package",
      description:
        "Complete logo solution with extensive brand identity elements for comprehensive brand development.",
      features: [
        "Complete Logo Suite",
        "Brand Color Palette",
        "Typography Selection",
        "Detailed Usage Guidelines",
      ],
      price: "Starting from $499",
      timeline: "7-10 business days",
      revisions: "5 rounds included",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Research",
      description:
        "We start by understanding your brand, target audience, and competitive landscape to create a strategic foundation.",
    },
    {
      step: "02",
      title: "Concept Development",
      description:
        "Our designers create multiple logo concepts based on the research, exploring different styles and approaches.",
    },
    {
      step: "03",
      title: "Design Refinement",
      description:
        "We refine the selected concept, perfecting every detail to ensure it meets your brand requirements.",
    },
    {
      step: "04",
      title: "Final Delivery",
      description:
        "You receive all logo files in various formats, along with brand guidelines for consistent usage.",
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "+66 123 456 789",
    },
    {
      icon: Mail,
      title: "Email",
      detail: "contact@logodesign.com",
    },
    {
      icon: MapPin,
      title: "Address",
      detail: "123 Design Street, Bangkok, Thailand",
    },
  ];

  // Pagination logic
  const totalItems = showAll ? portfolioImages : portfolioImages.slice(0, 4);
  const totalPages = Math.ceil(totalItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = totalItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="relative z-10 mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
              Logo & Corporate Identity
              <br />
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              การสื่อสารผ่าน อัตลักษณ์ หรือ โลโก้มีผลต่อภาพลักษณ์
              ที่มีต่อลูกค้าหรือ กลุ่มเป้าหมายสามารถทำให้จดจำลักษณะ
              และความโดดเด่น ของแบรนด์นั้นๆได้ดียิ่งขึ้น
              เราคือผู้เชี่ยวชาญด้านการสื่อสารผ่านการออกแบบโลโก้
              โดยมีสไตล์การออกแบบ Minimal, Luxury และ Modern ที่
              จะช่วยให้ธุรกิจของคุณ “ มีภาพจำต่อลูกค้าที่ดีที่สุด ”
            </p>
          </div>

          {/* Steps & Services Section */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 font-sans tracking-tight">
              ขั้นตอน & บริการ
            </h2>
          </div>

          {/* Contact Us Section */}
          <div className="text-center mb-6 mt-2 bg-white/10 py-8 rounded-lg backdrop-blur-lg border border-white/20">
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-gray-900 font-sans tracking-tight">
              ติดต่อเรา
            </h2>
            <div className="flex flex-row justify-center items-center gap-10 mx-auto max-w-lg">
              {contactInfo.slice(0, 3).map((info, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full border border-white/20 shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
                >
                  <info.icon className="w-6 h-6 text-black" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              ผลงานของพวกเรา
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {currentItems.map((image) => (
              <div
                key={image.id}
                className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>

          {!showAll && portfolioImages.length > 4 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
              >
                View More
              </button>
            </div>
          )}

          {showAll && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-300`}
              >
                <ArrowLeft className="w-5 h-5 inline-block mr-1" />
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors duration-300`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors duration-300`}
              >
                Next
                <ArrowRight className="w-5 h-5 inline-block ml-1" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services and Fees Section */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              การบริการและค่าบริการ
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              ค่าบริการโดยทั่วไป จะมีเรทราคาที่แตกต่างกันออกไป ทั้งนี้ขึ้นอยู่กับรายละเอียดของงาน
              แต่ละประเภท โดยคิดค่าบริการจากราคาเริ่มต้น - สูงสุดของงาน ประเภทนั้นๆ และไม่เกินไปกว่านั้น
              ซึ่งจะประเมินจากรายละเอียดที่ลูกค้าแจ้งตามต้องการ และผู้ประเมิน
              จะคิดค่าบริการตามความยาก - ง่าย อย่างเหมาะสม
            </p>
          </div>

          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => {
                    const content = document.getElementById(`content-${index}`);
                    if (content) {
                      content.style.display =
                        content.style.display === "none" ? "block" : "none";
                    }
                  }}
                  className="w-full text-left p-4 font-semibold text-gray-900 flex justify-between items-center"
                >
                  <span>{service.title}</span>
                  <span>{service.price}</span>
                </button>
                <div
                  id={`content-${index}`}
                  className="p-4 text-gray-600 border-t border-gray-200 hidden"
                >
                  <p className="mb-2">{service.description}</p>
                  <ul className="list-disc pl-5 mb-2">
                    {service.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <p>Timeline: {service.timeline}</p>
                  <p>Revisions: {service.revisions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              ขั้นตอนการให้บริการ
            </h2>
          </div>

          <div className="space-y-6">
            {process.map((step, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => {
                    const content = document.getElementById(`process-${index}`);
                    if (content) {
                      content.style.display =
                        content.style.display === "none" ? "block" : "none";
                    }
                  }}
                  className="w-full text-left p-4 font-semibold text-gray-900"
                >
                  Step {step.step}: {step.title}
                </button>
                <div
                  id={`process-${index}`}
                  className="p-4 text-gray-600 border-t border-gray-200 hidden"
                >
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready to Create Your Logo?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's bring your brand vision to life with a professional logo
              design that makes a lasting impression.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2">
                <span>Start Your Logo Project</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/#contact"
                className="text-gray-600 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:border-gray-400 transition-all duration-300"
              >
                Get Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogoPage;