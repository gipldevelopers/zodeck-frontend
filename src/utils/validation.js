// // src/utils/validation.js - CORRECTED VERSION
// export const validateEmployeeForm = (formData, currentStep) => {
//   const errors = {};

//   // Step 1: Personal Information validation (ONLY validate fields that are in this step)
//   if (currentStep === 1) {
//     if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
//     if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    
//     // Remove email validation from Step 1 - it belongs to Step 2
//     // if (!formData.email?.trim()) errors.email = 'Email is required';
//     // else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    
//     // Only validate phone if it's actually in Step 1, otherwise remove this too
//     if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
//   }

//   // Step 2: Contact Information validation (THIS is where email should be validated)
//   if (currentStep === 2) {
//     // Add email validation here
//     if (!formData.email?.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.permanentAddress?.trim()) errors.permanentAddress = 'Permanent address is required';
//     if (!formData.currentAddress?.trim()) errors.currentAddress = 'Current address is required';
    
//     if (formData.emergencyContactPhone && !/^[0-9]{10}$/.test(formData.emergencyContactPhone)) {
//       errors.emergencyContactPhone = 'Emergency contact phone must be 10 digits';
//     }
//   }

//   return errors;
// };

// src\utils\validation.js
export const validateEmployeeForm = (formData, currentStep) => {
  const errors = {};

  console.log("============validation debug");
  console.log("step", currentStep);
  console.log("form data", formData);

  // Step 1: Personal Information
  if (currentStep === 1) {
    if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    
    // Validate age if date of birth is provided
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) errors.dateOfBirth = 'Employee must be at least 18 years old';
      if (age > 100) errors.dateOfBirth = 'Please enter a valid date of birth';
    }
  }

  // Step 2: Contact Information
  if (currentStep === 2) {
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }

    if (formData.alternatePhone && !isValidPhone(formData.alternatePhone)) {
      errors.alternatePhone = 'Alternate phone must be 10 digits';
    }

    if (!formData.permanentAddress?.trim()) {
      errors.permanentAddress = 'Permanent address is required';
    }

    if (!formData.emergencyContactName?.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }

    if (!formData.emergencyContactPhone?.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!isValidPhone(formData.emergencyContactPhone)) {
      errors.emergencyContactPhone = 'Emergency contact phone must be 10 digits';
    }
  }

  // Step 3: Professional Information - FIXED FIELD NAMES
  if (currentStep === 3) {
    if (!formData.employeeId?.trim()) errors.employeeId = 'Employee ID is required';
    if (!formData.departmentId) errors.departmentId = 'Department is required'; // FIXED: department → departmentId
    if (!formData.designationId) errors.designationId = 'Designation is required'; // FIXED: designation → designationId
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.employmentType) errors.employmentType = 'Employment type is required';
    
    // Validate joining date is not in the future
    if (formData.joiningDate && new Date(formData.joiningDate) > new Date()) {
      errors.joiningDate = 'Joining date cannot be in the future';
    }
  }

  // Step 4: Banking Information (optional in many cases)
  if (currentStep === 4) {
    // Only validate if any banking info is provided
    if (formData.bankName || formData.accountNumber || formData.ifscCode) {
      if (!formData.bankName?.trim()) errors.bankName = 'Bank name is required';
      if (!formData.accountNumber?.trim()) errors.accountNumber = 'Account number is required';
      if (!formData.ifscCode?.trim()) errors.ifscCode = 'IFSC code is required';
      if (!formData.accountHolderName?.trim()) errors.accountHolderName = 'Account holder name is required';
      
      if (formData.accountNumber && !/^\d{9,18}$/.test(formData.accountNumber)) {
        errors.accountNumber = 'Please enter a valid account number';
      }
      
      if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        errors.ifscCode = 'Please enter a valid IFSC code';
      }
    }
  }

  // Step 5: Documents
  if (currentStep === 5) {
    if (!formData.aadhaarNumber?.trim()) errors.aadhaarNumber = 'Aadhaar number is required';
    if (!formData.panNumber?.trim()) errors.panNumber = 'PAN number is required';
    
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
      errors.aadhaarNumber = 'Aadhaar must be 12 digits';
    }
    
    if (formData.panNumber && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.panNumber)) {
      errors.panNumber = 'Please enter a valid PAN number';
    }
  }

  return errors;
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};