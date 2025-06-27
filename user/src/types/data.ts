import {
  Box,
  Palette,
  Layers,
  Code,
  Monitor,
  Camera,
  BookOpen,
  BarChart3,
  Presentation,
  Video,
  Globe,
  Layout,
  Shield,
  Zap,
  Users,
  Award,
  Printer,
  Target,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLine } from "react-icons/fa";
import { ContactInfo, PortfolioItem, ProcessStep, Service } from "./types";

export interface PageData {
  title: string;
  description: string;
  portfolioImages: PortfolioItem[];
  services: Service[];
  process: ProcessStep[];
  contactInfo: ContactInfo[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
}

export const productPageData: PageData = {
  title: "Product Design Services",
  description:
    "การออกแบบผลิตภัณฑ์ที่สวยงามและใช้งานได้จริงช่วยให้ผลิตภัณฑ์ของคุณโดดเด่นในตลาด ไม่ว่าจะเป็นการออกแบบบรรจุภัณฑ์ การสร้างภาพ 3 มิติ แคตตาล็อก หรือการสร้างแบรนด์ เราสร้างผลิตภัณฑ์ที่ดึงดูดลูกค้าและประสบความสำเร็จในธุรกิจ",
  portfolioImages: [
    {
      id: 1,
      url: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Premium Product Packaging",
      category: "Packaging Design",
      description: "Luxury packaging design for high-end consumer products",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Product Catalog Design",
      category: "Catalog Design",
      description: "Comprehensive product catalog for retail and wholesale",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Product Brand Identity",
      category: "Brand Design",
      description: "Complete branding solution for new product launch",
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Product Visualization",
      category: "3D Rendering",
      description: "3D product renders for e-commerce and marketing",
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Eco-Friendly Packaging",
      category: "Packaging Design",
      description: "Sustainable packaging design for eco-conscious brand",
    },
    {
      id: 6,
      url: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Digital Product Catalog",
      category: "Catalog Design",
      description: "Interactive digital catalog for online retail",
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Product Branding Campaign",
      category: "Brand Design",
      description: "Branding campaign for new product line",
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "3D Product Render",
      category: "3D Rendering",
      description: "Photorealistic product render for marketing materials",
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Retail Packaging Design",
      category: "Packaging Design",
      description: "Eye-catching packaging for retail products",
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Product Brochure",
      category: "Catalog Design",
      description: "Professional brochure for product promotion",
    },
  ],
  services: [
    {
      icon: Box,
      title: "Product Packaging",
      description:
        "Attractive packaging design that protects your product and attracts customers at point of sale.",
      features: [
        "Custom Package Design",
        "Label & Sticker Design",
        "Material Consultation",
        "Production-Ready Files",
      ],
      timeline: "5-7 business days",
      revisions: "3 rounds included",
    },
    {
      icon: Camera,
      title: "Product Visualization",
      description:
        "3D product renders and visualizations for marketing, e-commerce, and presentation purposes.",
      features: [
        "3D Product Modeling",
        "Photorealistic Renders",
        "Lifestyle Photography",
        "Multiple Angle Views",
      ],
      timeline: "7-10 business days",
      revisions: "3 rounds included",
    },
    {
      icon: BookOpen,
      title: "Product Catalog",
      description:
        "Professional product catalogs and brochures for sales, marketing, and customer education.",
      features: [
        "Catalog Layout Design",
        "Product Photography",
        "Print & Digital Formats",
        "Interactive Elements",
      ],
      timeline: "10-14 business days",
      revisions: "4 rounds included",
    },
    {
      icon: Palette,
      title: "Product Branding",
      description:
        "Complete product branding including naming, identity, positioning, and market strategy.",
      features: [
        "Product Naming",
        "Brand Identity Design",
        "Market Positioning",
        "Launch Strategy",
      ],
      timeline: "14-21 business days",
      revisions: "5 rounds included",
    },
  ],
  process: [
    {
      step: "01",
      title: "Product Analysis",
      description:
        "We study your product, target market, and competitive landscape to understand design requirements.",
    },
    {
      step: "02",
      title: "Concept Development",
      description:
        "Our team creates initial design concepts that align with your product goals and brand identity.",
    },
    {
      step: "03",
      title: "Design Refinement",
      description:
        "We refine the chosen concept, incorporating feedback and ensuring optimal functionality and appeal.",
    },
    {
      step: "04",
      title: "Production Support",
      description:
        "We provide production-ready files and ongoing support for manufacturing and launch.",
    },
  ],
  contactInfo: [
    {
      icon: FaLine,
      title: "Line",
      detail: "@YourBrandLine",
    },
    {
      icon: FaInstagram,
      title: "Instagram",
      detail: "@YourBrandIG",
    },
    {
      icon: FaFacebook,
      title: "Facebook",
      detail: "facebook.com/YourBrandFB",
    },
  ],
  ctaTitle: "Ready to Design Your Product?",
  ctaDescription:
    "Let's create a product design that stands out in the market and drives business success.",
  ctaButtonText: "Start Your Product Design",
};

export const visualPageData: PageData = {
  title: "Visual Design Services",
  description:
    "การออกแบบภาพที่สวยงามและมีประสิทธิภาพช่วยสื่อสารข้อความของคุณได้อย่างชัดเจน ไม่ว่าจะเป็นอัตลักษณ์ภาพ อินโฟกราฟิก การนำเสนอ หรือการเล่าเรื่องด้วยภาพ เราสร้างผลงานที่สร้างแรงบันดาลใจและดึงดูดผู้ชมของคุณ",
  portfolioImages: [
    {
      id: 1,
      url: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Visual Identity System",
      category: "Brand Identity",
      description: "Comprehensive visual identity for modern tech company",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Data Infographic Design",
      category: "Data Visualization",
      description: "Complex data transformed into engaging visual story",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Corporate Presentation",
      category: "Presentation Design",
      description: "Professional presentation design for corporate client",
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Visual Storytelling Campaign",
      category: "Creative Design",
      description: "Multi-media visual storytelling for brand campaign",
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Infographic Series",
      category: "Data Visualization",
      description: "Series of infographics for educational campaign",
    },
    {
      id: 6,
      url: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Brand Visual Guidelines",
      category: "Brand Identity",
      description: "Complete visual style guide for startup",
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Investor Pitch Deck",
      category: "Presentation Design",
      description: "Custom pitch deck design for startup funding",
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Visual Narrative",
      category: "Creative Design",
      description: "Story-driven visual design for marketing campaign",
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Data Visualization Dashboard",
      category: "Data Visualization",
      description: "Interactive dashboard design for analytics",
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Conference Presentation",
      category: "Presentation Design",
      description: "Engaging presentation for industry conference",
    },
  ],
  services: [
    {
      icon: Layers,
      title: "Visual Identity",
      description:
        "Complete visual identity systems that create consistent brand experiences across all touchpoints.",
      features: [
        "Visual Style Guidelines",
        "Color System Design",
        "Typography Selection",
        "Brand Design Elements",
      ],
      timeline: "7-10 business days",
      revisions: "4 rounds included",
    },
    {
      icon: BarChart3,
      title: "Infographic Design",
      description:
        "Transform complex data into engaging and easy-to-understand visual stories that inform and inspire.",
      features: [
        "Data Visualization",
        "Custom Icon Design",
        "Interactive Elements",
        "Multiple Format Options",
      ],
      timeline: "5-7 business days",
      revisions: "3 rounds included",
    },
    {
      icon: Presentation,
      title: "Presentation Design",
      description:
        "Professional presentation templates and custom slide designs that captivate your audience.",
      features: [
        "Custom Templates",
        "Slide Design System",
        "Animation Effects",
        "Brand Integration",
      ],
      timeline: "3-5 business days",
      revisions: "3 rounds included",
    },
    {
      icon: Video,
      title: "Visual Storytelling",
      description:
        "Create compelling visual narratives that engage and inspire your audience through powerful storytelling.",
      features: [
        "Story Development",
        "Visual Narrative Design",
        "Multi-media Integration",
        "Brand Alignment",
      ],
      timeline: "10-14 business days",
      revisions: "5 rounds included",
    },
  ],
  process: [
    {
      step: "01",
      title: "Visual Strategy",
      description:
        "We develop a comprehensive visual strategy that aligns with your brand goals and audience needs.",
    },
    {
      step: "02",
      title: "Creative Exploration",
      description:
        "Our team explores various visual approaches and styles to find the perfect creative direction.",
    },
    {
      step: "03",
      title: "Design Development",
      description:
        "We create detailed visual designs that effectively communicate your message and engage your audience.",
    },
    {
      step: "04",
      title: "Implementation",
      description:
        "We deliver final assets and provide guidelines for consistent implementation across all platforms.",
    },
  ],
  contactInfo: [
    { icon: FaLine, title: "Line", detail: "@YourBrandLine" },
    { icon: FaInstagram, title: "Instagram", detail: "@YourBrandIG" },
    { icon: FaFacebook, title: "Facebook", detail: "facebook.com/YourBrandFB" },
  ],
  ctaTitle: "Ready to Create Visual Impact?",
  ctaDescription:
    "Let's create stunning visual designs that communicate your message effectively and engage your audience.",
  ctaButtonText: "Start Your Visual Project",
};

export const websiteDevelopPageData: PageData = {
  title: "Website Development Services",
  description:
    "การพัฒนาเว็บไซต์ที่ทันสมัยและตอบโจทย์ธุรกิจของคุณ ไม่ว่าจะเป็นเว็บไซต์สำหรับองค์กร อีคอมเมิร์ซ หรือแพลตฟอร์มเฉพาะ เราสร้างเว็บไซต์ที่สวยงาม ใช้งานง่าย และช่วยเพิ่มประสิทธิภาพให้กับธุรกิจของคุณ",
  portfolioImages: [
    {
      id: 1,
      url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Corporate Website",
      category: "Web Development",
      description: "Professional website for corporate businesses",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "E-Commerce Platform",
      category: "E-Commerce",
      description: "Custom e-commerce solution for online retail",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Portfolio Website",
      category: "Portfolio",
      description: "Creative portfolio site for artists and freelancers",
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Startup Landing Page",
      category: "Landing Page",
      description: "Dynamic landing page for startup promotion",
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Blog Website",
      category: "Blog",
      description: "Modern blog platform with CMS integration",
    },
    {
      id: 6,
      url: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Non-Profit Website",
      category: "Non-Profit",
      description: "Engaging website for non-profit organizations",
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "SaaS Application",
      category: "Web Application",
      description: "Scalable SaaS platform with user dashboard",
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Educational Platform",
      category: "E-Learning",
      description: "Interactive e-learning website for students",
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Restaurant Website",
      category: "Hospitality",
      description: "Elegant website with reservation system",
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Fitness Website",
      category: "Fitness",
      description: "Dynamic website for fitness services",
    },
  ],

  services: [
    {
      icon: Code,
      title: "Custom Website Development",
      description:
        "Tailored website solutions to meet your business goals with modern design and functionality.",
      features: [
        "Responsive Design",
        "Custom CMS Integration",
        "SEO Optimization",
        "Performance Optimization",
      ],
      timeline: "14-21 business days",
      revisions: "4 rounds included",
    },
    {
      icon: Globe,
      title: "E-Commerce Development",
      description:
        "Complete e-commerce platforms with secure payment gateways and user-friendly interfaces.",
      features: [
        "Shopping Cart Integration",
        "Payment Gateway Setup",
        "Product Management",
        "Analytics Integration",
      ],
      timeline: "21-30 business days",
      revisions: "5 rounds included",
    },
    {
      icon: Layout,
      title: "UI/UX Design",
      description:
        "User-centric design services to create intuitive and engaging website experiences.",
      features: [
        "Wireframe Design",
        "Prototyping",
        "User Testing",
        "Visual Design",
      ],
      timeline: "10-14 business days",
      revisions: "3 rounds included",
    },
    {
      icon: Shield,
      title: "Website Maintenance",
      description:
        "Ongoing support and updates to keep your website secure, fast, and up-to-date.",
      features: [
        "Regular Updates",
        "Security Monitoring",
        "Backup Services",
        "Performance Tuning",
      ],
      timeline: "Ongoing",
      revisions: "As needed",
    },
  ],
  process: [
    {
      step: "01",
      title: "Requirement Analysis",
      description:
        "We gather your requirements, analyze your goals, and study your target audience and market.",
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description:
        "Our team creates wireframes and prototypes to visualize the website structure and design.",
    },
    {
      step: "03",
      title: "Development & Testing",
      description:
        "We develop the website, integrate features, and conduct rigorous testing for functionality and performance.",
    },
    {
      step: "04",
      title: "Launch & Support",
      description:
        "We launch the website and provide ongoing support to ensure it runs smoothly.",
    },
  ],
  contactInfo: [
    { icon: FaLine, title: "Line", detail: "@YourBrandLine" },
    { icon: FaInstagram, title: "Instagram", detail: "@YourBrandIG" },
    { icon: FaFacebook, title: "Facebook", detail: "facebook.com/YourBrandFB" },
  ],
  ctaTitle: "Ready to Build Your Website?",
  ctaDescription:
    "Let's create a website that enhances your brand and drives business success with cutting-edge design and functionality.",
  ctaButtonText: "Start Your Website Project",
};

export const logoPageData: PageData = {
  title: "Logo & Corporate Identity",
  description:
    "การสื่อสารผ่าน อัตลักษณ์ หรือ โลโก้มีผลต่อภาพลักษณ์ที่มีต่อลูกค้าหรือ กลุ่มเป้าหมายสามารถทำให้จดจำลักษณะและความโดดเด่น ของแบรนด์นั้นๆได้ดียิ่งขึ้น เราคือผู้เชี่ยวชาญด้านการสื่อสารผ่านการออกแบบโลโก้ โดยมีสไตล์การออกแบบ Minimal, Luxury และ Modern ที่จะช่วยให้ธุรกิจของคุณ “ มีภาพจำต่อลูกค้าที่ดีที่สุด ”",
  portfolioImages: [
    {
      id: 1,
      url: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Modern Tech Startup Logo",
      category: "Technology",
      description:
        "Clean, minimalist logo design for a cutting-edge tech startup",
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
  ],
  services: [
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
      timeline: "5-7 business days",
      revisions: "3 rounds included",
    },
    {
      icon: Zap,
      title: "Logo Redesign",
      description:
        "Modernize and refresh your existing logo while maintaining brand recognition and customer loyalty.",
      features: [
        "Current Logo Analysis",
        "Modern Design Updates",
        "Brand Consistency Check",
        "All File Formats",
      ],
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
      timeline: "7-10 business days",
      revisions: "5 rounds included",
    },
  ],
  process: [
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
  ],
  contactInfo: [
    { icon: FaLine, title: "Line", detail: "@YourBrandLine" },
    { icon: FaInstagram, title: "Instagram", detail: "@YourBrandIG" },
    { icon: FaFacebook, title: "Facebook", detail: "facebook.com/YourBrandFB" },
  ],
  ctaTitle: "Ready to Create Your Logo?",
  ctaDescription:
    "Let's bring your brand vision to life with a professional logo design that makes a lasting impression.",
  ctaButtonText: "Start Your Logo Project",
};

export const advertisementPageData: PageData = {
  title: "Advertisement Design Services",
  description:
    "การออกแบบโฆษณาที่น่าสนใจและมีประสิทธิภาพช่วยให้แบรนด์ของคุณโดดเด่น ไม่ว่าจะเป็นสื่อดิจิทัล สื่อสิ่งพิมพ์ หรือแคมเปญครบวงจร เราสร้างโฆษณาที่ดึงดูดความสนใจและสร้างผลลัพธ์ให้กับธุรกิจของคุณ",
  portfolioImages: [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Digital Marketing Campaign',
      category: 'Digital Marketing',
      description: 'Comprehensive digital advertising campaign for tech startup',
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Social Media Advertisement',
      category: 'Social Media',
      description: 'Engaging social media ads for fashion brand promotion',
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Print Advertisement Design',
      category: 'Print Media',
      description: 'Professional magazine advertisement for luxury products',
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Outdoor Advertising Campaign',
      category: 'Outdoor Media',
      description: 'Large-scale billboard design for brand awareness campaign',
    },
    {
      id: 5,
      url: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Video Ad Campaign',
      category: 'Video',
      description: 'Dynamic video advertisement for digital platforms',
    },
    {
      id: 6,
      url: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Social Media Banner',
      category: 'Social Media',
      description: 'Vibrant banner design for social media promotion',
    },
    {
      id: 7,
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Magazine Ad Layout',
      category: 'Print Media',
      description: 'Elegant magazine ad design for luxury brand',
    },
    {
      id: 8,
      url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Billboard Campaign',
      category: 'Outdoor Media',
      description: 'Bold billboard design for urban campaign',
    },
    {
      id: 9,
      url: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Digital Ad Series',
      category: 'Digital Marketing',
      description: 'Series of digital ads for product launch',
    },
    {
      id: 10,
      url: 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Video Promotion',
      category: 'Video',
      description: 'Engaging video ad for social media campaign',
    },
  ],

