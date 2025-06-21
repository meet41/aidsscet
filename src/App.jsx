import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { app, storage } from './firebase';
import { listAll, getDownloadURL, ref as storageRef } from 'firebase/storage';
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AboutUs from "./components/AboutUs";
import Message from "./components/Message";
import Vision from "./components/Vision";
import Mission from "./components/Mission";
import AddAthletics from "./components/AddAthletics";
import Others from "./components/Others";
import Athletics from "./components/Athletics";
import Po from "./components/Po";
import Pso from "./components/Pso";
import Peo from "./components/Peo";
import AddResult from "./components/AddResult";
import Result from "./components/Result";
import AddConverse from "./components/AddConverse";
import Converse from "./components/Converse";
import AddSyllabus from "./components/AddSyllabus";
import AddAnalysis from "./components/AddAnalysis";
import ShowAnalysis from "./components/ShowAnalysis";
import ImageUploader from "./components/ImageUploader";
import AddCalender from "./components/AddCalender";
import UpdateStudInfo from "./components/UpdateStudInfo";
import Scholar from "./components/Scholar";
import Iep from "./components/Iep";
import Ind from "./components/Ind";
import ShowInds from "./components/ShowInds";
import Alumini from "./components/Alumini";
import ShowAlumini from "./components/ShowAlumini";
import StudInfo from "./components/StudInfo";
import ShowStudInfo from "./components/ShowStudInfo";
import AddClassTimetable from "./components/AddClassTimeTable";
import ShowClassTimetable from "./components/ShowClassTimeTable";
import ImageDelete from "./components/ImageDelete";
import OthersDelete from "./components/OthersDelete";
import UpdateAbout from "./components/UpdateAbout";
import Library from "./components/Library";
import DeleteLibrary from "./components/DeleteLibrary";
import Tnp from "./components/Tnp";
import DeleteTnp from "./components/DeleteTnp";
import DeleteAbout from "./components/DeleteAbout";
import Book from "./components/Book";
import AddBook from "./components/AddBook";
import UpdateBook from "./components/UpdateBook";
import AddCd from "./components/AddCd";
import Cd from "./components/Cd";
import UpdateCd from "./components/UpdateCd";
import UpdateResult from "./components/UpdateResult";
import UpdateSyllabus from "./components/UpdateSyllabus";
import UpdateAnalysis from "./components/UpdateAnalysis";
import UpdateClassTimetable from "./components/UpdateClassTimeTable";
import UpdateTnpData from "./components/UpdateTnpData";
import AddTnp from "./components/AddTnp";
import TnpData from "./components/TnpData";
import ShowCalendar from "./components/ShowCalender";
import UpdateCalendar from "./components/UpdateCalender";
import UpdateConverse from "./components/UpdateConverse";
import UpdateInd from "./components/UpdateInd";
import UpdateAthletics from "./components/UpdateAthletics";
import "./App.css"; // Ensure this CSS file is correctly linked
import axios from 'axios';
import Syllabus from "./components/Syllabus";

// Utility function to fetch image URLs from Firebase Storage
const fetchImageUrls = async () => {
  const storageReference = storageRef(storage, 'images/');
  const result = await listAll(storageReference);
  const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
  return Promise.all(urlPromises);
};

// Image Slider component
function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urls = await fetchImageUrls();
        setImages(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (isLoading) {
    return <div className="slider-spinner">Loading images...</div>;
  }

  return (
    <div className="slider">
      {images.map((image, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active" : ""}`}
        >
          <img src={image} className="home-img" alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}

// Main App component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This state is not directly used here but kept for context if needed elsewhere

  // Authentication state listener (remains important for Firebase integration)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set isLoggedIn based on user presence
    });
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  return (
    <div className="App">
      <div className="header-container">
        <Header />
      </div>
      <Navbar />
      {/* This new 'main-content-area' wraps the dynamic content */}
      <div className="main-content-area">
        <div className="content">
          <Routes>
            <Route path="/" element={<Slider />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/updateabout" element={<UpdateAbout />} />
            <Route path="/addcd" element={<AddCd />} />
            <Route path="/viewcd" element={<Cd />} />
            <Route path="/updatecd/:id" element={<UpdateCd />} />
            <Route path="/updateresult/:id" element={<UpdateResult />} />
            <Route path="/updatebook/:id" element={<UpdateBook />} />
            <Route path="/deleteabout" element={<DeleteAbout />} />
            <Route path="/Message" element={<Message />} />
            <Route path="/Vision" element={<Vision />} />
            <Route path="/Mission" element={<Mission />} />
            <Route path="/Peo" element={<Peo />} />
            <Route path="/Po" element={<Po />} />
            <Route path="/Pso" element={<Pso />} />
            <Route path="/viewbook" element={<Book />} />
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/updatesyllabus/:id" element={<UpdateSyllabus />} />
            <Route path="/updateresult/:id" element={<UpdateResult />} />
            <Route path="/addcalender" element={<AddCalender />} />
            <Route path="/showcalender" element={<ShowCalendar />} />
            <Route path="/updatecalendar/:id" element={<UpdateCalendar />} />
            <Route path="/addtable" element={<AddClassTimetable />} />
            <Route path="/showtable" element={<ShowClassTimetable />} />
            <Route path="/updateclasstimetable/:id" element={<UpdateClassTimetable />} />
            <Route path="/scholar" element={<Scholar />} />
            <Route path="/alumini" element={<Alumini />} />
            <Route path="/tnp" element={<Tnp />} />
            <Route path="/addtnp" element={<AddTnp />} />
            <Route path="/viewtnp" element={<TnpData />} />
            <Route path="/updateind/:id" element={<UpdateInd />} />
            <Route path="/updatetnpdata/:id" element={<UpdateTnpData />} />
            <Route path="/deletetnp" element={<DeleteTnp />} />
            <Route path="/updatelibrary" element={<Library />} />
            <Route path="/deletelibrary" element={<DeleteLibrary />} />
            <Route path="/iep" element={<Iep />} />
            <Route path="/others" element={<Others />} />
            <Route path="/othersdelete" element={<OthersDelete />} />
            <Route path="/showalumini" element={<ShowAlumini />} />
            <Route path="/addind" element={<Ind />} />
            <Route path="/showind" element={<ShowInds />} />
            <Route path="/addsyllabus" element={<AddSyllabus />} />
            <Route path="/addresults" element={<AddResult />} />
            <Route path="/results" element={<Result />} />
            <Route path="/studinfo" element={<StudInfo />} />
            <Route path="/updatestudinfo/:id" element={<UpdateStudInfo />} />
            <Route path="/addathletics" element={<AddAthletics />} />
            <Route path="/showathletics" element={<Athletics />} />
            <Route path="/updateathletics/:id" element={<UpdateAthletics />} />
            <Route path="/showstud" element={<ShowStudInfo />} />
            <Route path="/addanalysis" element={<AddAnalysis />} />
            <Route path="/showanalysis" element={<ShowAnalysis />} />
            <Route path="/updateanalysis/:id" element={<UpdateAnalysis />} />
            <Route path="/addconverse" element={<AddConverse />} />
            <Route path="/converse" element={<Converse />} />
            <Route path="/updateconverse/:id" element={<UpdateConverse />} />
            <Route path="/imageupload" element={<ImageUploader />} />
            <Route path="/imagedelete" element={<ImageDelete />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
