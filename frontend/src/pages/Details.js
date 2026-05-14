import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

function Students() {

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [students, setStudents] = useState([]);

  const [sortType, setSortType] = useState("");

  const [showEditPopup, setShowEditPopup] =
    useState(false);

  const [showDeletePopup, setShowDeletePopup] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

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
        "https://student-grade-calculator-2e9a.onrender.com/api/students/"
      );

      const data = await res.json();

      setStudents(data);

    } catch (err) {

      toast.error("Something went wrong!");

      console.log(err);

    }
  };




  const handleDelete = async (id) => {

    try {

      await fetch(
        `https://student-grade-calculator-2e9a.onrender.com/api/delete-student/${id}/`,
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
      toast.error("Failed to delete student!");

      console.log(err);

    }
  };



  const deleteStudent = async () => {

    await handleDelete(deleteId);

    setShowDeletePopup(false);

    setDeleteId(null);

    toast.success("Student deleted successfully!");
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

    const filteredStudents = students.filter(

  (student) =>

    student.name

      .toLowerCase()

      .includes(search.toLowerCase()) ||

    student.grade

      .toLowerCase()

      .includes(search.toLowerCase()) ||

    student.status

      .toLowerCase()

      .includes(search.toLowerCase())

);


  const rankedStudents = [...filteredStudents]

    .sort((a, b) =>
      b.percentage - a.percentage
    )

    .map((student, index) => ({

      ...student,

      rank: index + 1,

    }));



  const sortedStudents = [...rankedStudents]

    .sort((a, b) => {

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




  const updateStudent = async () => {

    try {

      const res = await fetch(

        `https://student-grade-calculator-2e9a.onrender.com/api/update-student/${editData.id}/`,

        {

          method: "PUT",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            ...editData,

            subject1: Number(editData.subject1),

            subject2: Number(editData.subject2),

            subject3: Number(editData.subject3),

            subject4: Number(editData.subject4),

            subject5: Number(editData.subject5),

          }),

        }

      );



      const data = await res.json();



      if (res.ok) {

        toast.success("Student details updated successfully!");

        await fetchStudents();

        setShowEditPopup(false);

      } else {
        toast.error(data.error || "Failed to update student details!");
        console.log(data.error);

      }

    } catch (err) {

      toast.error("Server not reachable!");

      console.log(err);

    }

  };




  const exportToExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        students
      );



    const workbook =
      XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Students"

    );



    const range =
      XLSX.utils.decode_range(
        worksheet["!ref"]
      );



    for (

      let row = range.s.r;

      row <= range.e.r;

      row++

    ) {

      for (

        let col = range.s.c;

        col <= range.e.c;

        col++

      ) {

        const cellAddress =
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          });



        if (!worksheet[cellAddress]) {

          continue;

        }



        worksheet[cellAddress].s = {

          alignment: {

            horizontal: "center",

            vertical: "center",

          },

        };

      }
    }



    const excelBuffer =
      XLSX.write(

        workbook,

        {

          bookType: "xlsx",

          type: "array",

          cellStyles: true,

        }

      );



    const data = new Blob(

      [excelBuffer],

      {

        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",

      }

    );



    saveAs(

      data,

      "students.xlsx"

    );
  };



  return (

    <div className="table-container">

      <h1 className="details-title">

        Students Details

      </h1>



      <div className="table-top-bar">

        <button

          className="excel-btn"

          onClick={exportToExcel}
        >

          Download Excel

        </button>



        <select

          value={sortType}

          onChange={(e) =>
            setSortType(e.target.value)
          }

          className="sort-select"
        >

          <option value="">
            Sort By
          </option>

          <option value="name">
            Name
          </option>

          <option value="highest">
            Highest %
          </option>

          <option value="lowest">
            Lowest %
          </option>

          <option value="grade">
            Grade
          </option>

        </select>

      </div>

      <input

          type="text"

          placeholder="Search student..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          className="search-input"

        />


      <table>

        <thead>

          <tr>

            <th>Rank</th>

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

            <tr
              key={student.id}

              className={
                student.rank === 1
                  ? "topper-row"
                  : ""
              }
            >

              <td>

                #{student.rank}

              </td>

              <td>{student.name}</td>

              <td>{student.total}</td>

              <td>
                {student.percentage}%
              </td>

              <td>{student.grade}</td>

              <td>{student.status}</td>




              <td>

                <button
                  className="edit-btn"

                  onClick={() => {

                    setEditData(student);

                    setShowEditPopup(true);

                  }}
                >

                  Edit Details

                </button>

              </td>




              <td>

                <button
                  className="pdf-btn"

                  onClick={() =>
                    downloadPDF(student)
                  }
                >

                  Download PDF

                </button>

              </td>




              <td>

                <button
                  className="delete-btn"

                  onClick={() => {

                    setDeleteId(student.id);

                    setShowDeletePopup(true);

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




      {showDeletePopup && (

        <div className="popup-overlay">

          <div className="popup">

            <h3>
              Delete this student?
            </h3>

            <div className="popup-buttons">

              <button
                className="cancel-btn"

                onClick={() =>
                  setShowDeletePopup(false)
                }
              >

                Cancel

              </button>




              <button
                className="confirm-delete-btn"

                onClick={deleteStudent}
              >

                Delete

              </button>

            </div>

          </div>

        </div>

      )}




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