"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';


export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const urltoken =window.location.search.split("=")[1];
        if (urltoken) {
            setToken(urltoken || "");
            
        }
    }, []);
    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);
    const verifyEmail = async() => {
        try {
            const response =await axios.post('/api/user/verifyEmail', { token });
            if (response.status === 200) {
                setVerified(true);
                toast.success("Email verified successfully");
            } else {
                toast.error("Verification failed");
            }
        }
        catch (error: any) {
            console.error("Error during email verification:", error);
            toast.error(error.message || "Verification failed");
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
            <button
                onClick={verifyEmail}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={!token}
            >
                Verify Email
            </button>

            {verified ? (
                <p className="text-green-500">Your email has been verified successfully!</p>
            ) : (
                <p className="text-red-500">Verifying your email...</p>
            )}
        </div>
    );
}
    