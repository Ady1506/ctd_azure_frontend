import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const location = useLocation();
    const [selected, setSelect] = useState('Dashboard');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole') || 'student';
    const [role, setRole] = useState(userRole);

    useEffect(() => {
        const path = location.pathname.replace('/', '');
        setSelect(path.charAt(0).toUpperCase() + path.slice(1));
    }, [location]);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole && ["admin", "student", "teacher"].includes(storedRole)) {
            setRole(storedRole);
        }
    }, []);

    const navItems = {
        admin: [
            { name: 'Dashboard', icon: 'https://img.icons8.com/?size=100&id=6ocfyfPqD0qz&format=png&color=173061' },
            { name: 'Courses', icon: 'https://img.icons8.com/?size=100&id=31340&format=png&color=173061' },
            { name: 'Students', icon: 'https://img.icons8.com/?size=100&id=ABBSjQJK83zf&format=png&color=173061' },
            { name: 'Profile', icon: 'https://img.icons8.com/?size=100&id=84898&format=png&color=173061' },
        ],
        student: [
            { name: 'Dashboard', icon: 'https://img.icons8.com/?size=100&id=6ocfyfPqD0qz&format=png&color=173061' },
            { name: 'Courses', icon: 'https://img.icons8.com/?size=100&id=31340&format=png&color=173061' },
            { name: 'Attendance', icon: 'https://img.icons8.com/?size=100&id=50897&format=png&color=173061' },
            { name: 'Profile', icon: 'https://img.icons8.com/?size=100&id=84898&format=png&color=173061' },
        ],
        teacher: [
            { name: 'Dashboard', icon: 'https://img.icons8.com/?size=100&id=6ocfyfPqD0qz&format=png&color=173061' },
            { name: 'Classes', icon: 'https://img.icons8.com/?size=100&id=9456&format=png&color=173061' },
            { name: 'Attendance', icon: 'https://img.icons8.com/?size=100&id=50897&format=png&color=173061' },
            { name: 'Settings', icon: 'https://img.icons8.com/?size=100&id=83214&format=png&color=173061' },
        ],
    };

    const handleLogout = async () => {
        try {
            await fetch(`${backendUrl}/api/users/logout`, {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.removeItem("userRole");
            navigate("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="navbar hidden lg:flex flex-col bg-lblue h-[100vh] w-[15%] px-4 py-10 justify-between">
                <div>
                    <div className="logo hidden lg:block">
                        <img src="/ctdlogo.png" alt="Logo" />
                    </div>
                    <div className="nav-links hidden lg:flex flex-col h-full justify-start items-center gap-6 mt-10">
                        <div className="flex flex-col gap-3">
                            {navItems[role].map((item) => (
                                <div
                                    key={item.name}
                                    className={`flex flex-row items-center py-1.5 px-4 rounded-md cursor-pointer transition-colors duration-300 ${selected === item.name ? 'bg-dblue' : ''}`}
                                    onClick={() => {
                                        if (role === 'admin' && item.name === 'Courses') {
                                            navigate('/admincourses');
                                            return;
                                        }
                                        setSelect(item.name);
                                        navigate(`/${item.name.toLowerCase()}`);

                                    }}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.name}
                                        className={`h-4 w-4 mr-2 transition-colors duration-300 ${selected === item.name ? 'filter brightness-0 invert' : ''}`}
                                    />
                                    <button className={`text-xl font-medium text-left ${selected === item.name ? 'text-white' : 'text-dblue'}`}>
                                        {item.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="logout-section flex flex-col items-start pl-4">
                    <div
                        className="flex flex-row items-center py-1.5 px-4 rounded-md cursor-pointer transition-colors duration-300"
                        onClick={handleLogout}
                    >
                        <img
                            src="https://img.icons8.com/?size=100&id=2445&format=png&color=173061"
                            alt="Logout"
                            className="h-4 w-4 mr-2"
                        />
                        <button className="text-xl font-medium text-dblue">Logout</button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className="mobile-nav lg:hidden fixed bottom-0 left-0 w-full bg-lblue flex justify-around py-4 shadow-md">
                {navItems[role].map((item) => (
                    <button
                        key={item.name}
                        onClick={() => {
                            setSelect(item.name);
                            navigate(`/${item.name.toLowerCase()}`);
                        }}
                        className="flex flex-col items-center"
                    >
                        <img
                            src={item.icon}
                            alt={item.name}
                            className={`h-6 w-6 transition-transform duration-300 ${selected === item.name ? 'filter-none' : 'filter brightness-50'}`}
                            style={{
                                transform: selected === item.name ? 'scale(1.1)' : 'scale(1)',
                                filter: selected === item.name ? 'none' : 'grayscale(100%)',
                            }}
                        />
                    </button>
                ))}
            </div>
        </>
    );
};

export default Navbar;
