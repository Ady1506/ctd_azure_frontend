import React, { useRef, useState, useEffect } from 'react';
import DashCourseCard from './DashCourseCard';
import axios from 'axios';

const DashCourse = () => {
  const scrollRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/courses`);
        setCourses(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Arrow logic
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollWidth > clientWidth && scrollLeft + clientWidth  < scrollWidth);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex w-full h-full items-center">
      {/* Left Arrow */}
      <div className="w-[4%] flex justify-center items-center">
        {showLeftArrow && (
          <img
            className="h-5 cursor-pointer rotate-180"
            src="https://img.icons8.com/?size=100&id=79025&format=png&color=173061"
            alt="Left Arrow"
            onClick={scrollLeft}
          />
        )}
      </div>

      <div
  ref={scrollRef}
  className="w-[92%] h-[90%] flex overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] gap-6 p-0"
>
  {courses!=null ? (
    courses.map((course) => (
      <div key={course.id} className="w-[23%] min-w-[200px]">
        <DashCourseCard course={course} />
      </div>
    ))
  ) : (
    <div className="w-full text-center text-gray-500 font-bold">
      No courses available
    </div>
  )}
</div>

      {/* Right Arrow */}
      <div className="w-[4%] flex justify-center items-center">
        {showRightArrow && (
          <img
            className="h-5 cursor-pointer"
            src="https://img.icons8.com/?size=100&id=79025&format=png&color=173061"
            alt="Right Arrow"
            onClick={scrollRight}
          />
        )}
      </div>
    </div>
  );
};

export default DashCourse;


// import React, { useRef, useState, useEffect } from 'react';
// import DashCourseCard from './DashCourseCard';

// const DashCourse = () => {
//   const scrollRef = useRef(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   // Scroll Left
//   const scrollLeft = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   // Scroll Right
//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   // Check scroll position and toggle arrow visibility
//   useEffect(() => {
//     const handleScroll = () => {
//       if (scrollRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//         setShowLeftArrow(scrollLeft > 0);
//         setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
//       }
//     };

//     const scrollContainer = scrollRef.current;
//     if (scrollContainer) {
//       scrollContainer.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (scrollContainer) {
//         scrollContainer.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, []);

//   return (
//     <div className="flex w-full h-full items-center">
//       {/* Left Arrow (Smaller Size, 5% Width) */}
//       <div className="w-[4%] flex justify-center items-center">
//         {showLeftArrow && (
//           <img
//             className="h-5 cursor-pointer rotate-180"
//             src="https://img.icons8.com/?size=100&id=79025&format=png&color=173061"
//             alt="Left Arrow"
//             onClick={scrollLeft}
//           />
//         )}
//       </div>

//       {/* Scrollable Course Container (90% Width) */}
//       <div
//         ref={scrollRef}
//         className="w-[92%] flex overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] gap-6 p-0"
//       >
//         {Array.from({ length: 10 }).map((_, index) => (
//           <div key={index} className="w-[23%] min-w-[200px]">
//             <DashCourseCard />
//           </div>
//         ))}
//       </div>

//       {/* Right Arrow (Smaller Size, 5% Width) */}
//       <div className="w-[4%] flex justify-center items-center">
//         {showRightArrow && (
//           <img
//             className="h-5 cursor-pointer"
//             src="https://img.icons8.com/?size=100&id=79025&format=png&color=173061"
//             alt="Right Arrow"
//             onClick={scrollRight}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashCourse;
