import React from "react";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className=" pb-16 bg-white relative overflow-hidden flex items-center justify-center min-h-screen"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in py-1">
           <div className="flex items-center justify-center mb-10 pt-10 mt-3 mt-[-2rem]">
            <img className="w-60 h-40" src="/Logo D.svg" />
          </div>
          <div className="flex items-center justify-center mb-6">
          </div>
         
          {/* เปลี่ยนเป็น font Kanit */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl mt-[-2rem] font-bold text-black">
            Design Your Unique Identity
            <br />
            <br />
          </h1>
          <div className="mb-10 mt-[-1rem]">
          <span className="text-xl md:text-3xl lg:text-4xl font-bold text-black">ออกแบบอัตลักษณ์อย่างมี"เอกลักษณ์"</span>
          </div>
          
          <div className="bg-black backdrop-blur-sm p-6">
            
            <div className="text-base md:text-lg mb-6 max-w-xl mx-auto leading-relaxed font-sans">
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
              <p className="mb-[-1.5rem]">
                เราเป็นทีมกราฟิกดีไซน์เนอร์ที่มีประสบการณ์
                <br />
                ช่วยสร้างอัตลักษณ์ที่โดดเด่นให้กับธุรกิจของคุณ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
