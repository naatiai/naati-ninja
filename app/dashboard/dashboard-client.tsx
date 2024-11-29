'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardClient({ mocksList }: { mocksList: any }) {
  const router = useRouter();
  const [sub, setSub] = useState(null); // Initial state set to null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch('/api/subscriptions/get');
        if (!res.ok) {
          throw new Error('Failed to fetch sub');
        }
        const subscription = await res.json();
        setSub(subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchSubs();
  }, []);

  const handleEvent = () => {
    setLoading(true);
    // Simulate a loading process (replace with actual logic)
    setTimeout(() => {
      setLoading(false);
      // You can add your actual functionality here
      console.log('Mock started');
    }, 3000); // simulate a 3-second loading time
  };

  return (
    <>
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <p className="text-center mt-4 text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
              Select a Mock Test from the List below to get started
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mocksList &&
                mocksList.map((mock: any) => (
                  <div
                    key={mock.id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden relative"
                  >
                    <div className="absolute top-3 right-3 sm:top-2 sm:right-2">
                      <span className="text-xs sm:text-sm font-semibold text-green-800 bg-green-100 border border-green-300 rounded-full px-2 py-1 flex justify-center items-center sm:items-start sm:justify-end sm:w-auto">
                        {mock.language}
                      </span>
                    </div>

                    <div className="flex flex-col h-full">
                      <div className="text-center p-4">
                        <h5 className="text-xl font-semibold">{mock.name}</h5>
                        <p className="text-gray-600">
                          {mock.description.toString()}
                        </p>
                      </div>
                      <div className="flex-grow" />
                      <div className="border-t border-gray-200">
                        <div className="flex justify-between items-center p-4">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 10l4 4-4 4M7 10l-4 4 4 4" />
                            </svg>
                            <span className="text-gray-600 text-sm">
                              Duration: <br /> {mock.time_duration} mins
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 7V3m0 18v-4m4-7h4m-4 0h-4m0 4H3m9 0h-4" />
                            </svg>
                            <span className="text-gray-600 text-sm">
                              Questions: <br /> {mock.no_of_qa}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center mt-4 mb-3">
                          {loading ? (
                            <button
                              disabled
                              className="inline-flex items-center shadow rounded-md cursor-not-allowed"
                            >
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md text-black transition ease-in-out duration-150 cursor-not-allowed"
                              >
                                <svg
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Loading...
                              </button>
                            </button>
                          ) : (
                            <button
                              className={`text-white inline-flex items-center px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md transition ease-in-out duration-150 cursor-pointer ${
                                mock.userMockId
                                  ? 'bg-[#099f9e] hover:bg-white hover:text-[#099f9e] border-2'
                                  : 'bg-gradient-to-r from-[#0b8d8c] to-[#f77a1b] hover:from-white hover:to-white hover:text-[#099f9e] border-2'
                              }`}
                              onClick={() => {
                                setLoading(true);
                                router.push(`/mock-test/${mock.id}`);
                              }}
                            >
                              {mock.userMockId ? 'Review Mock' : 'Start Mock'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
