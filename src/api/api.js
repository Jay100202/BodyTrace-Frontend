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

export const createUser = async (name, email, password, imei) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, imei }),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
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

// Fetch device data based on IMEI number
export const fetchDeviceData = async (imei) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/device/${imei}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device data');
  }

  return response.json();
};