"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';

export default function ProfilePage(){
    const router=useRouter();
    const logout = async () => {
        try {
            const response = await axios.get('/api/user/logout');
            
            router.push('/login');
        } catch (error) {
            console.error("Error during logout:", error);  
        }
    }
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user/me');
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }   
        }
        fetchUser();  
    }
    , []);
    const gotoProfile = () => {
        router.push(`/profile/${user._id}`);
    }

    if (!user) {
  return <p>Loading user data...</p>;
}

    return (
        <div onClick={gotoProfile} className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Profile Page</h1>
            <p>This is the user's profile page.</p>

            <h2>User Information</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Logout
            </button>
            
            
        </div>

    );
}