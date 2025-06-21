import React from 'react';
import {  Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-gray-100">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in py-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700 font-sans">Premium Design Agency</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 font-serif">
            Design Your Unique Identity
            <br />
            <span>ออกแบบอัตลักษณ์อย่างมี"เอกลักษณ์"</span>
          </h1>
          
          <div className="text-base md:text-lg text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed font-sans">
            <p>
              พวกเราคือกราฟิกดีไซน์เนอร์ที่เชี่ยวชาญด้านการออกแบบ
              <br />
              <strong>มีประสบการณ์มากกว่า 4 ปี</strong>
              <br />
              ที่สามารถช่วยส่งเสริมธุรกิจด้วยการออกแบบที่ดีที่สุดให้กับธุรกิจคุณ
            </p>
            <div className="my-6">
              <hr className="border-t-2 border-gray-300" />
            </div>
            <p>
              เราเป็นทีมกราฟิกดีไซน์เนอร์ที่มีประสบการณ์
              <br />
              ช่วยสร้างอัตลักษณ์ที่โดดเด่นให้กับธุรกิจของคุณ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;