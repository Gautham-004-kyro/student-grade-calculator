import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Calculator from "./Calculator";



function Home() {

  const navigate = useNavigate();

  useEffect(() => {

    const loggedIn =
      localStorage.getItem("loggedIn");

    if (!loggedIn) {

      navigate("/");

    }

  }, [navigate]);



  const handleLogout = async () => {

    try {

      await fetch(
        "https://student-grade-calculator-yu9q.onrender.com/api/logout/",
        {
          method: "POST",

          credentials: "include",
        }
      );

      localStorage.removeItem("loggedIn");

      navigate("/");

    } catch (err) {

      console.log(err);

    }
  };



  return (

    <div className="page">

      {/* HERO SECTION */}

      <div className="hero-section">

        <h1 className="hero-title">

          Student Grade Calculator

        </h1>

      </div>



      {/* MAIN LAYOUT */}

      <div className="main-layout">

        {/* LEFT SIDE */}
        <Calculator />



        {/* RIGHT SIDE BUTTONS */}

        <div className="header-buttons">

          <button
            className="view-btn"
            onClick={() =>
              navigate("/students")
            }
          >

            View Details

          </button>



          <button
            className="dashboard-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            Dashboard

          </button>



          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            Logout

          </button>

          
        </div>

      </div>

    </div>

  );
}

export default Home;
