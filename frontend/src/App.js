import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailsPage from "./pages/GroupDetailsPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} /><Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
