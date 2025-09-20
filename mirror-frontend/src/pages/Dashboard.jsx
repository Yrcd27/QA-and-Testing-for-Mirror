import React from "react";
import Sidebar from "../components/Sidebar";
import JournalDashboard from "../components/JournalDashboard";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <JournalDashboard />
    </div>
  );
}
