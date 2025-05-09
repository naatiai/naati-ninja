'use client';

import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useRouter } from 'next/navigation';

interface ResultsClientProps {
  mockId: string;
  userMock: {
    id: string;
    mock_id: string;
    userId: string;
    attempts_allowed: number;
    attempts: number;
    total_score: number | null;
    passed: boolean | null;
    expired: boolean;
    created_on: any;
    needs_payment_before_grading?: boolean; // Added property
  };
}

interface MockData {
  name: string;
  description: string;
}

interface QuestionAnswerData {
  questionId: string;
  questionTranscript: string;
  answerTranscript: string;
  isCorrect: boolean | null;
  score: number | null;
  max_score: number | null;
  created_on: string | null;
}

export default function ResultsClient({
  mockId,
  userMock,
}: ResultsClientProps) {
  const [mockData, setMockData] = useState<MockData | null>(null);
  const [resultsData, setResultsData] = useState<QuestionAnswerData[]>([]);
  const [isOneDollarOfferLoading, setIsOneDollarOfferLoading] = useState(false);

  const router = useRouter();
  const redirectToDashboard = () => {
    router.push('/dashboard');
  };

  const priceIds: any =
    process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
      ? {
          oneDollar: 'price_1RJ2jYB0tTO2dqMYxWVUsfk5',
        }
      : {
          oneDollar: 'price_1RJ2AvB0tTO2dqMYP8SQ3DBj',
        };

  useEffect(() => {
    // Fetch mock information
    async function fetchMockData() {
      try {
        const response = await fetch(`/api/mocks/get_mock_from_id`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mockId: mockId }),
        });
        const data = await response.json();
        setMockData(data);
        console.log('Fetched mock data:', data); // Debugging log
      } catch (error) {
        console.error('Error fetching mock data:', error);
      }
    }

    // Fetch question and answer results
    async function fetchResultsData() {
      try {
        // console.log(mockId, userMock.id);
        const response = await fetch(`/api/mocks/get_result_data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mock_id: mockId, user_mock_id: userMock.id }),
        });
        const data = await response.json();

        // Verify if the data is an array; if not, set an empty array
        setResultsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching results data:', error);
        setResultsData([]); // Ensure resultsData is always an array
      }
    }

    fetchMockData();
    fetchResultsData();
  }, [mockId, userMock.id]);

  const handleOneDollarPayment = async () => {
    setIsOneDollarOfferLoading(true);
    const priceId = priceIds.oneDollar;

    try {
      const response = await fetch('/api/subscriptions/create_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) throw new Error('Failed to create a checkout session.');

      const { url } = await response.json();
      if (url) {
        window.open(url, 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error initiating $1 grading payment:', error);
    } finally {
      setIsOneDollarOfferLoading(false);
    }
  };

  return (
    <div className="p-10 mt-10">
      <div className="text-left pl-4">
        {/* <Header /> */}
        <Tooltip title="Back to Dashboard">
          <KeyboardBackspaceIcon
            onClick={redirectToDashboard}
            fontSize="large"
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
      </div>
      <h2 className="text-center text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg ">
        Results
      </h2>
      <p className="text-center text-gray-700 font-normal text-sm mb-10">
        <b>Exam Date: </b>
        {userMock.created_on.split('T')[0]}
      </p>

      {userMock.needs_payment_before_grading && (
        <div className="mt-2 mb-10 bg-blue-100 border border-blue-400 text-blue-800 p-4 rounded-md max-w-lg  mx-auto text-center">
          <p className="font-medium">
            You’ve already taken the test, now it’s time to find out if you
            actually cleared it!
          </p>
          <p className="font-medium">
            Get your score breakdown and see where you shine or where you need
            a little polish ✨ 
          </p>
          <button
            onClick={handleOneDollarPayment}
            disabled={isOneDollarOfferLoading}
            className={`mt-3 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isOneDollarOfferLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-800 hover:to-emerald-800'
            }`}
          >
            {isOneDollarOfferLoading ? 'Processing...' : 'Get Results for $1'}
          </button>
        </div>
      )}

      {/* Mock Title and Status */}
      <div className="flex justify-between items-center mb-6">
        {mockData && (
          <div className="text-left">
            <h1 className="text-3xl font-bold mb-1">{mockData.name}</h1>
            <p className="text-gray-700">{mockData.description}</p>
          </div>
        )}
        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 rounded-full text-white ${
              userMock.passed ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {userMock.passed ? 'Passed' : 'Failed'}
          </span>
          <span className="mt-2 inline-block ml-3 px-3 py-1 rounded-full text-white bg-blue-500">
            {userMock.total_score
              ? `Score: ${userMock.total_score}%`
              : 'Unmarked'}
          </span>
        </div>
      </div>

      {/* Question and Answer Report */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Question</th>
                <th className="py-2 px-4 border-b border-gray-200">
                  Your Answer
                </th>
                <th className="py-2 px-4 border-b border-gray-200">Score</th>
                <th className="py-2 px-4 border-b border-gray-200">Correct</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((result, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200">
                    {result.questionTranscript}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {result.answerTranscript}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className="inline-block px-2 py-1 text-black">
                      {result.score} / {result.max_score}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-white ${
                        result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {result.isCorrect ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-center text-gray-700 font-normal text-sm mt-5 mb-5 italic">
        <b>Disclaimer: </b>
        The scores provided are graded by AI and, while designed to be as
        accurate as possible, may occasionally be incorrect or inconsistent.
        Please use them as a guide for your practice and not as a definitive
        measure of your performance. For any issues please contact support.
      </p>
    </div>
  );
}
