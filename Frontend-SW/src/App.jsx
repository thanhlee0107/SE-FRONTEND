import { useState } from 'react'
import { LandingPage } from './Page/landingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from './Page/login'
import {HomePage} from './Page/HomePage'
import {ProtectedRoute} from './protectedRoute'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" 
      element={<ProtectedRoute>
        <HomePage/>
        </ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
