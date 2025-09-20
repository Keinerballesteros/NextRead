import React from "react";
import { Link } from "react-router-dom";
import Header from "./shared/Header";
import Footer from "./shared/Footer";

function Dashboard() {
  return (
    <div className="w-full min-h-screen bg-[#f0f0f0] flex flex-col">
      <Header />
      <div className="w-full flex-1">
        <h1>Content</h1>
      </div>
      <Footer className="flex justify-end" />
    </div>
  );
}

export default Dashboard;
