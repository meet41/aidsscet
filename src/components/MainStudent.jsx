import React from "react";
import './AboutUs.css';
const MainStudent = () => {
    return (
        <marquee behavior="" className="marquee-container" direction="ltr">
        <div className="links">
          <a href="/showstud">Student Information</a>
          <a href="/showstud">Student Achievement</a>
          <a href="/scholar">Scholarship</a>
          <a href="/showalumini">Alumini Data</a>
          <a href="/iep">IEP</a>
        </div>
      </marquee>
    );
}
export default MainStudent;