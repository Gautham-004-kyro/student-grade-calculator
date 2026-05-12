import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//import logo from "../assets/Logo.jpg";


import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,

} from "recharts";



function Dashboard() {

  const navigate = useNavigate();
  const [students, setStudents] = useState([]);




  useEffect(() => {

    fetch(
      "http://localhost:8000/api/students/"
    )

      .then((res) => res.json())

      .then((data) => setStudents(data))

      .catch((err) => console.log(err));

  }, []);




  const topStudents = [...students]

    .sort(
      (a, b) =>
        b.percentage - a.percentage
    )

    .slice(0, 5);




  const gradeData = [

    {
      name: "A",
      value:
        students.filter(
          (s) => s.grade === "A"
        ).length,
    },

    {
      name: "B",
      value:
        students.filter(
          (s) => s.grade === "B"
        ).length,
    },

    {
      name: "C",
      value:
        students.filter(
          (s) => s.grade === "C"
        ).length,
    },

    {
      name: "D",
      value:
        students.filter(
          (s) => s.grade === "D"
        ).length,
    },

    {
      name: "F",
      value:
        students.filter(
          (s) => s.grade === "F"
        ).length,
    },

  ];




  const COLORS = [

    "#00c6ff",
    "#0072ff",
    "#00ff99",
    "#ffaa00",
    "#ff4d4d",

  ];




  return (

    <div className="dashboard-page">



      {/* HEADER */}

      <header className="top-header">

        <div className="logo-section">

        

          <span>

            Student Result Management

          </span>

        </div>



        <div className="header-title">

          Analytics Dashboard

        </div>



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
              navigate("/home")
            }
          >

            Home

          </button>



          <button
            className="logout-btn"
            onClick={() =>
              navigate("/")
            }

          > 
         
            Logout

          </button>

        </div>

      </header>




      {/* TITLE */}

      <div className="hero-section">

        

        <h1 className="hero-title">

          Analytics Dashboard

        </h1>

        <p className="hero-subtitle">

          Student Performance Analytics

        </p>

      </div>




      {/* STATS */}

      <div className="stats-grid">



        <div className="stat-card">

          <h2>

            {students.length}

          </h2>

          <p>

            Total Students

          </p>

        </div>




        <div className="stat-card">

          <h2>

            {

              students.filter(
                (s) =>
                  s.status === "Pass"
              ).length

            }

          </h2>

          <p>

            Passed Students

          </p>

        </div>




        <div className="stat-card">

          <h2>

            {

              students.filter(
                (s) =>
                  s.status === "Fail"
              ).length

            }

          </h2>

          <p>

            Failed Students

          </p>

        </div>

      </div>




      {/* CHARTS */}

      <div className="chart-container">



        {/* BAR CHART */}

        <div className="chart-box">

          <h2>

            Top Students

          </h2>



          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={topStudents}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="percentage"
                fill="#00c6ff"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>




        {/* PIE CHART */}

        <div className="chart-box">

          <h2>

            Grade Distribution

          </h2>



          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={gradeData}

                dataKey="value"

                outerRadius={100}

                label
              >

                {gradeData.map(
                  (entry, index) => (

                    <Cell
                      key={index}

                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;