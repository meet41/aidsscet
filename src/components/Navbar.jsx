import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const Navbar = () => {
  const [extraLinks, setExtraLinks] = useState([]);
  const [tnpLinks, setTnpLinks] = useState([]);
  const [libraryLinks, setLibraryLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const extraLinksRef = ref(db, 'others');
    const tnpLinksRef = ref(db, 'tnp');
    const libraryLinksRef = ref(db, 'library');

    onValue(extraLinksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setExtraLinks(formattedData);
      }
    });

    onValue(tnpLinksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setTnpLinks(formattedData);
      }
    });

    onValue(libraryLinksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setLibraryLinks(formattedData);
      }
    });
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      // Optionally redirect after logout
      // window.location.href = '/signin';
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // --- Dropdown Handlers (for hover) ---
  const handleMouseEnter = (e) => {
    const dropdownContent = e.currentTarget.querySelector('.dropdown-content');
    if (dropdownContent) {
      dropdownContent.style.display = 'flex'; // Use flex for vertical stacking of dropdown items
    }
  };

  const handleMouseLeave = (e) => {
    const dropdownContent = e.currentTarget.querySelector('.dropdown-content');
    if (dropdownContent) {
      dropdownContent.style.display = 'none';
    }
  };

  return (
    <nav className="navbar-horizontal">
      <ul className="menu-links">
        {/* Home */}
        <li className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <i className='fax fa-home'></i>
          <Link to="/">Home</Link>
        </li>

        {/* About Us */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/Aboutus">About Us</Link>
          <div className="dropdown-content">
            <Link to="/Aboutus">About the Department</Link>
            <Link to="/Message">Message from Head</Link>
            <Link to="/Vision">Vision</Link>
            <Link to="/Mission">Mission</Link>
            <Link to="/Peo">PEOs</Link>
            <Link to="/Po">POs</Link>
            <Link to="/Pso">PSOs</Link>
            <a href="https://scet.ac.in/department/information-technology/#gsc.tab=0" target="_blank" rel="noopener noreferrer">Staff Information</a>
            <Link to="/updateabout">Update Aboutus</Link>
          </div>
        </li>

        {/* Academics */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/Academics">Academics</Link>
          <div className="dropdown-content">
            <Link to="/Syllabus">Syllabus - AIDS</Link>
            <Link to="/showanalysis">Result Analysis</Link>
            <Link to="/showcalender">Academics Calender</Link>
            <Link to="/showtable">Class & Faculty Time Table</Link>
          </div>
        </li>

        {/* Exams */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/Exams">Exams</Link>
          <div className="dropdown-content">
            <a href="https://intraitai.triple5.in/docs/ContEvaluation/Norms_2023-24.pdf" target="_blank" rel="noopener noreferrer">Continous Evaluation Scheme</a>
            <Link to="/results">Schedules</Link>
          </div>
        </li>

        {/* Industrial Interaction */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/IndustrialInteraction">Industrial Interaction</Link>
          <div className="dropdown-content">
            <Link to="/showind">Industrial Visit</Link>
            <Link to="/viewtnp">TnP Data</Link>
            {tnpLinks.map((link) => (
              <a key={link.id} href={link.pdfUrl} target="_blank" rel="noopener noreferrer">{link.name}</a>
            ))}
            <Link to="/tnp">Update Tnp</Link>
          </div>
        </li>

        {/* Student Corner */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onOnMouseLeave={handleMouseLeave}>
          <Link to="/StudentCorner">Student Corner</Link>
          <div className="dropdown-content">
            <Link to="/showstud">Student Information</Link>
            <Link to="/showstud">Student Achievements</Link>
            <Link to="/scholar">Scholarships</Link>
            <Link to="/showalumini">Alumini Data</Link>
            <Link to="/iep">IEP Students</Link>
          </div>
        </li>

        {/* Events */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/Events">Events</Link>
          <div className="dropdown-content">
            <Link to="/Converse">Converse</Link>
            <Link to="/Converse">Expert Talks/ Workshops/ STTPs</Link>
            <Link to="/showathletics">AIDS Athletics</Link>
          </div>
        </li>

        {/* Library */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/Library">Library</Link>
          <div className="dropdown-content">
            <Link to="/viewbook">Books in Dept</Link>
            <Link to="/viewcd">CDs in Dept</Link>
            {libraryLinks.map((link) => (
              <a key={link.id} href={link.pdfUrl} target="_blank" rel="noopener noreferrer">{link.name}</a>
            ))}
            <Link to="/updatelibrary">Update Library</Link>
          </div>
        </li>

        {/* Quick Links */}
        <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/QuickLinks">Quick Links</Link>
          <div className="dropdown-content">
            <a href="https://intraitai.triple5.in/docs/holiday/holidays.pdf" target="_blank" rel="noopener noreferrer">List of Holidays</a>
            <a href="https://intraitai.triple5.in/docs/committees/list/2024-2025.pdf" target="_blank" rel="noopener noreferrer">Department Committee: 2024-25</a>
            <a href="https://intraitai.triple5.in/docs/classteachers/2024-2025.pdf" target="_blank" rel="noopener noreferrer">Class Teachers : 2024-25</a>
            <a href="https://intraitai.triple5.in/docs/CR-LR-Form.pdf" target="_blank" rel="noopener noreferrer">CR LR Candidate Form</a>
            <a href="https://www.scetlms.in/" target="_blank" rel="noopener noreferrer">SCET Leave Management</a>
            <a href="https://intraitai.triple5.in/docs/intra.pdf" target="_blank" rel="noopener noreferrer">Intra Phone Directory</a>
            <a href="http://172.16.11.2/" target="_blank" rel="noopener noreferrer">College Intranet</a>
            <a href="http://172.16.3.1:4080/login/index.php">Kerio Firewall</a>
            <a href="https://intraitai.triple5.in/docs/internet_policy.pdf" target="_blank" rel="noopener noreferrer">Policy for Internet Usage</a>
            {extraLinks.map((link) => (
              <a key={link.id} href={link.pdfUrl} target="_blank" rel="noopener noreferrer">{link.name}</a>
            ))}
          </div>
        </li>

        {/* Admin Links (conditional) - Now correctly placed */}
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to="/imageupload">Home Page Image Upload</Link>
            </li>
            <li className="nav-item">
              <Link to="/others">Add Quick Links</Link>
            </li>
            {/* Logout link also conditional */}
            <li className="nav-item" onClick={handleLogout}>
              <Link to="#">Logout</Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/signin">Sign In</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
