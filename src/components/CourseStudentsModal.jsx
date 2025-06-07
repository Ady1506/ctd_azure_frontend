// src/components/CourseStudentsModal.jsx
import React, { useState, useEffect } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API_BASE_URL = `${backendUrl}/api`;

const CourseStudentsModal = ({ courseId, courseName, isOpen, onClose }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && courseId) {
      const fetchStudents = async () => {
        setIsLoading(true);
        setError(null);
        setStudentsData([]);

        try {
          const apiUrl = `${API_BASE_URL}/admin/course-students?course_id=${courseId}`;
          const response = await fetch(apiUrl, {
            credentials: 'include',
          });

          if (!response.ok) {
             if (response.status === 401 || response.status === 403) {
                throw new Error('Authentication failed. Please log in again.');
             }
            let errorMsg = `Failed to fetch students: ${response.status}`;
             try {
                 const errData = await response.json();
                 errorMsg = errData.detail || errData.message || errorMsg;
             } catch (e) { /* Ignore if response is not JSON */ }
            throw new Error(errorMsg);
          }

          const data = await response.json();
          setStudentsData(Array.isArray(data) ? data : []);

        } catch (err) {
          console.error("Failed to fetch course students:", err);
          setError(err.message || 'Failed to load student details.');
          setStudentsData([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudents();
    } else {
      setStudentsData([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  // Assuming the API returns an array of objects like:
  // { student_id: "...", display_name: "...", attendance_rate: 85.5 }
  // Adjust 'display_name' and 'attendance_rate' keys if your API uses different names.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col z-70 transform transition-transform duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Students in {courseName || 'Course'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none" aria-label="Close modal">×</button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading && <div className="text-center p-4">Loading students...</div>}
          {error && <div className="text-center p-4 text-red-600">Error: {error}</div>}

          {!isLoading && !error && (
            <>
              {studentsData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentsData.map((student, index) => (
                        <tr key={student.student_id || index}> {/* Use index as fallback key */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.student_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {/* Adjust formatting as needed */}
                            {typeof student.attendance_rate === 'number' ? `${student.attendance_rate.toFixed(2)}%` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-4 text-gray-600">No students found for this course.</div>
              )}
            </>
          )}
        </div>

        <div className="border-t pt-4 mt-4 text-right flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 text-sm"
          >
            Close
          </button>
        </div>
        <style jsx global>{`
            @keyframes modal-appear { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-modal-appear { animation: modal-appear 0.3s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default CourseStudentsModal;