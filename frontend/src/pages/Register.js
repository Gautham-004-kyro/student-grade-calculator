import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {

  const [usernameMessage, setUsernameMessage] = useState("");

  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [error, setError] = useState("");


  const checkUsername = async (value) => {

  setUsername(value);



  if (value.length < 3) {

    setUsernameMessage("");

    return;

  }

  



  try {

    const res = await fetch(

      `https://student-grade-calculator-2e9a.onrender.com/api/check-username/${value}/`

    );



    const data = await res.json();



    if (data.exists) {

      setUsernameMessage(

        "Username already taken"

      );



      setUsernameAvailable(false);

    } else {

      setUsernameMessage(

        "Username available"

      );



      setUsernameAvailable(true);

    }
    

  } catch (err) {

    console.log(err);

  }

};

  // ✅ SEND OTP

  const sendOtp = async () => {

  setError("");



  if (!username.trim()) {

    toast.error("Enter username");

    return;

  }



  if (password !== confirmPassword) {

    setError("Passwords do not match");

    return;

  }



  try {

    // CHECK USERNAME AGAIN BEFORE OTP

    const checkRes = await fetch(

      `https://student-grade-calculator-2e9a.onrender.com/api/check-username/${username}/`

    );



    const checkData = await checkRes.json();



    if (checkData.exists) {

      toast.error(

        "Username already taken"

      );



      return;

    }



    // SEND OTP

    const res = await fetch(

      "https://student-grade-calculator-2e9a.onrender.com/api/send-otp/",

      {

        method: "POST",



        headers: {

          "Content-Type": "application/json",

        },



        body: JSON.stringify({

          email,

        }),

      }

    );



    const data = await res.json();



    if (res.ok) {

      toast.success(

        "OTP sent successfully!"

      );



      setOtpSent(true);

    } else {

      toast.error(

        data.error ||

        "Failed to send OTP"

      );

    }

  } catch (err) {

    console.log(err);



    toast.error(

      "Server not reachable"

    );

  }

};


  // ✅ VERIFY OTP + CREATE ACCOUNT

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");



    try {

      // VERIFY OTP

      const otpRes = await fetch(
        "https://student-grade-calculator-2e9a.onrender.com/api/verify-otp/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const otpData = await otpRes.json();



      if (!otpData.verified) {

        setError("Invalid OTP");

        return;
      }



      // CREATE ACCOUNT

      const registerRes = await fetch(
        "https://student-grade-calculator-2e9a.onrender.com/api/register/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const registerData = await registerRes.json();



      if (registerRes.ok) {
        toast.success("Account created successfully! Please login.");

        setShowPopup(true);

      } else {

        toast.error(registerData.error || "Registration failed!");

        setError(registerData.error);

      }

    } catch (err) {

      console.log(err);

      setError("Server not reachable");

    }
  };



  return (
<div className="register-page">
    <div className="register-container">

      <h2 className="title">
        Create an Account 
      </h2>



      {error && (
        <p className="error">
          {error}
        </p>
      )}



      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>checkUsername(e.target.value)}
          required
        />

        <p

  className={

    usernameAvailable

      ? "success-msg"

      : "error-msg"

  }

>

  {usernameMessage}

</p>



        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />



        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />



        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />



        {/* SEND OTP BUTTON */}

        {!otpSent && (

          <button
            type="button"
            onClick={sendOtp}
          >
            Send OTP
          </button>

        )}



        {/* OTP FIELD */}

        {otpSent && (

          <>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />



            <button type="submit">
              Verify OTP & Register
            </button>

          </>

        )}

      </form>



      <p
        style={{
          marginTop: "15px",
          color: "white",
        }}
      >

        Already have an account?

        <span
          style={{
            color: "#00c6ff",
            cursor: "pointer",
            marginLeft: "5px",
            fontWeight: "bold",
          }}

          onClick={() => navigate("/")}
        >
          Login
        </span>

      </p>



      {/* SUCCESS POPUP */}

      {showPopup && (

        <div className="popup-overlay">

          <div className="popup">

            <h3>
              Account Created Successfully 
            </h3>

            <button
              onClick={() => navigate("/")}
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
</div>
  );
}

export default Register;
