import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarClosed, setIsSidebarClosed] =