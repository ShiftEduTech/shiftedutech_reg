import React, { useState } from 'react';
import { User, Phone, Mail, GraduationCap, CheckCircle, X, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
   firstName: string;
  lastName: string;
  fullName: string;
  fatherName: string;
   phone: string;
  email: string;
  landmark: string;
  state: string;
  pincode: string;
   fullAddress: string;
  collegeName: string;
  branch: string;
  studentId: string;
  yearOfPass: string;
  interestedCourse: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
 
}

interface FormErrors {
  [key: string]: string;
}

export default function StudentRegistrationForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    fullName: '',
    fatherName: '',
    phone: '',
    email: '',
    landmark: '',
    state: '',
    pincode: '',
    fullAddress: '',
    collegeName: '',
    branch: '',
    studentId: '',
    yearOfPass: '',
    interestedCourse: '',
    dateFrom: undefined,
    dateTo: undefined
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate full name when first or last name changes
  React.useEffect(() => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    setFormData(prev => ({ ...prev, fullName }));
  }, [formData.firstName, formData.lastName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = value ? new Date(value) : undefined;
    setFormData(prev => ({ ...prev, [name]: date }));
    
    // Clear error when date is selected
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
       const requiredFields = [
'firstName','lastName', 'fullName','fatherName', 'phone', 'email', 'state', 'pincode','fullAddress', 'collegeName', 'branch', 'studentId', 'yearOfPass','interestedCourse'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Date validation
    if (!formData.dateFrom) {
      newErrors.dateFrom = 'Course start date is required';
    }
    
    if (!formData.dateTo) {
      newErrors.dateTo = 'Course end date is required';
    }
    // Date validation
    if (formData.dateFrom && formData.dateTo && formData.dateFrom >= formData.dateTo) {
      newErrors.dateTo = 'End date must be after start date';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzE7JEvQD6t4yrJbFKXqyCOrWrXx4S25ooSHglijcNelemiKV3T5aiOMl9sqXOxKC53/exec';

    // Reorder data to match Google Sheet columns:
    // Timestamp, First Name, Last Name, Full Name, Father's Name, Phone Number, Email Address, Landmark, State, Pincode, Full Address, College Name, Branch, Student ID, Year of Pass, Interested Course, Course Start Date, Course End Date
    const orderedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      phone: formData.phone,
      email: formData.email,
      landmark: formData.landmark,
      state: formData.state,
      pincode: formData.pincode,
      fullAddress: formData.fullAddress,
      collegeName: formData.collegeName,
      branch: formData.branch,
      studentId: formData.studentId,
      yearOfPass: formData.yearOfPass,
      interestedCourse: formData.interestedCourse,
      dateFrom: formData.dateFrom ? formData.dateFrom.toISOString().split('T')[0] : '',
      dateTo: formData.dateTo ? formData.dateTo.toISOString().split('T')[0] : ''
    };
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderedData),
      });

      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        fullName: '',
        fatherName: '',
        phone: '',
        email: '',
        landmark: '',
        state: '',
        pincode: '',
        fullAddress: '',
        collegeName: '',
        branch: '',
        studentId: '',
        yearOfPass: '',
        interestedCourse: '',
        dateFrom: undefined,
        dateTo: undefined
      });
      setErrors({});
      
    } catch (err) {
      console.error('Submission error:', err);
      // Show success popup even on catch (due to no-cors mode)
      setShowSuccessPopup(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        fullName: '',
        fatherName: '',
        phone: '',
        email: '',
        landmark: '',
        state: '',
        pincode: '',
        fullAddress: '',
        collegeName: '',
        branch: '',
        studentId: '',
        yearOfPass: '',
        interestedCourse: '',
        dateFrom: undefined,
        dateTo: undefined
      });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionIcon = ({ icon: Icon, gradient }: { icon: any, gradient: string }) => (
    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 hover:shadow-2xl`}>
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12 px-3 sm:px-4 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-orange-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-400/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-32 w-5 h-5 bg-green-400/40 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header with Logo */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
            <img 
              src="/shiftedutech-logo.png" 
              alt="ShiftEduTech Logo" 
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transform hover:scale-105 transition-all duration-300 drop-shadow-2xl filter brightness-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl items-center justify-center transform hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 px-4 leading-tight">
            Student Registration Form
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4 font-medium">
            Join our community of learners and unlock your potential with cutting-edge education
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Personal Information Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:bg-white/95">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <SectionIcon icon={User} gradient="from-blue-500 via-blue-600 to-blue-700" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Personal Information</h2>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl">Tell us about yourself</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.firstName}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.lastName}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  readOnly
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/90 backdrop-blur-sm text-gray-600 shadow-lg font-medium text-sm sm:text-base"
                  placeholder="Auto-generated from first and last name"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Father's Name *
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter father's name"
                />
                {errors.fatherName && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.fatherName}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:bg-white/95">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <SectionIcon icon={Phone} gradient="from-green-500 via-green-600 to-green-700" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Contact Information</h2>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl">How can we reach you?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.phone}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.email}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter nearby landmark"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your state"
                />
                {errors.state && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.state}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter 6-digit pincode"
                />
                {errors.pincode && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.pincode}</p>}
              </div>

              <div className="space-y-3 sm:col-span-2 lg:col-span-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Full Address *
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm resize-none shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your complete address with house number, street, area, city, like as Aadhaar Card..."
                />
                {errors.fullAddress && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.fullAddress}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:bg-white/95">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <SectionIcon icon={GraduationCap} gradient="from-purple-500 via-purple-600 to-purple-700" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Academic Information</h2>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl">Your educational background</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  College Name *
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your college name"
                />
                {errors.collegeName && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.collegeName}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Branch *
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your branch/stream"
                />
                {errors.branch && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.branch}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter your student ID"
                />
                {errors.studentId && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.studentId}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Year of Pass *
                </label>
                <input
                  type="text"
                  name="yearOfPass"
                  value={formData.yearOfPass}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base placeholder-gray-400"
                  placeholder="Enter year of passing (e.g., 2024)"
                />
                {errors.yearOfPass && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.yearOfPass}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Interested Course *
                </label>
                <select
                  name="interestedCourse"
                  value={formData.interestedCourse}
                  onChange={handleInputChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base text-gray-700"
                >
                  <option value="">Select a course</option>
                  <option value="C Language">C Language</option>
                  <option value="C++">C++</option>
                  <option value="Java Foundations">Java Foundations</option>
                  <option value="Core Java">Core Java</option>
                  <option value="Core & Advanced Java">Core & Advanced Java</option>
                  <option value="Full Stack Java">Full Stack Java</option>
                  <option value="Core Python">Core Python</option>
                  <option value="Core & Advanced Python">Core & Advanced Python</option>
                  <option value="Full Stack Python">Full Stack Python</option>
                  <option value="C & Data Structures">C & Data Structures</option>
                  <option value="Python with AWS">Python with AWS</option>
                  <option value="Python with Machine Learning">Python with Machine Learning</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="SQL-RLM Tool (Release Life Cycle Management)">SQL-RLM Tool (Release Life Cycle Management)</option>
                  <option value="Oracle DBMS">Oracle DBMS</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Data Analyst with Python">Data Analyst with Python</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Cloud Computing with DevOps">Cloud Computing with DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="CompTIA Cybersecurity">CompTIA Cybersecurity</option>
                  <option value="CompTIA Security+">CompTIA Security+</option>
                  <option value="CompTIA Cybersecurity Analyst (CySA+)">CompTIA Cybersecurity Analyst (CySA+)</option>
                  <option value="SOC Analyst">SOC Analyst</option>
                  <option value="PENETRATION TESTING">Penetration Testing</option>
                  <option value="Application Security Testing">Application Security Testing</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="API Testing">API Testing</option>
                  <option value="Selenium with Java">Selenium with Java</option>
                  <option value="Manual Testing">Manual Testing</option>
                  <option value="Full Stack Web Development">Full Stack Web Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Back-End Web Development">Back-End Web Development</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Business Process Management">Business Process Management</option>
                  <option value="Business Analysis Foundations">Business Analysis Foundations</option>
                  <option value="HR With Recruitment & Payroll">HR With Recruitment & Payroll</option>
                  <option value="Computer Networking & Hardware">Computer Networking & Hardware</option>
                  <option value="Machine Learning & Deep Learning">Machine Learning & Deep Learning</option>
                  <option value="Financial Accounting">Financial Accounting</option>
                  <option value="Masters of Biotechnology">Masters of Biotechnology</option>
                </select>
                {errors.interestedCourse && <p className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.interestedCourse}</p>}
              </div>
{/* Modern Sleek Date Inputs */}
<div className="space-y-3">
  <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
    <Calendar className="w-4 h-4 text-purple-600" />
    Course Start Date *
  </label>
  <div className="relative">
    <input
      type="date"
      name="dateFrom"
      value={formData.dateFrom ? formData.dateFrom.toISOString().split('T')[0] : ''}
      onChange={handleDateChange}
      className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base text-gray-700 hover:border-purple-300"
      style={{
        colorScheme: 'light',
      }}
    />
  
  </div>
  {errors.dateFrom && (
    <p className="text-red-500 text-sm font-medium flex items-center gap-2">
      <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      </span>
      {errors.dateFrom}
    </p>
  )}
</div>

<div className="space-y-3 mt-6">
  <label className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
    <Calendar className="w-4 h-4 text-purple-600" />
    Course End Date *
  </label>
  <div className="relative">
    <input
      type="date"
      name="dateTo"
      value={formData.dateTo ? formData.dateTo.toISOString().split('T')[0] : ''}
      onChange={handleDateChange}
      className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-medium text-sm sm:text-base text-gray-700 hover:border-purple-300"
      style={{
        colorScheme: 'light',
      }}
    />

  </div>
  {errors.dateTo && (
    <p className="text-red-500 text-sm font-medium flex items-center gap-2">
      <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      </span>
      {errors.dateTo}
    </p>
  )}
</div>

         
              
            </div>
          </div>

          {/* Enhanced Submit Button */}
          <div className="text-center pt-8 sm:pt-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white text-lg sm:text-xl lg:text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[200px] sm:min-w-[280px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-6 h-6" />
                    Submit Registration
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
             By submitting this form, you acknowledge and agree to our Terms and Conditions, and consent to the secure and confidential handling of your personal data in accordance with our Privacy Policy.
            </p>
          </div>
        </form>
        
        {/* Enhanced Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform animate-in zoom-in-95 duration-500 border border-gray-100">
              {/* Animated Header */}
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Registration Successful!</h3>
                  <div className="w-16 h-1 bg-white/40 rounded-full mx-auto"></div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Thank You for Registering with <span className="font-bold text-blue-600">ShiftEduTech</span>! 
                    Your Application has been Submitted Successfully.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
                  <p className="text-gray-600 text-sm">
                    📧 We'll contact you soon with course details and next steps
                  </p>
                </div>
                
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                >
                  <a href="https://shift.melmaa.tech/" className="block w-full h-full">
                    Continue Exploring
                  </a>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}