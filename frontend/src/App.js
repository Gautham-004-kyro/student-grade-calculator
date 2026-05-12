import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Students from "./pages/Details";
import "./styles.css";
import Dashboard from "./pages/Dashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/home"
          element={<Home />}
        />
      <Route 
      path="/students"
       element={<Students />} />
      <Route 
      path="/dashboard" 
      element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;