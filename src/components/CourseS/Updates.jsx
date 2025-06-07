import React, { useEffect, useState } from 'react';
import UpdatesCard from './UpdatesCard';
import axios from 'axios';

const Updates = ({ course }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/notices/enrolled`);
        const filteredNotices = response.data.filter(notice => notice.course_id === course.id);
        setNotices(filteredNotices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [course.id]);

  return (
    <div className='h-full w-full flex flex-col gap-3 p-4'>
      <div className='flex justify-between w-full text-[#173061]'>
        <div className='font-bold text-lg cursor-default'>Updates</div>
      </div>
      <div className='flex flex-col gap-2 w-full h-full'>
        {loading ? (
          <div>Loading...</div>
        ) : notices.length === 0 ? (
          <div className='text-gray-500 font-bold'>No updates available</div>
        ) : (
          notices.map((notice) => (
            <UpdatesCard
              key={notice.id}
              content={notice.content}
              link={notice.link}
              createdAt={notice.created_at}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Updates;