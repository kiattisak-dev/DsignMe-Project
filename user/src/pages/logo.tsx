"use client";

import React, { useRef } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import { logoPageData } from "../types/data";
import { PortfolioItem, Service } from "../types/types";
import { motion } from "framer-motion";

// กำหนด interface สำหรับ response ของ project และ service step
interface ProjectResponse {
  _id: string;
  imageUrl?: string;
  videoUrl?: string;
  videoLink?: string;
  title?: string;
  description?: string;
  mediaType?: string;
}

interface ServiceStep {
  title?: string;
  subtitles?: string[];
  headings?: string[];
}

// ฟังก์ชันแปลง mediaType string เป็น type union ที่ PortfolioItem ต้องการ
const mapMediaType = (
  input?: string
): "video" | "image" | "youtube" | undefined => {
  if (input === "video" || input === "image" || input === "youtube") {
    return input;
  }
  return undefined;
};

const LogoPage: React.FC = () => {
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ฟังก์ชัน fetch projects พร้อมจำกัด fields เพื่อลดขนาดข้อมูล
  const fetchProjects = async (
    limit: number = 4,
    offset: number = 0
  ): Promise<PortfolioItem[]> => {
    const projectsResponse = await fetch(
      `${API_BASE_URL}/projects/logo?limit=${limit}&offset=${offset}&fields=_id,imageUrl,videoUrl,videoLink,title,description,mediaType`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!projectsResponse.ok) {
      throw new Error(`Failed to fetch projects: ${projectsResponse.statusText}`);
    }

    const projectsData: { data: ProjectResponse[] } = await projectsResponse.json();
    const projects = projectsData.data || [];

    const mappedPortfolioImages: PortfolioItem[] = projects
      .map((project, index) => {
        const id = project._id || `fallback-${index}`;
        return {
          id,
          url: project.imageUrl || "",
          videoUrl: project.videoUrl || "",
          videoLink: project.videoLink || "",
          title: project.title || "Logo Project",
          category: "logo",
          description: project.description || "",
          mediaType: mapMediaType(project.mediaType),
        };
      })
      .filter((item) => {
        if (!item.id || item.id === "") {
          console.warn(`Skipping project with invalid ID: ${JSON.stringify(item)}`);
          return false;
        }
        return true;
      });

    return mappedPortfolioImages;
  };

  // ฟังก์ชัน fetch services
  const fetchServices = async (): Promise<Service[]> => {
    const servicesResponse = await fetch(
      `${API_BASE_URL}/servicesteps/logo/service-steps`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!servicesResponse.ok) {
      throw new Error(`Failed to fetch service steps: ${servicesResponse.statusText}`);
    }

    const servicesData: { data: ServiceStep[] } = await servicesResponse.json();
    const serviceSteps = servicesData.data || [];

    const mappedServices: Service[] = serviceSteps.map((step) => ({
      title: step.title || "Service",
      description: step.subtitles || [],
      features: step.headings || [],
      timeline: step.subtitles?.find((s) => s.includes("ระยะเวลา")) || "",
      revisions: step.subtitles?.find((s) => s.includes("แก้ไข")) || "",
    }));

    return mappedServices;
  };

  // Use Query for initial projects and services (parallel โดยอัตโนมัติผ่าน React Query)
  const { data: initialProjects = [], isLoading: isProjectsLoading, error: projectsError } = useQuery({
    queryKey: ["logoProjectsInitial"],
    queryFn: () => fetchProjects(4, 0),
  });

  const { data: services = [], isLoading: isServicesLoading, error: servicesError } = useQuery({
    queryKey: ["logoServices"],
    queryFn: fetchServices,
  });

  // Infinite Query for fetching more projects
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: moreError,
  } = useInfiniteQuery<PortfolioItem[], Error>({
    queryKey: ["logoProjectsInfinite"],
    queryFn: ({ pageParam = 4 }) => fetchProjects(8, pageParam as number),
    getNextPageParam: (lastPage: PortfolioItem[], allPages: PortfolioItem[][]) => {
      const nextOffset = allPages.flat().length;
      return lastPage.length < 8 ? undefined : nextOffset;
    },
    initialPageParam: 4,
  });

  // รวม portfolioImages จาก initial + infinite
  const portfolioImages = [
    ...initialProjects,
    ...(data?.pages.flatMap((page: PortfolioItem[]) => page) || []),
  ];

  // Debounce fetchNextPage เพื่อป้องกันเรียกซ้ำเร็วเกิน
  const debouncedFetchNextPage = debounce(fetchNextPage, 300);

  const loading = isProjectsLoading || isServicesLoading;
  const error = projectsError || servicesError || moreError;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="text-center filter grayscale"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-black">กำลังโหลดข้อมูล...</p>
          <p className="text-gray-600 mt-2">กรุณารอสักครู่</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">
            ข้อผิดพลาด: {(error as Error).message || "เกิดข้อผิดพลาดขณะดึงข้อมูล"}
          </p>
          <p className="text-gray-500 mt-2">กรุณาลองใหม่ในภายหลัง</p>
        </div>
      </div>
    );
  }

  const scrollToServices = () => {
    if (servicesSectionRef.current) {
      const navbarHeight = 100;
      const elementPosition =
        servicesSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <HeroSection
        title={logoPageData.title}
        description={logoPageData.description}
        contactInfo={logoPageData.contactInfo}
        onServicesClick={scrollToServices}
      />
      <PortfolioSection
        portfolioImages={portfolioImages}
        isFetchingMore={isFetchingNextPage}
        onFetchMore={debouncedFetchNextPage}
        hasMore={hasNextPage}
      />
      <div ref={servicesSectionRef}>
        <ServicesSection services={services} />
      </div>
      <ProcessSection process={logoPageData.process} />
    </div>
  );
};

export default LogoPage;