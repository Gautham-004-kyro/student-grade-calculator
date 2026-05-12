import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";

function Students() {

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [students, setStudents] = useState([]);

  const [sortType, setSortType] = useState("");

  const navigate = useNavigate();

  const [showEditPopup, setShowEditPopup] = useState(false);

  const [editData, setEditData] = useState({

  id: "",

  name: "",

  subject1: "",

  subject2: "",

  subject3: "",

  subject4: "",

  subject5: "",

});



  useEffect(() => {

    fetchStudents();

  }, []);




  const fetchStudents = async () => {

    try {

      const res = await fetch(
        "https://student-grade-calculator-yu9q.onrender.com/api/students/"
      );

      const data = await res.json();

      setStudents(data);

    } catch (err) {

      console.log(err);

    }
  };




    const handleDelete = async (id) => {

  try {

    await fetch(

      `https://student-grade-calculator-yu9q.onrender.com/api/delete-student/${id}/`,

      {
        method: "DELETE",
      }
    );



    setStudents(

      students.filter(
        (student) => student.id !== id
      )
    );

  } catch (err) {

    console.log(err);

  }
};




  const downloadPDF = (student) => {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("Student Result", 20, 20);

    doc.setFontSize(14);

    doc.text(
      `Name: ${student.name}`,
      20,
      40
    );

    doc.text(
      `Total: ${student.total}`,
      20,
      55
    );

    doc.text(
      `Percentage: ${student.percentage}%`,
      20,
      70
    );

    doc.text(
      `Grade: ${student.grade}`,
      20,
      85
    );

    doc.text(
      `Status: ${student.status}`,
      20,
      100
    );

    doc.save(`${student.name}-result.pdf`);
  };

  const sortedStudents = [...students].sort((a, b) => {
    const indexOfLastStudent =
  currentPage * studentsPerPage;

const indexOfFirstStudent =
  indexOfLastStudent - studentsPerPage;

const currentStudents =
  sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

const totalPages = Math.ceil(
  sortedStudents.length / studentsPerPage
);

  if (sortType === "name") {

    return a.name.localeCompare(b.name);

  }

  if (sortType === "highest") {

    return b.percentage - a.percentage;

  }

  if (sortType === "lowest") {

    return a.percentage - b.percentage;

  }

  if (sortType === "grade") {

    return a.grade.localeCompare(b.grade);

  }

  return 0;
});

const updateStudent = async () => {

  try {

    await fetch(

      `https://student-grade-calculator-yu9q.onrender.com/api/update-student/${editData.id}/`,

      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(editData),
      }
    );



    setStudents(

      students.map((student) =>

        student.id === editData.id

          ? editData

          : student
      )
    );



    setShowEditPopup(false);

  } catch (err) {

    console.log(err);

  }
};



  return (

    <div className="table-container">

      <h1 className="title">

        Student Details

      </h1>

      <div className="sort-box">

  <select
    value={sortType}
    onChange={(e) =>
      setSortType(e.target.value)
    }
  >

    <option value="">
      Sort By
    </option>

    <option value="name">
      Name
    </option>

    <option value="highest">
      Highest Percentage
    </option>

    <option value="lowest">
      Lowest Percentage
    </option>

    <option value="grade">
      Grade
    </option>

  </select>

</div>



      <table>

        <thead>

          <tr>

            <th>Name</th>

            <th>Total</th>

            <th>Percentage</th>

            <th>Grade</th>

            <th>Status</th>

            <th>Edit</th>

            <th>PDF</th>

            <th>Delete</th>

          </tr>

        </thead>



        <tbody>

          {currentStudents.map((student) => (

            <tr key={student.id}>

              <td>{student.name}</td>

              <td>{student.total}</td>

              <td>
                {student.percentage}%
              </td>

              <td>{student.grade}</td>

              <td>{student.status}</td>



              {/* EDIT BUTTON */}

                <td>

                      <button
                        className="edit-btn"

                        onClick={() => {

                          setEditData(student);

                          setShowEditPopup(true);

                        }}
                      >

                        Edit

                      </button>

                </td>


              {/* PDF BUTTON */}

              <td>

                <button
                  className="pdf-btn"
                  onClick={() =>
                    downloadPDF(student)
                  }
                >

                  PDF

                </button>

              </td>



              {/* DELETE BUTTON */}

              <td>

                <button
                  className="delete-btn"
                        onClick={() => {

                          const confirmDelete =
                            window.confirm(
                              "Are you sure you want to delete this student?"
                            );



                          if (confirmDelete) {

                            handleDelete(student.id);

                          }

                        }}
                >

                  Delete

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="pagination">

  <button

    disabled={currentPage === 1}

    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
  >

    Prev

  </button>



  <span>

    Page {currentPage} of {totalPages}

  </span>



  <button

    disabled={currentPage === totalPages}

    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
  >

    Next

  </button>

</div>

        {showEditPopup && (

  <div className="popup-overlay">

    <div className="popup">

      <h2>Edit Student</h2>

      <input
        type="text"

        value={editData.name}

        onChange={(e) =>
          setEditData({
            ...editData,
            name: e.target.value
          })
        }
      />

      <input
        type="number"

        value={editData.subject1}

        onChange={(e) =>
          setEditData({
            ...editData,
            subject1: e.target.value
          })
        }
      />

      <input
        type="number"

        value={editData.subject2}

        onChange={(e) =>
          setEditData({
            ...editData,
            subject2: e.target.value
          })
        }
      />

      <input
        type="number"

        value={editData.subject3}

        onChange={(e) =>
          setEditData({
            ...editData,
            subject3: e.target.value
          })
        }
      />

      <input
        type="number"

        value={editData.subject4}

        onChange={(e) =>
          setEditData({
            ...editData,
            subject4: e.target.value
          })
        }
      />

      <input
        type="number"

        value={editData.subject5}

        onChange={(e) =>
          setEditData({
            ...editData,
            subject5: e.target.value
          })
        }
      />

      <button
        className="save-btn"

        onClick={updateStudent}
      >

        Save

      </button>

      <button
        className="cancel-btn"

        onClick={() =>
          setShowEditPopup(false)
        }
      >

        Cancel

      </button>

    </div>

  </div>

)}
    </div>

  );
}

export default Students;
