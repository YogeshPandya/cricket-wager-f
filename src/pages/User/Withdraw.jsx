import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import upiLogo from '../../assets/upi.png';
import { getUserDetails, submitWithdrawal } from '../../services/service';

export default function Withdraw() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [holderName, setHolderName] = useState('');
  const [upiError, setUpiError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getUserDetails();
        if (res.status && res.data?.user?.balance !== undefined) {
          setBalance(res.data.user.balance);
        } else {
          setBalance(0);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleWithdraw = () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (balance < 200) {
      setError('Insufficient balance to withdraw. Minimum required: ₹200');
      return;
    }

    if (numericAmount < 200) {
      setError('Minimum withdrawal amount is ₹200');
      return;
    }

    if (numericAmount > balance) {
      setError('You cannot withdraw more than your available balance');
      return;
    }

    setError('');
    setSubmitError('');
    setSubmitSuccess('');
    setShowModal(true);
  };

  const handleSubmitUpi = async () => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;

    if (!upiId || !upiRegex.test(upiId)) {
      setUpiError('Please enter a valid UPI ID (e.g., example@upi)');
      return;
    }

    if (!holderName) {
      setUpiError('Please enter account holder name');
      return;
    }

    setUpiError('');
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const token = localStorage.getItem('access_token'); // Assuming token stored here
      if (!token) throw new Error('User not authenticated');

     const data = await submitWithdrawal(Number(amount), upiId, holderName);
     


      if (data.status) {
        setSubmitSuccess('Withdrawal request submitted successfully!');
        setShowModal(false);
        setAmount('');
        setUpiId('');
        setHolderName('');
        // Optionally refresh balance here
        const res = await getUserDetails();
        if (res.status && res.data?.user?.balance !== undefined) {
          setBalance(res.data.user.balance);
        }
      } else {
        setSubmitError(data.message || 'Withdrawal failed');
      }
    } catch (err) {
      setSubmitError(err.message || 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-6 font-semibold text-lg hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-2">Withdraw</h1>

      {loading ? (
        <p className="text-yellow-300 font-medium mb-6">Available Balance: Loading...</p>
      ) : (
        <p className="text-yellow-300 font-medium mb-6">
          Available Balance: ₹{balance >= 200 ? balance.toFixed(2) : '0.00'}
        </p>
      )}

      <div className="mb-3">
        <label className="block mb-2 text-sm font-medium">Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
            setSubmitError('');
            setSubmitSuccess('');
          }}
          placeholder="e.g. 500"
          className="w-full px-4 py-2 rounded-xl text-black text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {error && <p className="text-red-400 mt-1 text-sm font-semibold">{error}</p>}
        {submitError && <p className="text-red-400 mt-1 text-sm font-semibold">{submitError}</p>}
        {submitSuccess && <p className="text-green-400 mt-1 text-sm font-semibold">{submitSuccess}</p>}
      </div>

      <button
        onClick={handleWithdraw}
        disabled={loading || submitting}
        className={`w-full ${
          loading || submitting ? 'bg-yellow-200 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300'
        } text-black font-bold py-3 rounded-xl text-lg shadow transition`}
      >
        {submitting ? 'Processing...' : 'Withdraw Now'}
      </button>

      <div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white mt-6">
        <h2 className="text-yellow-300 font-bold mb-2">Withdraw Rules:</h2>
        <ul className="list-disc ml-4 space-y-1 leading-relaxed">
          <li>Minimum withdrawal amount is ₹200.</li>
          <li>Withdrawals may take up to 24 hours to process.</li>
          <li>Ensure your UPI ID is entered correctly during the next step.</li>
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md text-black relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold"
              disabled={submitting}
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <img src={upiLogo} alt="upi-logo" className="h-10 mx-auto mb-2" />
              <h2 className="text-2xl font-extrabold text-green-700">Confirm Withdrawal</h2>
             <p className="text-sm text-gray-600 mt-1">
  You are withdrawing <span className="font-semibold text-black">₹{amount}</span>
</p>
<p className="text-xs text-green-600 mt-1">
  After 5% platform fees you will get ₹{(Number(amount) * 0.95).toFixed(2)}
</p>


            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-gray-800">
                UPI ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiError('');
                }}
                placeholder="e.g. rahul@upi"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1 italic">
                Format: name@bank (e.g. raj@upi, 9876543210@paytm)
              </p>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-gray-800">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => {
                  setHolderName(e.target.value);
                  setUpiError('');
                }}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={submitting}
              />
            </div>

            {upiError && <p className="text-red-600 text-sm font-semibold mb-3">{upiError}</p>}

            <button
              onClick={handleSubmitUpi}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition"
            >
              {submitting ? 'Submitting...' : '✅ Submit & Withdraw'}
            </button>

            <p className="text-xs text-center text-gray-700 mt-4">
              🔄 After Submit, please wait <span className="font-semibold">5–10 minutes</span> for processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
