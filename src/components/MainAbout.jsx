import React from "react";
import './AboutUs.css';
const MainAbout = () => {
    return (
        <marquee behavior="" className="marquee-container" direction="ltr">
        <div className="links">
          <a href="/aboutus">About Department</a>
          <a href="/message">Message</a>
          <a href="/vision">Vision</a>
          <a href="/mission">Mission</a>
          <a href="/peo">PEO</a>
          <a href="/pso">PSO</a>
          <a href="/po">PO</a>
          <a href="https://scet.ac.in/department/information-technology/#gsc.tab=0">Staff Info.</a>
        </div>
      </marquee>
    );
}
export default MainAbout;