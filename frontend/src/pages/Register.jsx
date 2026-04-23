import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, Mail, Lock, Eye, EyeOff, Phone, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [step, setStep] = useState(1); // 1: form, 2: email otp, 3: phone otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const { sendEmailOTP, verifyEmailOTP, sendPhoneOTP, verifyPhoneOTP, resendEmailOTP } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (emailTimer > 0) {
      const interval = setInterval(() => setEmailTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [emailTimer]);

  React.useEffect(() => {
    if (phoneTimer > 0) {
      const interval = setInterval(() => setPhoneTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [phoneTimer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter valid phone number');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSendEmailOTP = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await sendEmailOTP({ 
      email: formData.email, 
      name: formData.name,
      password: formData.password,
      address: formData.address,
    });
    if (result.success) {
      toast.success('OTP sent to your email!');
      setStep(2);
      setEmailTimer(60);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }
    setLoading(true);
    const result = await verifyEmailOTP(formData.email, emailOtp);
    if (result.success) {
      toast.success('Email verified! Sending OTP to phone...');
      await handleSendPhoneOTP();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleSendPhoneOTP = async () => {
    const result = await sendPhoneOTP(formData.phone, formData.email);
    if (result.success) {
      toast.success('OTP sent to your phone!');
      setStep(3);
      setPhoneTimer(60);
    } else {
      toast.error(result.error);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }
    setLoading(true);
    const result = await verifyPhoneOTP(formData.email, formData.phone, phoneOtp);
    if (result.success && result.user) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Verification failed');
    }
    setLoading(false);
  };

  const handleResendEmailOTP = async () => {
    if (emailTimer > 0) return;
    setLoading(true);
    const result = await resendEmailOTP(formData.email);
    if (result.success) {
      toast.success('OTP resent!');
      setEmailTimer(60);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleResendPhoneOTP = async () => {
    if (phoneTimer > 0) return;
    setLoading(true);
    const result = await sendPhoneOTP(formData.phone, formData.email);
    if (result.success) {
      toast.success('OTP resent!');
      setPhoneTimer(60);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSendEmailOTP();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            {step === 1 && 'Create Account'}
            {step === 2 && 'Verify Email'}
            {step === 3 && 'Verify Phone'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && 'Join KiranaConnect for fresh groceries'}
            {step === 2 && `Enter OTP sent to ${formData.email}`}
            {step === 3 && `Enter OTP sent to ${formData.phone}`}
          </p>
        </div>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitForm}>
            {(registerError || passwordError) && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {passwordError || registerError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Create a password (min 6 characters)"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Continue'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Email OTP Verification */}
        {step === 2 && (
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP sent to your email</label>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleVerifyEmailOTP}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            {emailTimer > 0 ? (
              <p className="text-center text-sm text-gray-500">Resend in {emailTimer}s</p>
            ) : (
              <button onClick={handleResendEmailOTP} className="w-full text-emerald-600 text-sm">
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* Step 3: Phone OTP Verification */}
        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP sent to your phone</label>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleVerifyPhoneOTP}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Complete Registration'}
            </button>
            {phoneTimer > 0 ? (
              <p className="text-center text-sm text-gray-500">Resend in {phoneTimer}s</p>
            ) : (
              <button onClick={handleResendPhoneOTP} className="w-full text-emerald-600 text-sm">
                Resend OTP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;