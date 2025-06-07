import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Profo = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/current`, {
          withCredentials: true,
        });
        console.log('Fetched data:', res.data);
        setUserName(res.data.display_name);
        localStorage.setItem('userData', JSON.stringify(res.data));
      } catch (err) {
        console.error('Error fetching user:', err);
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        setUserName(storedUser?.display_name || 'Guest');
      }
    };

    fetchUser();
  }, []);
  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <div className='flex flex-row items-center gap-2'>
      <h1 className='text-xl font-medium'>{userName || 'User'}</h1>
      <img
        src='https://img.icons8.com/?size=100&id=84898&format=png&color=173061'
        className='w-10 h-10 cursor-pointer'
        alt="User Icon"
        onClick={handleClick}
      />
      {/* <img
        src='https://img.icons8.com/?size=100&id=364&format=png&color=999999'
        className='w-6 h-6'
        alt="Settings"
      /> */}
    </div>
  );
};

export default Profo;
