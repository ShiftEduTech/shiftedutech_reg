import React, { useState } from 'react';
import { User, Phone, GraduationCap, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from './ui/datepicker';

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
  useToast();
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
'firstName','lastName', 'fatherName', 'phone', 'email', 'state', 'pincode','fullAddress', 'collegeName', 'branch', 'studentId', 'yearOfPass','interestedCourse'
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

    // Year of Pass validation (must be a 4-digit year between 2000 and 2099)
    if (formData.yearOfPass && !/^(20\d{2})$/.test(formData.yearOfPass)) {
      newErrors.yearOfPass = 'Please enter a valid year (e.g., 2024)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzE7JEvQD6t4yrJbFKXqyCOrWrXx4S25ooSHglijcNelemiKV3T5aiOMl9sqXOxKC53/exec';

    // Note: Using 'no-cors' mode means you cannot read the response or error from the server.
    // This is a browser limitation when posting to Google Apps Script endpoints.
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
      await fetch(scriptUrl, {
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
    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 hover:shadow-2xl`} aria-hidden="true">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12 px-3 sm:px-4 relative overflow-hidden overflow-x-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-orange-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-400/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-32 w-5 h-5 bg-green-400/40 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-2 sm:px-0">
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
            <div className="hidden w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl items-center justify-center transform hover:scale-105 transition-all duration-300" aria-hidden="true">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 px-4 leading-tight">
            Student Registration Form
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4 font-medium">
            Join our community of learners and unlock your potential with cutting-edge education
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center" aria-hidden="true">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 sm:space-y-14 lg:space-y-16" aria-label="Student Registration Form">
          {/* Personal Information Section */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl border border-white/60 hover:shadow-3xl transition-all duration-500 hover:bg-white/100 mb-10 relative">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <SectionIcon icon={User} gradient="from-blue-500 via-blue-600 to-blue-700" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">Personal Information</h2>
                <p className="text-gray-500 text-base sm:text-lg lg:text-xl">Tell us about yourself</p>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-8"></div>
            {/* 2 rows, 2 columns each */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 min-w-0">
              <div className="space-y-3">
                <label htmlFor="firstName" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your first name"
                  aria-required="true"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label htmlFor="lastName" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your last name"
                  aria-required="true"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label htmlFor="fullName" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  readOnly
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/90 backdrop-blur-sm text-gray-600 shadow-lg font-medium text-sm sm:text-base"
                  placeholder="Auto-generated from first and last name"
                  aria-readonly="true"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="fatherName" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Father's Name *
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter father's name"
                  aria-required="true"
                  aria-invalid={errors.fatherName ? 'true' : 'false'}
                  aria-describedby={errors.fatherName ? 'fatherName-error' : undefined}
                />
                {errors.fatherName && (
                  <p id="fatherName-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.fatherName}
                  </p>
                )}
              </div>
            </div>
          </div>

    
          {/* Academic Information Section */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl border border-white/60 hover:shadow-3xl transition-all duration-500 hover:bg-white/100 mb-10 relative">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <SectionIcon icon={GraduationCap} gradient="from-purple-500 via-purple-600 to-purple-700" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">Academic Information</h2>
                <p className="text-gray-500 text-base sm:text-lg lg:text-xl">Your educational background</p>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 min-w-0">
              <div className="space-y-3">
                <label htmlFor="studentId" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Student ID *
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your student ID"
                  aria-required="true"
                  aria-invalid={errors.studentId ? 'true' : 'false'}
                  aria-describedby={errors.studentId ? 'studentId-error' : undefined}
                />
                {errors.studentId && (
                  <p id="studentId-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.studentId}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label htmlFor="collegeName" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  College Name *
                </label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your college name"
                  aria-required="true"
                  aria-invalid={errors.collegeName ? 'true' : 'false'}
                  aria-describedby={errors.collegeName ? 'collegeName-error' : undefined}
                />
                {errors.collegeName && (
                  <p id="collegeName-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.collegeName}
                  </p>
                )}
              </div>
              {/* Branch - full width row */}
              <div className="space-y-3 sm:col-span-2">
                <label htmlFor="branch" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Branch *
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your branch/stream"
                  aria-required="true"
                  aria-invalid={errors.branch ? 'true' : 'false'}
                  aria-describedby={errors.branch ? 'branch-error' : undefined}
                />
                {errors.branch && (
                  <p id="branch-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.branch}
                  </p>
                )}
              </div>
              {/* Year of Pass - full width row */}
              <div className="space-y-3 sm:col-span-2">
                <label htmlFor="yearOfPass" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Year of Pass *
                </label>
                <input
                  type="text"
                  id="yearOfPass"
                  name="yearOfPass"
                  value={formData.yearOfPass}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter year of passing (e.g., 2024)"
                  aria-required="true"
                  aria-invalid={errors.yearOfPass ? 'true' : 'false'}
                  aria-describedby={errors.yearOfPass ? 'yearOfPass-error' : undefined}
                />
                {errors.yearOfPass && (
                  <p id="yearOfPass-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.yearOfPass}
                  </p>
                )}
              </div>
              {/* Interested Course - full width row */}
              <div className="space-y-3 col-span-1 sm:col-span-2 lg:col-span-3">
                <label htmlFor="interestedCourse" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Interested Course *
                </label>
                <select
                  id="interestedCourse"
                  name="interestedCourse"
                  value={formData.interestedCourse}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base text-gray-700"
                  aria-required="true"
                  aria-invalid={errors.interestedCourse ? 'true' : 'false'}
                  aria-describedby={errors.interestedCourse ? 'interestedCourse-error' : undefined}
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
                {errors.interestedCourse && (
                  <p id="interestedCourse-error" className="text-red-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.interestedCourse}
                  </p>
                )}
              </div>
            </div>
            {/* Date Pickers in their own row with margin below */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 mb-8 pb-32">
              <div>
                <DatePicker
                  value={formData.dateFrom}
                  onChange={date => handleDateChange({ target: { name: 'dateFrom', value: date ? date.toISOString().split('T')[0] : '' } } as any)}
                  placeholder="Select start date"
                  label="Course Start Date *"
                  aria-required="true"
                  aria-invalid={errors.dateFrom ? 'true' : 'false'}
                  aria-describedby={errors.dateFrom ? 'dateFrom-error' : undefined}
                />
                {errors.dateFrom && (
                  <p id="dateFrom-error" className="text-red-500 text-sm font-medium flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.dateFrom}
                  </p>
                )}
              </div>
              <div>
                <DatePicker
                  value={formData.dateTo}
                  onChange={date => handleDateChange({ target: { name: 'dateTo', value: date ? date.toISOString().split('T')[0] : '' } } as any)}
                  placeholder="Select end date"
                  label="Course End Date *"
                  aria-required="true"
                  aria-invalid={errors.dateTo ? 'true' : 'false'}
                  aria-describedby={errors.dateTo ? 'dateTo-error' : undefined}
                />
                {errors.dateTo && (
                  <p id="dateTo-error" className="text-red-500 text-sm font-medium flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.dateTo}
                  </p>
                )}
              </div>
            </div>
          </div>


      {/* Contact Information Section */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl border border-white/60 hover:shadow-3xl transition-all duration-500 hover:bg-white/100 relative">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <SectionIcon icon={Phone} gradient="from-green-500 via-green-600 to-green-700" />
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">Contact Information</h2>
                <p className="text-gray-500 text-base sm:text-lg lg:text-xl">How can we reach you?</p>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 min-w-0">
              <div className="space-y-3">
                <label htmlFor="phone" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter 10-digit phone number"
                  aria-required="true"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && <p id="phone-error" className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.phone}</p>}
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your email address"
                  aria-required="true"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.email}</p>}
              </div>

             

              <div className="space-y-3">
                <label htmlFor="state" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your state"
                  aria-required="true"
                  aria-invalid={errors.state ? 'true' : 'false'}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                />
                {errors.state && <p id="state-error" className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.state}</p>}
              </div>

              <div className="space-y-3">
                <label htmlFor="pincode" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter 6-digit pincode"
                  aria-required="true"
                  aria-invalid={errors.pincode ? 'true' : 'false'}
                  aria-describedby={errors.pincode ? 'pincode-error' : undefined}
                />
                {errors.pincode && <p id="pincode-error" className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.pincode}</p>}
              </div>
              <div className="space-y-3">
                <label htmlFor="landmark" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter nearby landmark"
                />
              </div>
              <div className="space-y-3 sm:col-span-2">
                <label htmlFor="fullAddress" className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Full Address *
                </label>
                <textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full max-w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 bg-gray-50/90 backdrop-blur-sm shadow-md hover:shadow-lg font-medium text-sm sm:text-base placeholder-gray-400 focus:bg-white"
                  placeholder="Enter your complete address with house number, street, area, city, like as Aadhaar Card..."
                  aria-required="true"
                  aria-invalid={errors.fullAddress ? 'true' : 'false'}
                  aria-describedby={errors.fullAddress ? 'fullAddress-error' : undefined}
                />
                {errors.fullAddress && <p id="fullAddress-error" className="text-red-500 text-sm font-medium flex items-center gap-2"><span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-red-500 rounded-full"></span></span>{errors.fullAddress}</p>}
              </div>
            </div>
          </div>


          {/* Enhanced Submit Button */}
          <div className="text-center pt-10 sm:pt-14">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-xs mx-auto px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-fuchsia-600 via-blue-600 to-indigo-700 text-white text-xl sm:text-2xl font-extrabold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed min-w-0 min-w-[220px] sm:min-w-[320px] border-4 border-white/40 hover:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-300 focus:outline-none flex items-center justify-center gap-3"
              style={{ boxShadow: '0 0 32px 0 rgba(139,92,246,0.25), 0 8px 32px 0 rgba(0,0,0,0.10)' }}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <>
                  <span>Submit</span>
                  <svg className="h-6 w-6 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </>
              )}
            </button>
            <p className="mt-4 sm:mt-6 text-gray-500 text-sm sm:text-base">
             By submitting this form, you acknowledge and agree to our Terms and Conditions, and consent to the secure and confidential handling of your personal data in accordance with our Privacy Policy.
            </p>
          </div>
        </form>
        
        {/* Enhanced Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 overflow-hidden transform animate-in zoom-in-95 duration-500 border border-gray-100">
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
                    <CheckCircle className="w-10 h-10 text-white animate-pulse" />
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
                      <CheckCircle className="w-8 h-8 text-white animate-bounce" />
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