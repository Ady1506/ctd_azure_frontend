// src/pages/Students.jsx
import React, { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';    // Adjust path if needed
import StudentModal from '../components/StudentModal'; // Adjust path if needed

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${backendUrl}/api`;

const Students = () => {
  const [students, setStudents] = useState([]); // State to hold only student users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Users on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          // Try to get error message from response body
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg; // Use backend message if available
          } catch (jsonError) {
            // Ignore if response is not JSON
          }
          throw new Error(errorMsg);
        }
        const usersData = await response.json();

        // Filter for users with role 'student' immediately
        const studentUsers = usersData.filter(user => user.role && user.role.toLowerCase() === 'student');
        setStudents(studentUsers);

      } catch (e) {
        console.error("Failed to fetch students:", e);
        setError(`Failed to load student data. ${e.message || 'Please try again later.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means this runs once on mount

  // --- Modal Handling ---
  const handleCardClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected student slightly for smoother transition
    setTimeout(() => setSelectedStudent(null), 300); // Match animation duration
  };

  // --- Render Logic ---
  let content;
  if (loading) {
    content = <div className="flex justify-center items-center py-10"><p className="text-gray-500">Loading students...</p></div>;
  } else if (error) {
    content = <div className="flex justify-center items-center py-10 text-red-600"><p>{error}</p></div>;
  } else if (students.length === 0) {
    content = <div className="flex justify-center items-center py-10"><p className="text-gray-500">No students found.</p></div>;
  } else {
    content = (
        // Responsive grid layout for cards
        // justify-center on small screens, justify-start on larger screens
        <div className='student-list flex flex-row flex-wrap gap-4 justify-center sm:justify-start p-2 mt-4'>
            {students.map(student => (
            <StudentCard
                key={student.id} // Use the unique student ID
                student={student}
                onClick={handleCardClick}
            />
            ))}
      </div>
    );
  }


  return (
    // Original structure: flex-col, w-full. Using min-h-screen instead of h-screen for flexibility.
    // Keep padding p-4 md:p-10
    <div className='body flex flex-col w-full min-h-screen p-4 md:p-10 bg-gray-50'>
      <h1 className='text-dblue text-2xl md:text-3xl font-semibold mb-6'>Student Records</h1>

      {/* Render loading/error/content */}
      {content}

      {/* Render Modal - it will be positioned fixed, outside the normal flow */}
      <StudentModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Students;
// import React, { useState } from 'react';
// import StudentCard from '../components/StudentCard';

// const studentData = [
//     { id: 1, name: 'John Doe', rollNo: '123', batch: '2023', branch: 'CSE', course: 'B.Tech' },
//     { id: 2, name: 'Jane Smith', rollNo: '124', batch: '2023', branch: 'ECE', course: 'B.Tech' },
//     { id: 1, name: 'John Doe', rollNo: '123', batch: '2023', branch: 'CSE', course: 'B.Tech' },
//     { id: 2, name: 'Jane Smith', rollNo: '124', batch: '2023', branch: 'ECE', course: 'B.Tech' },
//     { id: 1, name: 'John Doe', rollNo: '123', batch: '2023', branch: 'CSE', course: 'B.Tech' },
//     { id: 2, name: 'Jane Smith', rollNo: '124', batch: '2023', branch: 'ECE', course: 'B.Tech' },
//     { id: 1, name: 'John Doe', rollNo: '123', batch: '2023', branch: 'CSE', course: 'B.Tech' },
//     { id: 2, name: 'Jane Smith', rollNo: '124', batch: '2023', branch: 'ECE', course: 'B.Tech' },
//     { id: 1, name: 'John Doe', rollNo: '123', batch: '2023', branch: 'CSE', course: 'B.Tech' },
//     { id: 2, name: 'Jane Smith', rollNo: '124', batch: '2023', branch: 'ECE', course: 'B.Tech' },
// ];

// const Students = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredStudents, setFilteredStudents] = useState(studentData);

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);
//     const filtered = studentData.filter(student =>
//       student.name.toLowerCase().includes(value) ||
//       student.rollNo.toLowerCase().includes(value) ||
//       student.batch.toLowerCase().includes(value) ||
//       student.branch.toLowerCase().includes(value) ||
//       student.course.toLowerCase().includes(value)
//     );
//     setFilteredStudents(filtered);
//   };

//   return (
//     <div className='body flex flex-col w-full h-[100vh] p-4 md:p-10'>
//       <h1 className='text-dblue text-2xl font-semibold'>Student Record</h1>
//       <input
//         type='text'
//         placeholder='Search by name, roll no, batch, branch, course'
//         value={searchTerm}
//         onChange={handleSearch}
//         className='mt-4 p-2 border border-gray-300 rounded'
//       />
//       <div className='student-list flex flex-row flex-wrap gap-2 p-2 mt-4 overflow-auto'>
//         {filteredStudents.map(student => (
//           <StudentCard key={student.id} student={student} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Students;
