import React from "react";
import { Link } from "react-router-dom";
import Header from './shared/Header';
import Footer from './shared/Footer';

function Dashboard(){
    return(
        <div className="w-full h-full bg-[#f0f0f0]">
            <Header />
            <Footer />
        </div>
    )
}

export default Dashboard;