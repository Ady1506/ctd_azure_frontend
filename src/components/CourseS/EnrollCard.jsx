import React, { useState } from 'react';
import axios from 'axios';
import EnrollmentPeriodCard from './EnrollmentPeriodCard';
import { useNavigate } from 'react-router-dom';

const EnrollCard = ({ course, studentId, onEnrolled }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false); // Track enrollment status
  const navigate = useNavigate(); // Hook for navigation

  const handleEnroll = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/enrollments`,
        {
          student_id: studentId,     // Pass student ID
          course_id: course.id,      // Pass course ID
        },
        { withCredentials: true }
      );
      // Update state to reflect the successful enrollment
      if (response.status === 200) {
        setEnrolled(true); // Course successfully enrolled
        onEnrolled(); // Update parent component state if needed
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      alert('Could not enroll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollAndNavigate = async () => {
    await handleEnroll(); // Enroll the student
    if (!loading) {
      // Reload the page to reflect the enrollment status
      window.location.reload(); // Force the page reload
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-[100%] p-5 px-8">
      <div className="text-2xl font-semibold text-dblue">Enrollment</div>
      <div className="flex flex-col h-full justify-between mt-2">
        <EnrollmentPeriodCard course={course} />
        
        {enrolled ? (
          <div className="text-green-500 font-bold">You have successfully enrolled in this course!</div>
        ) : (
          <button
            onClick={handleEnrollAndNavigate} // Call the function that enrolls and reloads
            disabled={loading}
            className="bg-dblue text-white rounded-md flex justify-center p-2"
          >
            {loading ? 'Enrolling…' : 'Enroll'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnrollCard;
