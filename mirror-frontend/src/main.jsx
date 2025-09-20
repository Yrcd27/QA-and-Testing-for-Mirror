import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import JournalView from "./pages/JournalView";
import ProfilePage from "./pages/ProfilePage"; // ✅ Import profile page

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/new-entry" element={<NewEntry />} />
      <Route path="/journal/:id" element={<JournalView />} />
      <Route path="/profile" element={<ProfilePage />} /> {/* ✅ New route */}
    </Routes>
  );
}
