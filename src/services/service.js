// src/services/service.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Update to your deployed backend URL if needed

// ✅ Auth Header Helper for Protected Routes
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Admin Login
export const adminLogin = (data) => {
  return axios.post(`${BASE_URL}/admin/login`, data);
};

// ✅ Fetch All Users (Protected API — points to correct route)
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/all`, getAuthHeader());
    return response.data?.data?.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// ✅ User Signup
export const signupUser = (data) => {
  return axios.post(`${BASE_URL}/user/signup`, data);
};

// ✅ User Login
export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/user/login`, data);
};

// ✅ Forgot Password
export const forgotPassword = (data) => {
  return axios.post(`${BASE_URL}/user/forgot-password`, data);
};

// ✅ Reset Login Password
export const resetLoginPassword = (data) => {
  return axios.post(`${BASE_URL}/user/reset-login-password`, data);
};

export const getUserDetails = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    return await response.json();
  } catch (err) {
    console.error('Error fetching user details:', err);
    return { status: false };
  }
};


