// src/components/EnrolledCoursesModal.jsx
import React, { useState, useEffect } from 'react';

const EnrolledCoursesModal = ({ studentId, isOpen, onClose }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [coursesData, setCoursesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("EnrolledCoursesModal - studentId:", studentId); // For debugging
  useEffect(() => {
    // Only fetch if the modal is open and we have a studentId
    if (isOpen && studentId) {
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);
            setCoursesData([]);
    
            try {
              const apiUrl = `${backendUrl}/api/admin/student-details?student_id=${studentId}`;
              const response = await fetch(apiUrl, {
                credentials: 'include' // Add this line
              });
    
              if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    throw new Error('Authentication failed. Please log in again.');
                 }
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const data = await response.json();
              setCoursesData(Array.isArray(data) ? data : []);
    
            } catch (err) {
              console.error("Failed to fetch courses:", err);
              setError(err.message || 'Failed to load course details.');
              setCoursesData([]);
            } finally {
              setIsLoading(false);
            }
          };

      fetchCourses();
    } else {
      // Reset state if modal is closed or studentId is missing
      setCoursesData([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, studentId]); // Re-run effect if isOpen or studentId changes

  // Calculate totals and average
  const totalCourses = coursesData.length;
  const averageAttendanceRate = totalCourses > 0
    ? (coursesData.reduce((sum, course) => sum + (course.attendance_rate || 0), 0) / totalCourses).toFixed(2) // Calculate average, handle null/undefined rates, format to 2 decimals
    : 0;

  // Don't render anything if the modal isn't open
  if (!isOpen) return null;

  return (
    // Overlay - higher z-index than the first modal
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      {/* Modal Content */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto z-70 transform transition-transform duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-dblue">Enrolled Courses</h2>
          <button
            onClick={onClose}
            className="text-dblue hover:text-blue-900 text-2xl font-bold leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        {isLoading && <div className="text-center p-4">Loading courses...</div>}
        {error && <div className="text-center p-4 text-red-600">Error: {error}</div>}

        {!isLoading && !error && (
          <>
            {/* Courses List Table */}
            {coursesData.length > 0 ? (
              <div className="mb-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dblue text-bold uppercase tracking-wider">
                        Course Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dblue text-bold uppercase tracking-wider">
                        Attendance Rate (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coursesData.map((course) => (
                      <tr key={course.course_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dblue">
                          {course.course_name || 'N/A'} {/* Handle empty names */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dblue">
                          {(course.attendance_rate || 0).toFixed(2)}% {/* Handle null/undefined rates, format */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 text-gray-600">No courses enrolled.</div>
            )}

            {/* Summary Section */}
            <div className="border-t pt-4 mt-4 text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-dblue text-bold">Total Courses Enrolled:</span>
                <span className='text-dblue text-bold'>{totalCourses}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-dblue text-bold">Average Attendance Rate:</span>
                <span className='text-dblue text-bold'>{averageAttendanceRate}%</span>
              </div>
            </div>
          </>
        )}

        {/* Bottom Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 text-sm"
          >
            Close
          </button>
        </div>
      </div>
      {/* Re-use animation style if needed, ensure it's defined globally or imported */}
      <style jsx global>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EnrolledCoursesModal;