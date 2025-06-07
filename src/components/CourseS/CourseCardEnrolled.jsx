import React from 'react';

const CourseCardEnrolled = ({ course }) => {
  if (!course) return null;

  return (
    <div className='flex p-4 gap-5 h-full w-full'>
      {/* Course image */}
      <img
        src={course.link || '/placeholder.png'}
        alt={course.name}
        className='flex-[2] object-cover rounded-md'
      />
      <div className='flex flex-col flex-[3] gap-2 h-full py-2'>
        <div className='text-3xl font-bold text-[#173061]'>{course.name}</div>
        <div className='text-md text-[#173061] line-clamp-3'>{course.description}</div>
      </div>
    </div>
  );
};

export default CourseCardEnrolled;
