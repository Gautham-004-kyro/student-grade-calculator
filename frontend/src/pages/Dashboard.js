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
      "https://student-grade-calculator-2e9a.onrender.com/api/students/"
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

  const totalStudents =
  students.length;



const averagePercentage =

  students.length > 0

    ? (

        students.reduce(

          (sum, student) =>

            sum + student.percentage,

          0

        ) / students.length

      ).toFixed(2)

    : 0;



const passCount =

  students.filter(

    (student) =>

      student.status === "Pass"

  ).length;



const failCount =

  students.filter(

    (student) =>

      student.status === "Fail"

  ).length;



const topper =

  students.reduce(

    (top, student) =>

      student.percentage >

      top.percentage

        ? student

        : top,

    students[0] || {}

  );




  return (

    <div className="dashboard-page">



      {/* HEADER */}

      <header className="top-header">

      



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


      <div className="analytics-grid">



  <div className="analytics-card">

    <h3>Total Students</h3>

    <p>{totalStudents}</p>

  </div>



  <div className="analytics-card">

    <h3>Average %</h3>

    <p>{averagePercentage}%</p>

  </div>



  <div className="analytics-card">

    <h3>Pass Students</h3>

    <p>{passCount}</p>

  </div>



  <div className="analytics-card">

    <h3>Fail Students</h3>

    <p>{failCount}</p>

  </div>



  <div className="analytics-card">

    <h3>Topper</h3>

    <p>{topper.name}</p>

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
