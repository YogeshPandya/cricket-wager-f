// src/services/service.js
import axios from 'axios';
// ✅ Add socket connection for real-time updates


const BASE_URL = 'http://localhost:5000'; // Update to your deployed backend URL if needed

import { io } from 'socket.io-client';

export const socket = io(BASE_URL, {
  transports: ['websocket'], // ensures WebSocket is used
});

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

// src/services/service.js

export const fetchRechargeHistory = async () => {
  const token = localStorage.getItem('access_token'); // ✅ not 'token'
  if (!token) {
    console.warn('No access token');
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/user/recharge-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.rechargeHistory;
  } catch (err) {
    console.error('Failed to fetch recharge history:', err.response?.data || err.message);
    return [];
  }
};

// Submit withdrawal request
// ❌ Replace your current submitWithdrawal with:
export const submitWithdrawal = async (amount, upiId, holderName) => {
  const token = getAuthToken();
  try {
    const res = await fetch(`${BASE_URL}/user/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, upiId, holderName }),
    });

    const data = await res.json();

    // ✅ Add this check:
    if (!res.ok) {
      return {
        status: false,
        message: data?.message || data?.error || 'Withdrawal request failed'
      };
    }

    return data;
  } catch (err) {
    console.error('Withdraw API error:', err);
    return { status: false, message: 'Withdraw request failed' };
  }
};

// ✅ Fetch All Withdrawal Requests (admin use)
export const fetchAllWithdrawRequests = async () => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await fetch(`${BASE_URL}/user/admin/withdrawals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to fetch withdrawal requests');
    }

    return {
      status: true,
      data: Array.isArray(data?.data) ? data.data : [], // ✅ correct structure
    };
  } catch (error) {
    console.error('Fetch withdraw requests error:', error.message);
    return {
      status: false,
      data: [],
    };
  }
};





export const updateWithdrawStatus = async (username, createdAt, status) => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://localhost:5000/user/admin/withdrawal-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, createdAt, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to update withdrawal status');
    }

    return data;
  } catch (error) {
    console.error('Update withdraw status error:', error.message);
    throw error;
  }
};


export const fetchUserWithdrawals = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await axios.get(`${BASE_URL}/user/withdraw`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Failed to fetch withdrawals:', err);
    return   { status: false, withdrawals: [] }; ;
  }
};

export const updateUserInfo = async (data) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('Token not found in localStorage!');
      throw new Error('Session expired. Please login again.');
    }

    const response = await axios.patch(`${BASE_URL}/user/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Update user info error:', error);
    throw error.response?.data || { message: 'Something went wrong while updating user info.' };
  }
};

//new api
export const createMatch = async (matchData) => {
  try {
    const response = await axios.post(`${BASE_URL}/match/create`, matchData);
    return response.data.match;
  } catch (error) {
    console.error('Error creating match:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/match`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteMatch = async (id) => {
  const res = await axios.delete(`http://localhost:5000/match/${id}`);
  return res.data;
};

//new code

export const getQuestions = async (matchId) => {
  const res = await axios.get(`${BASE_URL}/match/${matchId}/questions`);
  return res.data;
};

export const addQuestionToMatch = async (matchId, questionData) => {
  const res = await axios.post(`${BASE_URL}/match/${matchId}/question`, questionData);
  return res.data;
};

// export const editQuestion = async (matchId, questionId, newQuestionText) => {
//   const res = await axios.put(`${BASE_URL}/match/${matchId}/question/${questionId}`, {
//     question: newQuestionText,
//   });
//   return res.data;
// };

// export const deleteQuestion = async (matchId, questionId) => {
//   const res = await axios.delete(`${BASE_URL}/match/${matchId}/question/${questionId}`);
//   return res.data;
// };

export const addOptionToQuestion = async (matchId, questionId, optionData) => {
  const res = await axios.post(`${BASE_URL}/match/${matchId}/question/${questionId}/option`, optionData);
  return res.data;
};



export const deleteQuestion = async (matchId, questionId) => {
  return axios.delete(`${BASE_URL}/match/${matchId}/delete-question/${questionId}`);
};




export const saveQuestionsForMatch = async (matchId, questionData) => {
  return axios.post(`http://localhost:5000/match/${matchId}/add-question`, questionData);
};

export const getMatchQuestions = async (matchId) => {
  const res = await axios.get(`${BASE_URL}/match/${matchId}/questions`);
  return res.data;
};

export const editQuestion = (matchId, questionId, payload) => {
  return axios.patch(
    `${BASE_URL}/match/${matchId}/edit-question/${questionId}`,
    payload
  );
};


// ✅ Add in service.js
export const updateOption = async (matchId, questionId, optionId, payload) => {
  return await axios.patch(
    `http://localhost:5000/match/${matchId}/edit-option/${questionId}/${optionId}`,
    payload
  );
};

export const placeBet = async ({ matchId, questionId, optionId, amount, userId }) => {
  try {
    const betData = {
      userId,
      questionId,
      optionId,
      amount,
    };

    console.log("📤 Sending betData to backend:", betData);

    const res = await axios.post(`${BASE_URL}/match/${matchId}/place-bet`, betData);
    return res.data;
  } catch (err) {
    console.error("❌ Error placing bet:", err.response?.data || err.message);
    throw err;
  }
};


// export const getUserBets = async (userId) => {
//   try {
//     const res = await fetch(`${BASE_URL}/match/user/${userId}/bets`);
//     const data = await res.json();
//     console.log("✅ Bets fetched from API:", data);
//     return data.bets || [];
//   } catch (err) {
//     console.error('❌ Failed to get user bets:', err);
//     return [];
//   }
// };

export const getUserBets = async (userId) => {
  try {
    
    const response = await fetch(`${BASE_URL}/match/user/${userId}/bets`);
    const allBets = await response.json();
 // Debug each bet
    allBets.forEach((bet, index) => {
      console.log(`🔍 Bet ${index}:`, {
        userId: bet.userId,
        user_id: bet.user_id,
        userID: bet.userID,
        allKeys: Object.keys(bet)
      });
    });
    
    // For now, return all bets to test if the component works
    console.log("🎯 Returning all bets for testing");
    return allBets; // This will show all bets temporarily
    
  } catch (error) {
    console.error("Error in getUserBets:", error);
    return [];
  }
};

//new
// Add this function to your service.js file

// Add this function to your service.js file
// Make sure API_BASE_URL is correctly defined (e.g., 'http://localhost:5000')

export const setQuestionResult = async (matchId, questionId, result) => {
  try {
    console.log('📡 API Call:', {
      url: `${BASE_URL}/match/${matchId}/set-result/${questionId}`,
      method: 'PATCH',
      body: { result }
    });

    const response = await fetch(`${BASE_URL}/match/${matchId}/set-result/${questionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('Error setting question result:', error);
    throw error;
  }
};

