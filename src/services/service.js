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

// src/services/services.js



// ✅ Helper to get token from localStorage
const getAuthToken = () => localStorage.getItem('access_token'); // ✅ Updated

// ✅ Submit Recharge API
export const submitRecharge = async (amount, utr) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${BASE_URL}/user/recharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Uses correct token
      },
      body: JSON.stringify({ amount, utr }),
    });

    const data = await response.json(); // ✅ define before using

    if (!response.ok) {
      return {
        status: false,
        message: data?.error || data?.message || '❌ Failed to submit recharge',
      };
    }

    return data; // should include { status: true }
  } catch (error) {
    console.error('Recharge API error:', error.message);
    return {
      status: false,
      message: '❌ Something went wrong. Try again later.',
    };
  }
};



// ✅ Fetch all recharge & withdraw requests (admin)
export const fetchPayments = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${BASE_URL}/user/admin/recharges`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || '❌ Failed to fetch payment requests');
    }

    // 🔥 Return format expected by frontend Payment.jsx
    return {
      status: data?.status,
      data: {
        requests: data?.data?.requests || [],
      },
    };
  } catch (error) {
    console.error('Fetch payments error:', error.message);
    throw error;
  }
};

// ✅ Update payment status (approve or reject)
export const updatePaymentStatus = async (username, utr, status) => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/user/admin/recharge-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, utr, status }),
  });
  const data = await response.json();
  return data;
};






