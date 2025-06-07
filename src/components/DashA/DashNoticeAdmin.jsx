import React, { useState, useEffect } from 'react';
import DashNoticeCard from './DashNoticeCard.jsx';
import axios from 'axios';
import dayjs from 'dayjs';

const DashNotice = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [expanded, setExpanded] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/notices`, {
          withCredentials: true
        });
        const formattedNotices = response.data.map((notice) => {
          const createdAt = dayjs(notice.created_at);
          return {
            date: createdAt.format('DD MMM'), // e.g., "23 Apr"
            time: createdAt.format('hh:mm A'), // e.g., "01:20 PM"
            text: notice.content,
            hasAttachment: !!notice.link, // Check if a link exists
            attachmentLink: notice.link,
            course: notice.course_name,
          };
        });
        setNotices(formattedNotices.reverse());
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      }
    };

    fetchNotices();
  }, []);

  const handleViewDetails = (notice) => {
    setSelectedNotice(notice);
    setViewAll(false);
    setExpanded(true);
  };

  const handleViewAll = () => {
    setSelectedNotice(null);
    setViewAll(true);
    setExpanded(true);
  };

  const handleAttachmentClick = (attachmentLink) => {
    window.open(attachmentLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='h-full w-full flex flex-col gap-3 p-4'>
      <div className='flex justify-between w-full text-[#173061] mb-2'>
        <div className='font-bold text-lg cursor-default'>Recent Notice</div>
        <div className='underline cursor-pointer' onClick={handleViewAll}>view all</div>
      </div>

      {/* Display only the first 3 notices */}
      <div className='grid grid-cols-3 gap-4 w-full'>
        {notices.slice(0, 3).map((notice, index) => (
          <DashNoticeCard 
            key={index} 
            {...notice} 
            isExpanded={false} 
            onViewDetails={() => handleViewDetails(notice)} 
            onAttachmentClick={() => handleAttachmentClick(notice.attachmentLink)} 
          />
        ))}
      </div>

      {/* Modal for all notices or a single notice */}
      {expanded && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:[width:3px] [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-track]:m-[4px] 
                      [&::-webkit-scrollbar-thumb]:bg-[#173061]'>
            <div className='flex justify-between items-center mb-2'>
              <h2 className='text-lg font-bold text-[#173061]'>
                {viewAll ? 'All Notices' : selectedNotice?.course}
              </h2>
              <button onClick={() => setExpanded(false)} className='text-[#173061] font-bold'>X</button>
            </div>

            {viewAll ? (
              // Show all notices
              <div className='grid grid-cols-3 gap-4'>
                {notices.map((notice, index) => (
                  <DashNoticeCard 
                    key={index} 
                    {...notice} 
                    isExpanded={true} 
                    hideViewDetails={true} 
                    onAttachmentClick={() => handleAttachmentClick(notice.attachmentLink)} 
                  />
                ))}
              </div>
            ) : (
              // Show details of a single notice
              <div>
                <div className='text-sm text-gray-500 mb-2'>{selectedNotice?.date} - {selectedNotice?.time}</div>
                <div className='text-gray-700 mb-4'>{selectedNotice?.text}</div>
                {selectedNotice?.hasAttachment && (
                  <a
                    href={selectedNotice.attachmentLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-dblue underline'
                  >
                    View Attachment
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashNotice;