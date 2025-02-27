import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const AboutUs = () => {
  const [aboutDeptData, setAboutDeptData] = useState('');

  useEffect(() => {
    fetchAboutDeptData();
  }, []);

  const fetchAboutDeptData = async () => {
    const db = getDatabase();
    const aboutDeptRef = ref(db, 'aboutus/about-dept');
    try {
      const snapshot = await get(aboutDeptRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setAboutDeptData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching about dept data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>ABOUT DEPARTMENT OF INFORMATION TECHNOLOGY</h2>
      {aboutDeptData ? (
        <div dangerouslySetInnerHTML={{ __html: aboutDeptData }} />
      ) : (
        <p><br />Loading about department data...</p>
      )}
    </div>
  );
}

export default AboutUs;


        {/* <p>
          The Department of Information Technology Engineering, established in 2001 provides one of the best learning opportunities to students with its contemporary course design and curriculum and by providing state-of-art learning resources.
        </p>
        <p>
          The IT department currently offers two AICTE approved courses of engineering:
        </p>
        <ul>
          <li>BTech(Information Technology) with an intake of 120 students</li>
          <li>BTech(Artificial Intelligence and Data Science) with an intake of 60 students</li>
        </ul>
        <p>
          The Department of Information Technology has dedicated, fully-qualified and highly experienced teaching faculty who are committed towards nurturing young IT professionals of the next generation. The department has spacious, well-equipped laboratories with latest computer systems and other resources like laptops, projectors, graphics processing unit and wireless devices in addition to a continuous, high-speed Internet access to facilitate the curriculum’s practical implementation and project-development work.
        </p>
        <p>
          The I.T. Department regularly organizes seminars, guest lectures, workshops, short term trainings and programming contests for students to expand their knowledge and skill set beyond the regular curriculum. We encourage our students to work on innovative and industry-applicable projects so that they can become the most highly sought after I.T. graduates in the country.
        </p>
        <h2>HIGHLIGHTS OF THE DEPARTMENT</h2>
        <ul>
          <li>Vibrant Learning and Research Environment</li>
          <li>Jobs for students in reputed MNCs through Campus placement assistance like TCS, Wipro, Cognizant etc.</li>
          <li>Scholarships for Meritorious students</li>
          <li>Experienced and Qualified permanent faculty members holding Ph.D. and M.Tech degrees</li>
          <li>Selection as Student ambassadors in International companies like TCS-India and SAP-Germany</li>
          <li>IT students have been granted projects under SSIP (Student Startup and Innovation Policy) by Government of Gujarat</li>
          <li>Consistently good academic records of students with gold medals as branch toppers at GTU</li>
        </ul> */}