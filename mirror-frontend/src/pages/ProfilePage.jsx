// src/pages/ProfilePage.jsx

import React from "react";
import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <UserProfile />
    </div>
  );
}
