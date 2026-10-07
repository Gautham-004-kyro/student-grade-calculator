import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";


function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");


    const sendOTP = async () => {

        try {

            const response = await fetch(
                "/api/forgot-password/",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email:email
                    })
                }
            );


            const data = await response.json();


            if(data.success){

                setMessage(
                    "OTP sent to your email"
                );

                setStep(2);

            }
            else{

                setMessage(
                    data.message
                );
            }


        }
        catch(error){

            setMessage(
                "Something went wrong"
            );

        }

    };



    const verifyOTP = async()=>{


        const response = await fetch(
            "/api/verify-reset-otp/",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    email:email,
                    otp:otp

                })

            }
        );


        const data =
        await response.json();


        if(data.success){

            setMessage(
                "OTP verified"
            );

            setStep(3);

        }

        else{

            setMessage(
                "Invalid OTP"
            );

        }

    };



    const resetPassword = async()=>{


        if(password !== confirmPassword){

            setMessage(
                "Passwords do not match"
            );

            return;

        }



        const response = await fetch(

            "/api/reset-password/",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },


                body:JSON.stringify({

                    email:email,
                    password:password

                })

            }

        );



        const data =
        await response.json();



        if(data.success){

            alert(
                "Password changed successfully"
            );


            navigate("/");


        }

        else{

            setMessage(
                "Password reset failed"
            );

        }


    };



    return (

        <div className="auth-container">


            <div className="auth-box">


                <h2>
                    Forgot Password
                </h2>



                {
                    step === 1 &&

                    <>

                    <input

                    type="email"

                    placeholder="Enter registered email"

                    value={email}

                    onChange={
                        (e)=>
                        setEmail(e.target.value)
                    }

                    />


                    <button
                    onClick={sendOTP}
                    >
                        Send OTP
                    </button>


                    </>

                }





                {
                    step === 2 &&

                    <>

                    <input

                    type="text"

                    placeholder="Enter OTP"

                    value={otp}

                    onChange={
                        (e)=>
                        setOtp(e.target.value)
                    }

                    />


                    <button
                    onClick={verifyOTP}
                    >
                        Verify OTP
                    </button>


                    </>

                }





                {
                    step ===3 &&

                    <>


                    <input

                    type="password"

                    placeholder="New Password"

                    value={password}

                    onChange={
                        (e)=>
                        setPassword(e.target.value)
                    }

                    />


                    <input

                    type="password"

                    placeholder="Confirm Password"

                    value={confirmPassword}

                    onChange={
                        (e)=>
                        setConfirmPassword(e.target.value)
                    }

                    />


                    <button

                    onClick={resetPassword}

                    >

                        Reset Password

                    </button>



                    </>

                }



                <p>

                    {message}

                </p>



            </div>


        </div>


    );

}


export default ForgotPassword;