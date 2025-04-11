import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Resources from "@/pages/Resources";
import Quizzo from "@/pages/Quizzo";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
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
            <Route path="/quizzo" element={<Quizzo />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
