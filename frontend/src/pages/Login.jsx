import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { sendPasswordResetOTP, verifyPasswordResetOTP, resetPassword } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await sendPasswordResetOTP(email);
    if (result.success) {
      toast.success('OTP sent to your email!');
      setStep(2);
      setTimer(60);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyPasswordResetOTP(email, otp);
    if (result.success) {
      setResetToken(result.resetToken);
      toast.success('OTP verified!');
      setStep(3);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await resetPassword(resetToken, newPassword);
    if (result.success) {
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'New Password'}
          </h2>
          <p className="text-gray-500 mt-2">
            {step === 1 && 'Enter your email to receive OTP'}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            {timer > 0 ? (
              <p className="text-center text-sm text-gray-500">Resend in {timer}s</p>
            ) : (
              <button type="button" onClick={handleSendOTP} className="w-full text-emerald-600 text-sm">
                Resend OTP
              </button>
            )}
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-emerald-600 text-sm flex items-center justify-center gap-1">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;