import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function LayoutProtected() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col">
        <Navbar showMenu={true} />
        
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer opcional */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
            © 2024 BookPal. Tu comunidad de lectores.
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}