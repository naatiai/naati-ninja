// page-logic.tsx

export async function createUserMock(mockId: string) {
  try {
    // Call activate_mock API with the mockId
    const response = await fetch('/api/mocks/activate_mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mockId }),
    });

    // Parse response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user mock');
    }

    const data = await response.json();
    // console.log('API Response:', data);

    return data; // { status: 'results' | 'testing', userMock: UserMock }
  } catch (error) {
    console.error('Error in creating UserMock:', error);
    throw error;
  }
}

export async function fetchUserMock(mockId: string) {
  try {
    // Call activate_mock API with the mockId
    const response = await fetch('/api/mocks/fetch_user_mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mockId }),
    });

    // Parse response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user mock');
    }

    const status = response.status
    const data = await response.json();

    return { data, status}; // { status: 'results' | 'testing', userMock: UserMock }
  } catch (error) {
    console.error('Error in fetch UserMock:', error);
    throw error;
  }
}
