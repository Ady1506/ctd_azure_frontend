// src/pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCardAdmin.jsx';
import CourseDetailModal from '../components/CourseDetailModal';
import CreateCourseModal from '../components/CreateCourseModal.jsx';
import CourseArchiveDetailModal from '../components/CourseArchiveDetailModal';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API_BASE_URL = `${backendUrl}/api`;

const Forms = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isArchiveDetailModalOpen, setIsArchiveDetailModalOpen] = useState(false);

    // --- Updated fetchCourses (always includes credentials) ---
    const fetchCourses = async (tab) => {
        setLoading(true);
        setError(null);
        setCourses([]);

        const url = tab === 'active'
           ? `${API_BASE_URL}/courses`
           : `${API_BASE_URL}/courses/archived`;

        console.log(`Fetching courses from: ${url} (Tab: ${tab})`);

        const fetchOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'include' // Always send credentials
        };

        try {
            const response = await fetch(url, fetchOptions);
            if (!response.ok) {
                let errorDetail = `HTTP error! Status: ${response.status}`;
                try {
                    const errorText = await response.text();
                    errorDetail += ` - ${errorText.substring(0, 100)}`;
                } catch (e) { /* Ignore */ }
                if (response.status === 401 || response.status === 403) {
                     errorDetail += " (Authentication failed. Check login/permissions)";
                }
                throw new Error(errorDetail);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setCourses(data);
            } else {
                setCourses([]);
            }
        } catch (e) {
            console.error("Failed to fetch courses:", e);
            setError(e.message || "Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };
    // --- End fetchCourses ---

    useEffect(() => {
        fetchCourses(activeTab);
    }, [activeTab]);

    const handleViewDetails = (course) => {
        setSelectedCourse(course);
        if (course.archived) {
            setIsArchiveDetailModalOpen(true);
            setIsDetailModalOpen(false);
        } else {
            setIsDetailModalOpen(true);
            setIsArchiveDetailModalOpen(false);
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setTimeout(() => setSelectedCourse(null), 300);
    };

    const handleCloseArchiveDetailModal = () => {
        setIsArchiveDetailModalOpen(false);
        setTimeout(() => setSelectedCourse(null), 300);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };
    const handleCourseCreated = (newCourse) => {
        if (activeTab === 'active') {
            setCourses(prevCourses => [newCourse, ...prevCourses]);
        }
    };

    const handleCourseAction = (actionType, courseId) => {
        console.log(`Action ${actionType} performed on course ${courseId}`);
        fetchCourses(activeTab);
    };

    let content;
    if (loading) {
        content = <div className="flex justify-center items-center py-10"><p className="text-gray-500">Loading courses...</p></div>;
    } else if (error) {
        content = <div className="flex justify-center items-center py-10 text-red-600"><p>{error}</p></div>;
    } else if (courses.length === 0) {
        const message = activeTab === 'active'
           ? "No active courses found. Click '+' to create one!"
           : "No archived courses found.";
        content = <div className="flex justify-center items-center py-10"><p className="text-gray-500">{message}</p></div>;
    } else {
        content = (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4'>
                {courses.map((course) => (
                    <CourseCard
                        key={course.id || course._id}
                        course={course}
                        onClick={handleViewDetails}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className='body flex flex-col w-full min-h-screen p-4 md:p-10 md:pb-0 md:pt-8 bg-gray-100 relative'>
            <h1 className='text-2xl md:text-3xl font-bold mb-3 text-dblue'>Courses Dashboard</h1>

            <div className="flex space-x-4 mb-6 border-b border-gray-300">
                 <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${activeTab === 'active'
                        ? 'border-b-2 border-dblue text-dblue'
                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
                >
                    Active Courses
                </button>
                <button
                    onClick={() => setActiveTab('archived')}
                     className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${activeTab === 'archived'
                        ? 'border-b-2 border-dblue text-dblue'
                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
               >
                    Archived Courses
                </button>
            </div>

            {content}

            {activeTab === 'active' && (
                <button
                    onClick={handleOpenCreateModal}
                    className='fixed bottom-8 right-8 bg-dblue text-white text-2xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-900 transition duration-200 z-30'
                    title="Create New Course"
                    aria-label="Create New Course"
                >
                    +
                </button>
            )}

            <CourseDetailModal
                course={selectedCourse}
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                onCourseAction={handleCourseAction}
            />

            <CourseArchiveDetailModal
                 course={selectedCourse}
                 isOpen={isArchiveDetailModalOpen}
                 onClose={handleCloseArchiveDetailModal}
                 onCourseAction={handleCourseAction}
            />

            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onCourseCreated={handleCourseCreated}
            />
        </div>
    );
};

export default Forms;
// // src/pages/Courses.jsx
// import React, { useState, useEffect } from 'react';
// import CourseCard from '../components/CourseCardAdmin.jsx';
// import CourseDetailModal from '../components/CourseDetailModal';
// import CreateCourseModal from '../components/CreateCourseModal.jsx';
// import CourseArchiveDetailModal from '../components/CourseArchiveDetailModal'; // Import the new modal

// const API_BASE_URL = 'http://localhost:8000/api';

// const Forms = () => {
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState('active');

//     const [selectedCourse, setSelectedCourse] = useState(null);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//     const [isArchiveDetailModalOpen, setIsArchiveDetailModalOpen] = useState(false); // State for archive modal

//     // --- fetchCourses (keep the previous version with conditional credentials) ---
//     const fetchCourses = async (tab) => {
//         setLoading(true);
//         setError(null);
//         setCourses([]);

//         const url = tab === 'active'
//            ? `${API_BASE_URL}/courses` // Assuming this gets non-archived
//            : `${API_BASE_URL}/courses/archived`; // Verify this endpoint gets archived

//         console.log(`Fetching courses from: ${url} (Tab: ${tab})`);

//         const fetchOptions = {
//             method: 'GET',
//             headers: { 'Accept': 'application/json' },
//             ...(tab === 'archived' && { credentials: 'include' }) // Send credentials only for archived
//         };

//         try {
//             const response = await fetch(url, fetchOptions);
//             if (!response.ok) {
//                 let errorDetail = `HTTP error! Status: ${response.status}`;
//                 try {
//                     const errorText = await response.text();
//                     errorDetail += ` - ${errorText.substring(0, 100)}`;
//                 } catch (e) { /* Ignore */ }
//                 if (response.status === 401 && tab === 'archived') {
//                      errorDetail += " (Check login/permissions)";
//                 }
//                 throw new Error(errorDetail);
//             }
//             const data = await response.json();
//             if (Array.isArray(data)) {
//                 setCourses(data);
//             } else {
//                 setCourses([]);
//             }
//         } catch (e) {
//             console.error("Failed to fetch courses:", e);
//             setError(e.message || "Failed to load courses.");
//         } finally {
//             setLoading(false);
//         }
//     };
//     // --- End fetchCourses ---

//     useEffect(() => {
//         fetchCourses(activeTab);
//     }, [activeTab]);

//     // --- Updated handleViewDetails ---
//     const handleViewDetails = (course) => {
//         setSelectedCourse(course);
//         if (course.archived) {
//             setIsArchiveDetailModalOpen(true); // Open archive detail modal
//             setIsDetailModalOpen(false);       // Ensure regular modal is closed
//         } else {
//             setIsDetailModalOpen(true);         // Open regular detail modal
//             setIsArchiveDetailModalOpen(false); // Ensure archive modal is closed
//         }
//     };
//     // --- End Updated handleViewDetails ---

//     // --- Close Handlers for BOTH Modals ---
//     const handleCloseDetailModal = () => {
//         setIsDetailModalOpen(false);
//         setTimeout(() => setSelectedCourse(null), 300);
//     };

//     const handleCloseArchiveDetailModal = () => {
//         setIsArchiveDetailModalOpen(false);
//         setTimeout(() => setSelectedCourse(null), 300);
//     };
//     // --- End Close Handlers ---

//     const handleOpenCreateModal = () => {
//         setIsCreateModalOpen(true);
//     };
//     const handleCloseCreateModal = () => {
//         setIsCreateModalOpen(false);
//     };
//     const handleCourseCreated = (newCourse) => {
//         if (activeTab === 'active') {
//             setCourses(prevCourses => [newCourse, ...prevCourses]);
//         }
//     };

//     const handleCourseAction = (actionType, courseId) => {
//         console.log(`Action ${actionType} performed on course ${courseId}`);
//         // Refresh the current list regardless of action
//         fetchCourses(activeTab);
//     };

//     // --- Render Logic ---
//     let content;
//     if (loading) {
//         content = <div className="flex justify-center items-center py-10"><p className="text-gray-500">Loading courses...</p></div>;
//     } else if (error) {
//         content = <div className="flex justify-center items-center py-10 text-red-600"><p>{error}</p></div>;
//     } else if (courses.length === 0) {
//         const message = activeTab === 'active'
//            ? "No active courses found. Click '+' to create one!"
//            : "No archived courses found.";
//         content = <div className="flex justify-center items-center py-10"><p className="text-gray-500">{message}</p></div>;
//     } else {
//         content = (
//             <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4'>
//                 {courses.map((course) => (
//                     <CourseCard
//                         key={course.id || course._id}
//                         course={course}
//                         onClick={handleViewDetails} // This now opens the correct modal
//                     />
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className='body flex flex-col w-full min-h-screen p-4 md:p-10 md:pb-0 md:pt-8 bg-gray-100 relative'>
//             <h1 className='text-2xl md:text-3xl font-bold mb-3 text-dblue'>Courses Dashboard</h1>

//             {/* Tab Buttons */}
//             <div className="flex space-x-4 mb-6 border-b border-gray-300">
//                  <button
//                     onClick={() => setActiveTab('active')}
//                     className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${activeTab === 'active'
//                         ? 'border-b-2 border-dblue text-dblue'
//                         : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
//                 >
//                     Active Courses
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('archived')}
//                      className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${activeTab === 'archived'
//                         ? 'border-b-2 border-dblue text-dblue'
//                         : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
//                >
//                     Archived Courses
//                 </button>
//             </div>

//             {/* Display Area */}
//             {content}

//             {/* Conditionally Render Floating Action Button */}
//             {activeTab === 'active' && (
//                 <button
//                     onClick={handleOpenCreateModal}
//                     className='fixed bottom-8 right-8 bg-dblue text-white text-2xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-900 transition duration-200 z-30'
//                     title="Create New Course"
//                     aria-label="Create New Course"
//                 >
//                     +
//                 </button>
//             )}

//             {/* Render Regular Detail Modal */}
//             <CourseDetailModal
//                 course={selectedCourse}
//                 isOpen={isDetailModalOpen}
//                 onClose={handleCloseDetailModal}
//                 onCourseAction={handleCourseAction} // Pass handler here
//             />

//             {/* Render Archive Detail Modal */}
//             <CourseArchiveDetailModal
//                  course={selectedCourse}
//                  isOpen={isArchiveDetailModalOpen}
//                  onClose={handleCloseArchiveDetailModal}
//                  onCourseAction={handleCourseAction} // Pass handler here
//             />


//             {/* Create Modal */}
//             <CreateCourseModal
//                 isOpen={isCreateModalOpen}
//                 onClose={handleCloseCreateModal}
//                 onCourseCreated={handleCourseCreated}
//             />
//         </div>
//     );
// };

// export default Forms;