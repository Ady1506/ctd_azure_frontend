// src/components/DashStudent.jsx
import React, { useEffect, useState } from 'react';
import DashStudentCard from './DashStudentCard.jsx'; // Import the new card
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashStudent = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [students, setStudents] = useState([]); // State for student data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      setStudents([]); // Reset students on new fetch

      try {
        // Fetch users with credentials included
        const response = await axios.get(`${backendUrl}/api/users`, {
          withCredentials: true,
        });

        // Filter for users with role 'student' and ensure data is an array
        if (Array.isArray(response.data)) {
          const filteredStudents = response.data.filter(user => user.role === 'student');
          setStudents(filteredStudents);
        } else {
          console.error('API did not return an array:', response.data);
          setError('Received invalid data format.');
          setStudents([]);
        }

      } catch (err) {
        console.error('Error fetching students:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Authentication failed.');
        } else {
          setError('Failed to load students.');
        }
        setStudents([]); // Clear students on error
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means fetch only on mount

  const handleViewAllClick = () => {
    navigate('/students'); // Navigate to the full students page
  };

  return (
    // Similar structure to DashAttendance
    <div className='h-full w-full flex flex-col gap-3 p-4  rounded-lg shadow'> {/* Added bg/shadow */}
      {/* Header */}
      <div className='flex justify-between w-full text-[#173061]'>
        <div className='font-bold text-lg cursor-default'>Students</div>
        <div
            className='underline cursor-pointer text-sm hover:text-blue-900' // Adjusted style
            onClick={handleViewAllClick}>
                View All
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-auto pr-2
                      [&::-webkit-scrollbar]:[width:4px]
                      [&::-webkit-scrollbar-thumb]:bg-[#173061]/70
                      [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col gap-2">
        {loading ? (
          <div className="flex justify-center items-center h-full text-gray-500">Loading...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-500">{error}</div>
        ) : students.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No students found.
          </div>
        ) : (
          // Map over the filtered student data
          students.map((student) => (
            <DashStudentCard key={student.id} student={student} /> // Use student.id as key
          ))
        )}
      </div>
    </div>
  );
};

export default DashStudent;