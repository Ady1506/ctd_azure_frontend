import React, { useEffect, useState } from 'react';
import DashAttendanceCard from './DashAttendanceCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashAttendance = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/attendances/recent`);
        if(response.data){
          const parsedData = response.data.map(item => ({
            courseName: item.course_name,
            markedAt: item.marked_at,
          }));
          setAttendanceData(parsedData);
          console.log(parsedData);
        }else{
          console.log("No data found");
        }
        
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleViewAllClick = () => {
    navigate('/attendance');
  };

  return (
    <div className='h-full w-full flex flex-col gap-3 p-4 '>
      <div className='flex justify-between w-full text-[#173061]'>
        <div className='font-bold text-lg cursor-default'>Attendance</div>
        <div className='underline cursor-pointer' onClick={handleViewAllClick}>view all</div>
      </div>
      <div className="flex-grow overflow-auto pr-2 
                      [&::-webkit-scrollbar]:[width:3px] 
                      [&::-webkit-scrollbar-thumb]:bg-[#173061] flex flex-col gap-2">
        {loading ? (
          <div>Loading...</div>
        ) : attendanceData.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 font-bold">
            No attendance record
          </div>
        ) : (
          attendanceData.map((item, index) => (
            <DashAttendanceCard key={index} data={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default DashAttendance;