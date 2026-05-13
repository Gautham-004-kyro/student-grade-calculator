import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";



function Calculator() {


  const resultRef = useRef();

  const [name, setName] = useState("");

  const [marks, setMarks] = useState([0, 0, 0, 0, 0]);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");



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
        "https://student-grade-calculator-yu9q.onrender.com/api/calculate/",
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

        setResult(data);

      } else {

        setError(data.error || "Something went wrong");
      }

    } catch (err) {

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
        <div
          className="result"
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
        </div>
      )}


      

    </div>
  );
}

export default Calculator;



      
