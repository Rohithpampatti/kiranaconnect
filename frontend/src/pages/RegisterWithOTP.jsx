import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, Mail, Lock, Eye, EyeOff, Phone, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const RegisterWithOTP = () => {
  const { 
    sendEmailOTP: sendEmailOTPAPI, 
    verifyEmailOTP: verifyEmailOTPAPI,
    sendPhoneOTP: sendPhoneOTPAPI,
    verifyPhoneOTP: verifyPhoneOTPAPI,
    resendEmailOTP: resendEmailOTPAPI
  } = useAuth();
  
  const [step, setStep] = useState(1); // 1: form, 2: email otp, 3: phone otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendEmailOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter email');
      return;
    }
    if (!formData.name) {
      toast.error('Please enter name');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter password');
      return;
    }
    setLoading(true);
    const result = await sendEmailOTPAPI({ 
      email: formData.email, 
      name: formData.name,
      password: formData.password,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
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
    const result = await verifyEmailOTPAPI(formData.email, emailOtp);
    if (result.success) {
      toast.success('Email verified! Sending OTP to phone...');
      setStep(3);
      await handleSendPhoneOTP();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleSendPhoneOTP = async () => {
    const result = await sendPhoneOTPAPI(formData.phone, formData.email);
    if (result.success) {
      toast.success('OTP sent to your phone!');
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
    const result = await verifyPhoneOTPAPI(formData.email, formData.phone, phoneOtp);
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
    const result = await resendEmailOTPAPI(formData.email);
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
    const result = await sendPhoneOTPAPI(formData.phone, formData.email);
    if (result.success) {
      toast.success('OTP resent!');
      setPhoneTimer(60);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
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
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSendEmailOTP();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            {step === 1 && 'Create Account'}
            {step === 2 && 'Verify Email'}
            {step === 3 && 'Verify Phone'}
          </h2>
          <p className="text-gray-500 mt-2">
            {step === 1 && 'Join KiranaConnect for fresh groceries'}
            {step === 2 && `Enter OTP sent to ${formData.email}`}
            {step === 3 && `Enter OTP sent to ${formData.phone}`}
          </p>
        </div>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">We'll send OTP to verify your number</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 2: Email OTP Verification */}
        {step === 2 && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest"
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
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP sent to your phone</label>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleVerifyPhoneOTP}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Phone & Complete Registration'}
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithOTP;