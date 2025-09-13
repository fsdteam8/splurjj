import Footer from "@/components/shared/Footer/Footer";
import "@/app/globals.css";
import AppProvider from "@/components/provider/AppProvider";
import NavbarPage from "@/components/shared/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AppProvider>
        <NavbarPage />
        <div className="min-h-screen">{children}</div>

        <Footer />
      </AppProvider>
    </div>
  );
};

export default MainLayout;
