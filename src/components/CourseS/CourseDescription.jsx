// src/pages/CourseDescription.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Profo from '../Profo';
import CourseCard from './CourseCard';
import EnrollCard from './EnrollCard';
import CourseCardEnrolled from './CourseCardEnrolled';
import Updates from './Updates';
import Upcoming from './Upcoming';
import Certificates from './Certificates';

const CourseDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) load all courses and pick ours
        const coursesRes = await axios.get('http://localhost:8000/api/courses', {
          withCredentials: true,
        });
        const found = coursesRes.data.find(c => c.id === id) || null;
        setCourse(found);

        // 2) check enrollment
        const enrollRes = await axios.get('http://localhost:8000/api/enrollments/courses', {
          withCredentials: true,
        });
        const enrolledIds = enrollRes.data.map(c => c.id);
        setIsEnrolled(enrolledIds.includes(id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="p-4">Loading…</p>;
  if (!course)  return <p className="p-4 text-red-500">Course not found.</p>;

  return (
    <div className='body flex flex-col w-full h-full p-4 md:p-10 bg-gray-100'>
      <div className='flex flex-row justify-between items-center w-full'>
        <div className='flex flex-row items-center gap-3'>
          <div
            className='flex items-center bg-[#DDE4F0] py-1 px-2 text-xs font-bold justify-center rounded cursor-pointer'
            onClick={() => navigate(-1)}
          >
            &lt; BACK
          </div>
          <h1 className='text-2xl md:text-3xl font-semibold text-dblue'>
            {course.name}
          </h1>
        </div>
        <Profo />
      </div>

      {isEnrolled ? (
        <div className='sub-body flex flex-col flex-grow w-full h-[75vh] mt-4 p-2 gap-2'>
          <div className='flex w-full h-[50%] gap-2'>
            <div className='flex-[2] bg-[#E4E9F0] rounded'>
              <CourseCardEnrolled course={course}/>
            </div>
            <div className='flex-[1] bg-[#E4E9F0] rounded'>
              <Upcoming course={course}/>
            </div>
          </div>
          <div className='flex w-full h-[50%] gap-2'>
            <div className='flex-[2] flex gap-2'>
              <div className='flex-[1] bg-[#E4E9F0] rounded'>
                <Updates course={course}/>
              </div>
              <div className='flex-[1] bg-[#E4E9F0] rounded'></div>
            </div>
            <div className='flex-[1] bg-[#E4E9F0] rounded'>
              <Certificates course={course}/>
            </div>
          </div>
        </div>
      ) : (
        <div className='sub-body flex flex-grow w-full h-full mt-4 p-2 gap-2'>
          <div className='bg-[#E4E9F0] flex-[2] rounded'>
            <CourseCard course={course}/>
          </div>
          <div className='bg-[#E4E9F0] flex-[1] rounded'>
            <EnrollCard course={course} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDescription;

// // src/pages/CourseDescription.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Profo from '../Profo';
// import CourseCard from './CourseCard';
// import EnrollCard from './EnrollCard';
// import CourseCardEnrolled from './CourseCardEnrolled';
// import Updates from './Updates';
// import Upcoming from './Upcoming';
// import Certificates from './Certificates';

// const CourseDescription = () => {
//   const navigate = useNavigate();
//   const [isEnrolled, setIsEnrolled] = useState(false);

//   useEffect(() => {
//     const courseId = localStorage.getItem('selectedCourseId');
//     if (!courseId) {
//       console.warn('No selectedCourseId in localStorage');
//       return;
//     }

//     // Fetch enrolled courses and see if our courseId is in the list
//     axios
//       .get('http://localhost:8000/api/enrollments/courses', { withCredentials: true })
//       .then(res => {
//         const enrolledIds = res.data.map(c => c.id);
//         setIsEnrolled(enrolledIds.includes(courseId));
//       })
//       .catch(err => {
//         console.error('Failed to check enrollment status:', err);
//       });
//   }, []);

//   return (
//     <div className='body flex flex-col w-full h-full p-4 md:p-10 bg-gray-100'>
//       <div className='flex flex-row justify-between items-center w-full'>
//         <div className='flex flex-row items-center gap-3'>
//           <div
//             className='flex items-center bg-[#DDE4F0] py-1 px-2 text-xs font-bold justify-center rounded cursor-pointer'
//             onClick={() => navigate(-1)}
//           >
//             &lt; BACK
//           </div>
//           <h1 className='text-2xl md:text-3xl font-semibold text-dblue'>
//             Course Description
//           </h1>
//         </div>
//         <Profo />
//       </div>

//       {isEnrolled ? (
//         <div className='sub-body flex flex-col flex-grow w-full h-[75vh] mt-4 p-2 gap-2'>
//           <div className='flex w-full h-[50%] gap-2'>
//             <div className='flex-[2] bg-[#E4E9F0] rounded'>
//               <CourseCardEnrolled />
//             </div>
//             <div className='flex-[1] bg-[#E4E9F0] rounded'>
//               <Upcoming />
//             </div>
//           </div>
//           <div className='flex w-full h-[50%] gap-2'>
//             <div className='flex-[2] flex gap-2'>
//               <div className='flex-[1] bg-[#E4E9F0] rounded'>
//                 <Updates />
//               </div>
//               <div className='flex-[1] bg-[#E4E9F0] rounded'></div>
//             </div>
//             <div className='flex-[1] bg-[#E4E9F0] rounded'>
//               <Certificates />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className='sub-body flex flex-grow w-full h-full mt-4 p-2 gap-2'>
//           <div className='bg-[#E4E9F0] flex-[2] rounded'>
//             <CourseCard />
//           </div>
//           <div className='bg-[#E4E9F0] flex-[1] rounded'>
//             <EnrollCard />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseDescription;
