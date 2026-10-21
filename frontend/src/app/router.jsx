/**
 * App Router — all routes defined here
 */
import { Routes, Route } from "react-router-dom";
import Navbar        from "../components/layout/Navbar";
import Footer        from "../components/layout/Footer";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute    from "./GuestRoute";

// Pages
import Home          from "../pages/Home/Home";
import Patterns      from "../pages/Patterns/Patterns";
import PatternDetail from "../pages/PatternDetail/PatternDetail";
import Login         from "../pages/Auth/Login";
import Register      from "../pages/Auth/Register";
import OAuthCallback from "../pages/Auth/OAuthCallback";
import Profile       from "../pages/Profile/Profile";
import Practice      from "../pages/Practice/Practice";
import NotFound      from "../pages/NotFound";

const Router = () => (
  <>
    <Navbar />

    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Routes>
        {/* Public routes */}
        <Route path="/"                    element={<Home />} />
        <Route path="/patterns"            element={<Patterns />} />
        <Route path="/patterns/:patternId" element={<PatternDetail />} />
        <Route path="/auth/callback"       element={<OAuthCallback />} />

        {/* Guest-only (redirect to /patterns if logged in) */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Protected (redirect to /login if not logged in) */}
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>

    <Footer />
  </>
);

export default Router;
