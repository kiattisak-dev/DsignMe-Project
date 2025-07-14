import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LogoPage from "./pages/LogoPage";
import AdvertisementPage from "./pages/AdvertisementPage";
import ProductPage from "./pages/ProductPage";
import VisualPage from "./pages/VisualPage";
import WebsiteDevelopPage from "./pages/WebsiteDevelopPage";
import ContactPage from "./pages/ContactPage";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "./components/ui/toast";
import { useToast } from "./hooks/use-toast";
import AboutPage from "./pages/AboutPage";

function App() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-white font-inter">
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