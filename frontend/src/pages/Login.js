import { useState } from "react";

import { useNavigate } from "react-router-dom";



function Login() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();




  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");



    try {

      const res = await fetch(

        "https://student-grade-calculator-yu9q.onrender.com/api/login/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          credentials: "include",

          body: JSON.stringify({

            username,

            password,

          }),

        }
      );



      const text = await res.text();

      let data;



      try {

        data = JSON.parse(text);

      } catch {

        console.log(text);

        setError("Server returned invalid response");

        return;

      }



      if (res.ok) {

        localStorage.setItem("loggedIn", "true");

        navigate("/home");

      } else {

        setError(data.error || "Login failed");

      }

    } catch (err) {

      console.error(err);

      setError("Server not reachable");

    }

  };




  return (

    <div className="login-page">



      <div className="login-container">



        <h2 className="title">

          Welcome Back

        </h2>



        {error && (

          <p className="error">

            {error}

          </p>

        )}




        <form onSubmit={handleLogin}>



          <div className="input-group">

            <label>

              Username

            </label>

            <input
              type="text"

              placeholder="Enter Username"

              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

          </div>




          <div className="input-group">

            <label>

              Password

            </label>

            <input
              type="password"

              placeholder="Enter Password"

              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>




          <button
            type="submit"
            className="login-btn"
          >

            Login

          </button>




          <p style={{ marginTop: "18px" }}>

            Don't have an account?

            <span

              style={{

                color: "#00c6ff",

                cursor: "pointer",

                marginLeft: "6px",

                fontWeight: "600",

              }}

              onClick={() =>
                navigate("/register")
              }
            >

              Register

            </span>

          </p>

        </form>

      </div>

    </div>

  );
}

export default Login;