import { MegaMenuProvider } from "./components/context/MegaMenuContext";
import PageBackground from "./components/BackPage/Pagebackground ";
import Footer from "./components/Footer/Footer";
import SiteContainer from "./components/layout/SiteContainer";
import Navbar from "./components/Navbar/Navbar";

export default function MainLayout({ children }) {
    return (
        <MegaMenuProvider>
            <PageBackground />

            <div className="relative z-10">
                <Navbar />

                <SiteContainer>{children}</SiteContainer>

                <Footer />
            </div>
        </MegaMenuProvider>
    );
}
