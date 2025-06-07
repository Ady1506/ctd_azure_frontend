import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashCourseCard from '../DashS/DashCourseCard';

const CourseList = ({ selectedTab, searchTerm }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const itemsPerPage = 8;
  const [allCourses, setAllCourses] = useState([]);
  const [yourCourses, setYourCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const allCoursesPromise = axios.get(`${backendUrl}/api/courses`);
        
        const enrolledCoursesPromise = axios.get(`${backendUrl}/api/enrollments/courses`);

        const [allResponse, enrolledResponse] = await Promise.all([allCoursesPromise, enrolledCoursesPromise]);

        setAllCourses(allResponse.data || []);
        setYourCourses(enrolledResponse.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setAllCourses([]);
        setYourCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const source = selectedTab === 'all' ? allCourses : yourCourses;
    const filtered = source.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [selectedTab, searchTerm, allCourses, yourCourses]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const visible = filteredCourses.slice(start, start + itemsPerPage);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="col-span-full h-full flex items-center justify-center text-center text-gray-500 font-bold">
          Loading...
        </div>
      );
    }

    if (visible.length === 0) {
      const message = selectedTab === 'your' ? "No courses enrolled" : "No courses available";
      return (
        <div className="col-span-full h-full flex items-center justify-center text-center text-gray-500 font-bold">
          {searchTerm ? "No courses found" : message}
        </div>
      );
    }

    return (
      <>
        {visible.map((course) => (
          <div key={course.id || course._id} className="p-2">
            <DashCourseCard course={course} />
          </div>
        ))}
        {Array.from({ length: itemsPerPage - visible.length }).map((_, i) => (
          <div key={`placeholder-${i}`} className="invisible p-2" />
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col flex-grow px-10 py-5 justify-between">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 min-h-[300px]">
        {renderContent()}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 text-lg">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 rounded ${
                currentPage === i + 1 ? 'text-black font-semibold' : 'text-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;