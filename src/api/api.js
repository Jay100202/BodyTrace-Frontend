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