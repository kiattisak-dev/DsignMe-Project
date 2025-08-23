import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/home";
import LogoPage from "./pages/logo";
import AdvertisementPage from "./pages/advertisement";
import ProductPage from "./pages/product";
import VisualPage from "./pages/visual";
import WebsiteDevelopPage from "./pages/websitedevelop";
import ContactPage from "./pages/contact";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "./components/ui/toast";
import { useToast } from "./hooks/use-toast";
import AboutPage from "./pages/about";
import FloatingLineButton from "./components/FloatingLineButton";

function App() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/logo" element={<LogoPage />} />
            <Route path="/services/advertisement" element={<AdvertisementPage />} />
            <Route path="/services/product" element={<ProductPage />} />
            <Route path="/services/visual" element={<VisualPage />} />
            <Route path="/services/website-develop" element={<WebsiteDevelopPage />} />
             <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        
        <FloatingLineButton />
        <Footer />
        <ToastViewport />
        {toasts.map(({ id, title, description, variant, duration, ...props }) => (
          <Toast key={id} variant={variant} duration={duration} onOpenChange={(open) => !open && dismiss(id)} {...props}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
      </div>
    </ToastProvider>
  );
}

export default App;