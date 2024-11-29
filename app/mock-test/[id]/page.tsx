'use client';
import { useEffect, useState } from 'react';
import TestingClient from './testing-client';
import ResultsClient from './results-client';

interface UserMockData {
  id: string;
  mock_id: string;
  userId: string;
  attempts_allowed: number;
  attempts: number;
  total_score: number | null;
  passed: boolean | null;
  expired: boolean;
  created_on: any;
}

export default function Page({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<
    'loading' | 'testing' | 'results' | 'error'
  >('loading');
  const [userMock, setUserMock] = useState<UserMockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const response = await fetch('/api/mocks/fetch_user_mock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mockId: params.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user mock');
        }

        const { userId, userMock } = await response.json();

        if (response.status === 202) {
          setStatus('testing');
        } else if (response.status === 200) {
          setStatus('results');
          setUserMock(userMock);
          console.log('Fetched userMock:', userMock); // Debugging log
        } else {
          throw new Error('Unexpected status code');
        }
      } catch (error: any) {
        setStatus('error');
        setError(error.message || 'An unexpected error occurred');
        console.error(error);
      }
    }
    initialize();
  }, [params.id]);

  if (status === 'loading')
    return (
      <div className="p-10 mt-16 flex justify-center items-center flex-col">
        <h2 className="text-center text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
          Loading ...
        </h2>
      </div>
    );

  if (status === 'error')
    return (
      <div className="p-10 mt-16 flex justify-center items-center flex-col">
        <h2 className="text-center text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
          An error occurred while loading the mock
        </h2>
        <p className="text-center text-2xl text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-4 flex justify-center items-center flex-col">
      {userMock && status === 'results' && (
        <ResultsClient mockId={params.id} userMock={userMock} />
        // <p>UserMock should be valid</p>
      )}
      {status === 'testing' && (
        <h1 className="text-center text-5xl mb-5 font-bold">
          <TestingClient mockId={params.id} />
        </h1>
      )}
    </div>
  );
}
