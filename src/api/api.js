export const login = async (email, password, loginType) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, loginType }), // Include loginType in the request body
  });

  if (!response.ok) {
    throw new Error(`Failed to login as ${loginType}`);
  }

  return response.json();
};

export const createUsersFromExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // Attach the Excel file

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/create-users-from-excel`, {
    method: 'POST',
    body: formData, // Send the file as FormData
  });

  if (!response.ok) {
    throw new Error('Failed to create users from Excel');
  }

  return response.blob(); // Return the response as a Blob for file download
};

export const resetpasswordfromexcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // Attach the Excel file

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/reset-password-from-excel`, {
    method: 'POST',
    body: formData, // Send the file as FormData
  });

  if (!response.ok) {
    throw new Error('Failed to reset password from Excel');
  }

  return response.blob(); // Return the response as a Blob for file download
}

export const createMiddleAdminsFromExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // Attach the Excel file

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/middle-admin/create-middle-admins`, {
    method: 'POST',
    body: formData, // Send the file as FormData
  });

  if (!response.ok) {
    throw new Error('Failed to create middle admins from Excel');
  }

  return response.blob(); // Return the response as a Blob for file download
};

// Fetch users assigned to a middle admin
export const getUsersByMiddleAdmin = async (middleAdminId, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc') => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/middle-admin/${middleAdminId}/users?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users by middle admin');
  }

  return response.json();
};

// Fetch device data for assigned IMEIs
export const getDeviceData = async (imei, limit = 50, from = 1, timezone = null) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/middle-admin/getdevicedata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imei, limit, from, timezone }), // Send IMEI directly in the body
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device data');
  }

  return response.json();
};

// Fetch users with pagination, sorting, and filtering (data sent in the request body)
export const fetchUsers = async (page = 1, limit = 10, sortBy = 'name', order = 'asc', search = '') => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/list/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit, sortBy, order, search }), // Send data in the request body
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

// Fetch device data based on multiple IMEI numbers
export const fetchDeviceData = async (imei, limit = 50, from = 1) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/device/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imei, limit, from }), // Pass IMEI as a single value
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device data');
  }

  return response.json();
};

// Fetch filtered device data based on multiple IMEI numbers, start date, and end date
export const fetchFilteredDeviceData = async (imei, startDate, endDate, page = 1, limit = 10) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/device/filtered-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imei, startDate, endDate, page, limit }), // Pass IMEI as a single value
  });

  if (!response.ok) {
    throw new Error('Failed to fetch filtered device data');
  }

  return response.json();
};

// Request a password reset
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send password reset email');
  }

  return response.json();
};

// Reset the password
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to reset password');
  }

  return response.json();
};

// Fetch and download filtered device data as a CSV file
export const downloadFilteredDeviceDataCSV = async (imei, startDate, endDate) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/device/downloadCSV`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imei, startDate, endDate }), // Pass IMEI as a single value
  });

  if (!response.ok) {
    throw new Error('Failed to download filtered device data as CSV');
  }

  // Parse the response as a Blob for file download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `filtered_device_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Edit user data
export const editUser = async (userId, userData) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/getuserbyid`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
};

// Change Password
export const changePassword = async (email, oldPassword, newPassword, confirmPassword) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, oldPassword, newPassword, confirmPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to change password');
  }

  return response.json();
};