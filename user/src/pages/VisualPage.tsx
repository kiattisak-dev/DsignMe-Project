import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, BarChart3, Presentation, Video, ArrowRight, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const VisualPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 10;
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);

  const portfolioImages = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Visual Identity System',
      category: 'Brand Identity',
      description: 'Comprehensive visual identity for modern tech company',
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Data Infographic Design',
      category: 'Data Visualization',
      description: 'Complex data transformed into engaging visual story',
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Corporate Presentation',
      category: 'Presentation Design',
      description: 'Professional presentation design for corporate client',
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Visual Storytelling Campaign',
      category: 'Creative Design',
      description: 'Multi-media visual storytelling for brand campaign',
    },
    {
      id: 5,
      url: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Infographic Series',
      category: 'Data Visualization',
      description: 'Series of infographics for educational campaign',
    },
    {
      id: 6,
      url: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Brand Visual Guidelines',
      category: 'Brand Identity',
      description: 'Complete visual style guide for startup',
    },
    {
      id: 7,
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Investor Pitch Deck',
      category: 'Presentation Design',
      description: 'Custom pitch deck design for startup funding',
    },
    {
      id: 8,
      url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Visual Narrative',
      category: 'Creative Design',
      description: 'Story-driven visual design for marketing campaign',
    },
    {
      id: 9,
      url: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Data Visualization Dashboard',
      category: 'Data Visualization',
      description: 'Interactive dashboard design for analytics',
    },
    {
      id: 10,
      url: 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Conference Presentation',
      category: 'Presentation Design',
      description: 'Engaging presentation for industry conference',
    },
  ];

  const services = [
    {
      icon: Layers,
      title: 'Visual Identity',
      description: 'Complete visual identity systems that create consistent brand experiences across all touchpoints.',
      features: ['Visual Style Guidelines', 'Color System Design', 'Typography Selection', 'Brand Design Elements'],
      timeline: '7-10 business days',
      revisions: '4 rounds included',
    },
    {
      icon: BarChart3,
      title: 'Infographic Design',
      description: 'Transform complex data into engaging and easy-to-understand visual stories that inform and inspire.',
      features: ['Data Visualization', 'Custom Icon Design', 'Interactive Elements', 'Multiple Format Options'],
      timeline: '5-7 business days',
      revisions: '3 rounds included',
    },
    {
      icon: Presentation,
      title: 'Presentation Design',
      description: 'Professional presentation templates and custom slide designs that captivate your audience.',
      features: ['Custom Templates', 'Slide Design System', 'Animation Effects', 'Brand Integration'],
      timeline: '3-5 business days',
      revisions: '3 rounds included',
    },
    {
      icon: Video,
      title: 'Visual Storytelling',
      description: 'Create compelling visual narratives that engage and inspire your audience through powerful storytelling.',
      features: ['Story Development', 'Visual Narrative Design', 'Multi-media Integration', 'Brand Alignment'],
      timeline: '10-14 business days',
      revisions: '5 rounds included',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Visual Strategy',
      description: 'We develop a comprehensive visual strategy that aligns with your brand goals and audience needs.',
    },
    {
      step: '02',
      title: 'Creative Exploration',
      description: 'Our team explores various visual approaches and styles to find the perfect creative direction.',
    },
    {
      step: '03',
      title: 'Design Development',
      description: 'We create detailed visual designs that effectively communicate your message and engage your audience.',
    },
    {
      step: '04',
      title: 'Implementation',
      description: 'We deliver final assets and provide guidelines for consistent implementation across all platforms.',
    },
  ];

  const contactInfo = [
    {
      icon: FaLine,
      title: 'Line',
      detail: '@YourBrandLine',
    },
    {
      icon: FaInstagram,
      title: 'Instagram',
      detail: '@YourBrandIG',
    },
    {
      icon: FaFacebook,
      title: 'Facebook',
      detail: 'facebook.com/YourBrandFB',
    },
  ];

  // Pagination logic
  const totalItems = showAll ? portfolioImages : portfolioImages.slice(0, 4);
  const totalPages = Math.ceil(totalItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = totalItems.slice(startIndex, startIndex + itemsPerPage);

  // Toggle service expansion
  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  // Toggle process expansion
  const toggleProcess = (index: number) => {
    setExpandedProcess(expandedProcess === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-gray-200 via-white to-gray-300 relative overflow-hidden flex items-center justify-center min-h-screen">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-400/30 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/30 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mt-10 mb-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-5 text-gray-800">
              Visual Design Services
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              การออกแบบภาพที่สวยงามและมีประสิทธิภาพช่วยสื่อสารข้อความของคุณได้อย่างชัดเจน
              ไม่ว่าจะเป็นอัตลักษณ์ภาพ อินโฟกราฟิก การนำเสนอ หรือการเล่าเรื่องด้วยภาพ
              เราสร้างผลงานที่สร้างแรงบันดาลใจและดึงดูดผู้ชมของคุณ
            </p>
          </div>

          {/* Steps & Services Section */}
          <div className="text-center mb-4 mt-2 bg-black py-4 rounded-xl mx-auto max-w-sm">
            <h2 className="text-xl md:text-2xl font-medium text-white font-sans tracking-tight">
              ขั้นตอน & บริการ
            </h2>
          </div>

          {/* Contact Us Section */}
          <div className="text-center mb-4 mt-2 py-5 rounded-lg mx-auto max-w-4xl border border-white/20">
            <h2 className="text-xl md:text-2xl font-medium mb-4 text-black">
              ติดต่อเรา
            </h2>
            <div className="flex flex-row justify-center items-center gap-8 mx-auto max-w-md">
              {contactInfo.map((info, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-black shadow-md hover:bg-gray-200 hover:scale-105 transition-all duration-300"
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
                className="relative overflow-hidden bg-gray-100 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 aspect-square"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover absolute inset-0"
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
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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
              ค่าบริการโดยทั่วไปจะมีเรทราคาที่แตกต่างกันออกไป
              ทั้งนี้ขึ้นอยู่กับรายละเอียดของงานแต่ละประเภท
              โดยคิดค่าบริการจากราคาเริ่มต้น - สูงสุดของงานประเภทนั้นๆ
              และไม่เกินไปกว่านั้น
              ซึ่งจะประเมินจากรายละเอียดที่ลูกค้าแจ้งตามต้องการ
              และผู้ประเมินจะคิดค่าบริการตามความยาก - ง่าย อย่างเหมาะสม
            </p>
          </div>

          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleService(index)}
                  className="w-full text-left p-4 font-semibold text-gray-900 flex justify-between items-center"
                >
                  <span>{service.title}</span>
                  {expandedService === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedService === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 text-gray-600 border-t border-gray-200 overflow-hidden"
                    >
                      <p className="mb-2">{service.description}</p>
                      <ul className="list-disc pl-5 mb-2">
                        {service.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                      <p>Timeline: {service.timeline}</p>
                      <p>Revisions: {service.revisions}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  onClick={() => toggleProcess(index)}
                  className="w-full text-left p-4 font-semibold text-gray-900 flex justify-between items-center"
                >
                  <span>Step {step.step}: {step.title}</span>
                  {expandedProcess === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedProcess === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 text-gray-600 border-t border-gray-200 overflow-hidden"
                    >
                      <p>{step.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              Ready to Create Visual Impact?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's create stunning visual designs that communicate your message
              effectively and engage your audience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2">
                <span>Start Your Visual Project</span>
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

export default VisualPage;