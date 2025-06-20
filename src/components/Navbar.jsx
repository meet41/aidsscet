import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [extraLinks, setExtraLinks] = useState([]);
  const [tnpLinks, setTnpLinks] = useState([]);
  const [libraryLinks, setLibraryLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

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
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleMouseEnter = (e) => {
    const dropdownContent = e.currentTarget.querySelector('.dropdown-content');
    if (dropdownContent) {
      dropdownContent.style.display = 'flex';
    }
  };

  const handleMouseLeave = (e) => {
    const dropdownContent = e.currentTarget.querySelector('.dropdown-content');
    if (dropdownContent) {
      dropdownContent.style.display = 'none';
    }
  };

  return (
    <div>
      <nav className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/">
                  <i className='bx bx-home-alt icon'></i>
                  <span className="text nav-text">Home Page</span>
                </a>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/Aboutus">
                  <i className='bx bx-home-alt icon'></i>
                  <span className="text nav-text">About Us</span>
                </a>
                <div className="dropdown-content">
                  <a href="/Aboutus">About the Department</a>
                  <a href="/Message">Message from Head</a>
                  <a href="/Vision">Vision</a>
                  <a href="/Mission">Mission</a>
                  <a href="/Peo">PEOs</a>
                  <a href="/Po">POs</a>
                  <a href="/Pso">PSOs</a>
                  <a href="https://scet.ac.in/department/information-technology/#gsc.tab=0">Staff Information</a>
                  <a href="/updateabout">Update Aboutus</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/Academics">
                  <i className='bx bx-bar-chart-alt-2 icon'></i>
                  <span className="text nav-text">Academics</span>
                </a>
                <div className="dropdown-content">
                  <a href="/Syllabus">Syllabus - AIDS</a>
                  <a href="/showanalysis">Result Analysis</a>
                  <a href="/showcalender">Academics Calender</a>
                  <a href="/showtable">Class & Faculty Time Table</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/Exams">
                  <i className='bx bx-bell icon'></i>
                  <span className="text nav-text">Exams</span>
                </a>
                <div className="dropdown-content">
                  <a href="https://intraitai.triple5.in/docs/ContEvaluation/Norms_2023-24.pdf">Continous Evaluation Scheme</a>
                  <a href="/results">Schedules</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/IndustrialInteraction">
                  <i className='bx bx-pie-chart-alt icon'></i>
                  <span className="text nav-text">Industrial Interaction</span>
                </a>
                <div className="dropdown-content">
                  <a href="/showind">Industrial Visit</a>
                  <a href="/viewtnp">TnP Data</a>
                  {tnpLinks.map((link) => (
                    <a key={link.id} href={link.pdfUrl} target="_blank" rel="noopener noreferrer">{link.name}</a>
                  ))}
                  <a href="/tnp">Update Tnp</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/StudentCorner">
                  <i className='bx bx-heart icon'></i>
                  <span className="text nav-text">Student Corner</span>
                </a>
                <div className="dropdown-content">
                  <a href="/showstud">Student Information</a>
                  <a href="/showstud">Student Achievements</a>
                  <a href="/scholar">Scholarships</a>
                  <a href="/showalumini">Alumini Data</a>
                  <a href="/iep">IEP Students</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/Events">
                  <i className='bx bx-wallet icon'></i>
                  <span className="text nav-text">Events</span>
                </a>
                <div className="dropdown-content dropdown-content-upwards">
                  <a href="/Converse">Converse</a>
                  <a href="/Converse">Expert Talks/ Workshops/ STTPs</a>
                  <a href="/showathletics">AIDS Athletics</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/Library">
                  <i className='bx bx-wallet icon'></i>
                  <span className="text nav-text">Library</span>
                </a>
                <div className="dropdown-content dropdown-content-upwards">
                  <a href="/viewbook">Books in Dept</a>
                  <a href="/viewcd">CDs in Dept</a>
                  {libraryLinks.map((link) => (
                    <a key={link.id} href={link.pdfUrl} target="_blank" rel="noopener noreferrer">{link.name}</a>
                  ))}
                  <a href="/updatelibrary">Update Library</a>
                </div>
              </li>
              <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/QuickLinks">
                  <i className='bx bx-wallet icon'></i>
                  <span className="text nav-text">Quick Links</span>
                </a>
                <div className="dropdown-content dropdown-content-upwards">
                  <a href="https://intraitai.triple5.in/docs/holiday/holidays.pdf">List of Holidays</a>
                  <a href="https://intraitai.triple5.in/docs/committees/list/2024-2025.pdf">Department Committee: 2024-25</a>
                  <a href="https://intraitai.triple5.in/docs/classteachers/2024-2025.pdf">Class Teachers : 2024-25</a>
                  <a href="https://intraitai.triple5.in/docs/CR-LR-Form.pdf">CR LR Candidate Form</a>
                  <a href="https://www.scetlms.in/">SCET Leave Management</a>
                  <a href="https://intraitai.triple5.in/docs/intra.pdf">Intra Phone Directory</a>
                  <a href="http://172.16.11.2/">College Intranet</a>
                  <a href="http://172.16.3.1:4080/login/index.php">Kerio Firewall</a>
                  <a href="https://intraitai.triple5.in/docs/internet_policy.pdf">Policy for Internet Usage</a>
                  {extraLinks.map((link) => (
                    <a key={link.id} href={link.pdfUrl} target="_blank" rel="noopener noreferrer">{link.name}</a>
                  ))}
                </div>
              </li>
              {isLoggedIn ? (
                <li className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <a>
                    <i className='bx bx-log-out icon'></i>
                    <span className="text nav-text">Logout</span>
                  </a>
                </li>
              ) : (
                <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <a href="/signin">
                    <i className='bx bx-log-in icon'></i>
                    <span className="text nav-text">Sign In</span>
                  </a>
                </li>
              )}

              {isLoggedIn && (
                <>
                  <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <a href="/imageupload">
                      <i className='bx bx-image-add icon'></i> {/* Example icon for image upload */}
                      <span className="text nav-text">Home Page Image Upload</span>
                    </a>
                  </li>
                  <li className="nav-link" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <a href="/others">
                      <i className='bx bx-link-alt icon'></i> {/* Example icon for quick links */}
                      <span className="text nav-text">Add Quick Links</span>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <section className="home">
        {/* <div className="text">Dashboard Sidebar</div> */}
      </section>
    </div>
  );
};

export default Navbar;
