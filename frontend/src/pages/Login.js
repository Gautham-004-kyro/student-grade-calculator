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
  "http://localhost:8000/api/login/",
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

      const data = await res.json();

      if (res.ok) {
        if (res.ok) {
           localStorage.setItem("loggedIn", "true");
              navigate("/home");
        } 
      } else {
        setError(data.error || "Login failed");
      }

    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    }
  };

  return (
  <div className="container">
    <h2 className="title">Welcome  Back </h2>

    {error && <p className="error">{error}</p>}

    <form onSubmit={handleLogin}>
      <p style={{ fontWeight: "bold"}}> Username</p>
      <input placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
      <p style={{ fontWeight: "bold"}}> Password</p>
      <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
      <button style={{ backgroundColor: '#0e5e72' }}>Login</button>
      
      <p style={{ marginTop: "15px" }}>

  Don't have an account?

  <span
    style={{
      color: "#00c6ff",
      cursor: "pointer",
      marginLeft: "5px"
    }}

    onClick={() => navigate("/register")}
  >
    Register
  </span>

</p>
    </form>
  </div>
);
}

export default Login;