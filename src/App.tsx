import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Resources from "@/pages/Resources";
import DepartmentWizard from "@/pages/Resources/DepartmentWizard";
import Quizzo from "@/pages/Quizzo";
import PYQ from "@/pages/PYQ"; 

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <Features />
              </main>
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/pyq-wizard" element={<DepartmentWizard />} />
          
          {/* Redirect old department view paths to wizard */}
          <Route path="/resources/:departmentId" element={<Navigate to="/pyq-wizard" replace />} />
          <Route path="/pyq/:departmentId" element={<Navigate to="/pyq-wizard" replace />} />
          <Route path="/pyq/:departmentId/:branchId" element={<Navigate to="/pyq-wizard" replace />} />
          
          <Route path="/quizzo" element={<Quizzo />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
