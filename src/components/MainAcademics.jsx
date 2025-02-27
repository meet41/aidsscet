import React from "react";
import './AboutUs.css';
const MainAcademics = () => {
    return (
        <marquee behavior="" className="marquee-container" direction="ltr">
        <div className="links">
          <a href="/syllabus">Syllabus</a>
          <a href="/showanalysis">Result analysis</a>
          <a href="/showcalender">Academics Calender</a>
          <a href="/showtable">Class Time Table</a>
        </div>
      </marquee>
    );
}
export default MainAcademics;