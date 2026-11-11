import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/SideBar/SideBar";

export default function MyCodeLandLayout({ children }) {
    return (

        <ProtectedRoute>
        <div dir="rtl" className="flex min-h-screen bg-[#030712] text-white">
            {/* سایدبار سمت راست */}
            <Sidebar />

            {/* محتوای اصلی سمت چپ */}
            <div className="min-w-0 flex-1 p-4">
                <Navbar />

                <main className="mt-6">{children}</main>
            </div>
        </div>

        </ProtectedRoute>
    );
}
