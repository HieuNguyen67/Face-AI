import React, { useState } from "react";
import axios from "axios";
import Home from "./page/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
