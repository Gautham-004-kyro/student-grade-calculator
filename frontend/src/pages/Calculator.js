import { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

function Calculator() {

  const resultRef = useRef();

  const [name, setName] = useState("");

  const [marks, setMarks] = useState([0, 0, 0, 0, 0]);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

  const interval = setInterval(

    async () => {

      try {

        const res = await fetch(

          "https://student-grade-calculator-yu9q.onrender.com/api/check-auth/",

          {

            credentials: "include",

          }

        );



        const data = await res.json();



        if (!data.authenticated) {

          toast.error(

            "Session expired"

          );



          navigate("/");

        }

      } catch (err) {

        console.log(err);

      }

    },

    5000

  );



  return () => clearInterval(interval);

}, [navigate]);



  const subjects = [
    "Maths",
    "Physics",
    "Chemistry",
    "English",
    "Computer"
  ];



  const handleChange = (index, value) => {

    const newMarks = [...marks];

    newMarks[index] = Number(value);

    setMarks(newMarks);
  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const res = await fetch(
        "https://student-grade-calculator-2e9a.onrender.com/api/calculate/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            marks: marks,
          }),
        }
      );



      const data = await res.json();



      if (res.ok) {
        
        toast.success("Result calculated successfully!");

        setResult(data);

      } else {

        toast.error(data.error || "Failed to calculate result!");

        setError(data.error || "Something went wrong");
      }

    } catch (err) {

      toast.error("Server not reachable!");

      console.error(err);

      setError("Server not reachable");
    }
  };



  const downloadPDF = async () => {

    const element = resultRef.current;

    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/png");



    const pdf = new jsPDF();

    const imgProperties =
      pdf.getImageProperties(data);

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (imgProperties.height * pdfWidth) /
      imgProperties.width;



    pdf.addImage(
      data,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );



    pdf.save("student-result.pdf");
  };



  return (

    <div className="container">

      <h2 className="title">
        Enter Student Details
      </h2>



      <form onSubmit={handleSubmit}>

        <div className="input-group">

          <label>
            Student Name
          </label>

          <input
            placeholder="Enter Student Name"
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        </div>



        <h2 className="marks-title">
          Enter Marks
        </h2>



        <div className="marks-grid">

          {subjects.map((subject, i) => (

            <div
              key={i}
              className="input-group"
            >

              <label className="label">
                {subject}
              </label>



              <input
                placeholder={`Enter ${subject} marks`}
                type="number"
                onChange={(e) =>
                  handleChange(i, e.target.value)
                }
              />

            </div>

          ))}

        </div>



        <button
          type="submit"
          className="calculate-btn"
        >

          Calculate

        </button>

      </form>



      {error && (

        <p className="error">

          {error}

        </p>

      )}



      {result && (

        <div className="popup-overlay">

          <div
            className="popup result"
            ref={resultRef}
          >

            <h3>{result.name}</h3>

            <p>Total: {result.total}</p>

            <p>
              Percentage: {result.percentage}%
            </p>

            <p>Grade: {result.grade}</p>

            <p>Status: {result.status}</p>

            <button
              className="pdf-btn"
              onClick={downloadPDF}
            >
              Download PDF
            </button>

            <button
              className="cancel-btn"
              onClick={() => setResult(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Calculator;