  services: [
    {
      icon: Monitor,
      title: 'Digital Advertising',
      description: 'Eye-catching digital ads for social media, web, and mobile platforms that drive engagement.',
      features: ['Social Media Ad Design', 'Web Banner Creation', 'Mobile-Optimized Formats', 'A/B Testing Designs'],
      timeline: '3-5 business days',
      revisions: '3 rounds included',
    },
    {
      icon: Printer,
      title: 'Print Advertising',
      description: 'Professional print advertisements for magazines, newspapers, and outdoor media campaigns.',
      features: ['Magazine Advertisement', 'Newspaper Ad Design', 'Billboard Design', 'Print-Ready Files'],
      timeline: '5-7 business days',
      revisions: '3 rounds included',
    },
    {
      icon: Target,
      title: 'Campaign Design',
      description: 'Complete advertising campaign design with consistent visual identity across all touchpoints.',
      features: ['Campaign Strategy', 'Multi-Format Designs', 'Brand Consistency', 'Performance Analytics'],
      timeline: '7-10 business days',
      revisions: '5 rounds included',
    },
    {
      icon: Video,
      title: 'Video Advertising',
      description: 'Motion graphics and video advertisements for digital platforms and social media.',
      features: ['Motion Graphics', 'Video Ad Creation', 'Animation Design', 'Multiple Video Formats'],
      timeline: '10-14 business days',
      revisions: '4 rounds included',
    },
  ],

  process: [
    {
      step: '01',
      title: 'Strategy & Planning',
      description: 'We analyze your target audience, competitors, and campaign objectives to develop an effective advertising strategy.',
    },
    {
      step: '02',
      title: 'Creative Concept',
      description: 'Our team develops compelling creative concepts that align with your brand message and campaign goals.',
    },
    {
      step: '03',
      title: 'Design & Production',
      description: 'We create high-quality advertisements optimized for your chosen platforms and media channels.',
    },
    {
      step: '04',
      title: 'Launch & Optimize',
      description: 'We deliver final assets and provide guidance for campaign launch and performance optimization.',
    },
  ],

  contactInfo: [
    { icon: FaLine, title: "Line", detail: "@YourBrandLine" },
    { icon: FaInstagram, title: "Instagram", detail: "@YourBrandIG" },
    { icon: FaFacebook, title: "Facebook", detail: "facebook.com/YourBrandFB" },
  ],
  ctaTitle: "Ready to Launch Your Campaign?",
  ctaDescription:
    "Let's create compelling advertisements that drive engagement and deliver results for your business.",
  ctaButtonText: "Start Your Campaign",
};
