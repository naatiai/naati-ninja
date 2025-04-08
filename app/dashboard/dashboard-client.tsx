'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DashboardClient() {
  const router = useRouter();
  const [mocksList, setMocksList] = useState<any[]>([]);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedLanguage, setSelectedLanguage] = useState<string>('Hindi'); // Initial fallback, overridden by cookie

  const languages = ['Hindi', 'Tamil', 'Mandarin'];

  const getInitialLanguage = () => {
    if (typeof document !== 'undefined') {
      const cookieLang = document.cookie
        .split('; ')
        .find((row) => row.startsWith('selectedLanguage='))
        ?.split('=')[1];
      if (cookieLang && languages.includes(cookieLang)) {
        return cookieLang;
      }
    }
    return 'Hindi';
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    getInitialLanguage(),
  );

  const [isError, setIsError] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [customLanguage, setCustomLanguage] = useState<string>('');
  const suggestions: string[] = [
    'Arabic',
    'Bangla',
    'Bosnian',
    'Bulgarian',
    'Burmese',
    'Cantonese',
    'Croatian',
    'Czech',
    'Dari',
    'Dutch',
    'Dzongkha',
    'Filipino',
    'Finnish',
    'French',
    'German',
    'Greek',
    'Gujarati',
    'Hazaragi',
    'Hindi',
    'Hungarian',
    'Indonesian',
    'Igbo',
    'Italian',
    'Japanese',
    'Kannada',
    'Khmer',
    'Korean',
    'Lao',
    'Macedonian',
    'Malay',
    'Malayalam',
    'Mandarin',
    'Marathi',
    'Nepali',
    'Odia',
    'Pashto',
    'Persian',
    'Polish',
    'Portuguese',
    'Punjabi',
    'Romanian',
    'Russian',
    'Serbian',
    'Sinhalese',
    'Somali',
    'Spanish',
    'Swahili',
    'Tamil',
    'Telugu',
    'Thai',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Vietnamese',
    'Yoruba',
  ];

  useEffect(() => {
    document.cookie = `selectedLanguage=${selectedLanguage}; path=/; max-age=31536000`; // 1 year
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const res = await fetch('/api/mocks/get_mocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language: selectedLanguage }), // Send selected language
        });
        if (!res.ok) {
          throw new Error('Failed to fetch mocks');
        }
        const data = await res.json();
        setMocksList(data);
      } catch (error) {
        console.error('Error fetching mocks:', error);
      }
    };

    fetchMocks();
  }, [selectedLanguage]); // Re-fetch mocks whenever the language changes

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch('/api/subscriptions/get');
        if (!res.ok) {
          throw new Error('Failed to fetch subscription');
        }
        const subscription = await res.json();
        setSub(subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchSubs();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-300';
    }
  };

  const handleCustomLanguageSubmit = async (): Promise<void> => {
    if (!customLanguage.trim()) return;

    try {
      const response = await fetch('/api/mocks/request_language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: customLanguage }),
      });

      if (response.ok) {
        console.log('Language request submitted:', customLanguage);
        setSelectedLanguage(customLanguage);
        setSubmissionStatus(true);
        setIsError(false);
      } else {
        console.error('Error submitting language request');
        setSubmissionStatus(true);
        setIsError(true);
      }
    } catch (error) {
      console.error('Request failed', error);
      setSubmissionStatus(true);
      setIsError(true);
    } finally {
      setShowInput(false);
      setCustomLanguage('');

      // Reset message after 3 seconds
      setTimeout(() => {
        setSubmissionStatus(false);
      }, 3000);
    }
  };
  return (
    <>
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <p className="text-center mt-4 text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
              Select a Mock Test from the List below to get started
            </p>

            <div className="flex flex-col items-center space-y-4 mb-6">
              {/* Language Selection */}
              <div className="flex justify-center space-x-4">
                {languages.map((lang: string) => (
                  <label
                    key={lang}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang}
                      checked={selectedLanguage === lang}
                      onChange={() => setSelectedLanguage(lang)}
                      className="form-radio text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {lang}
                    </span>
                  </label>
                ))}
              </div>

              {/* Can't find your language? */}
              {!submissionStatus ? (
                <button
                  onClick={() => setShowInput((prev) => !prev)}
                  className="mt-2 mb-2 underline text-blue-600 text-sm hover:underline"
                >
                  Can’t find your language?
                </button>
              ) : (
                <p
                  className={`mt-2 mb-2 text-sm ${
                    isError ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {isError
                    ? 'Error submitting request. Please contact us at support@naatininja.com'
                    : 'We have received your request and will be in touch shortly!'}
                </p>
              )}

              {/* Custom Language Input */}
              {showInput && (
                <div className="flex flex-col items-center space-y-2">
                  <input
                    type="text"
                    list="language-suggestions"
                    value={customLanguage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCustomLanguage(e.target.value)
                    }
                    placeholder="Request Language"
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="language-suggestions">
                    {suggestions.map((lang: string) => (
                      <option key={lang} value={lang} />
                    ))}
                  </datalist>

                  <button
                    onClick={handleCustomLanguageSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mocksList &&
                mocksList.map((mock: any) => (
                  <div
                    key={mock.id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden relative mt-2"
                  >
                    {/* Difficulty Tag at top-left */}
                    <div className="absolute top-3 left-3 sm:top-2 sm:left-2">
                      <span
                        className={`text-xs sm:text-sm font-semibold rounded-full px-2 py-1 flex justify-center items-center sm:items-start sm:justify-start sm:w-auto ${getDifficultyColor(
                          mock.difficulty,
                        )}`}
                      >
                        {mock.difficulty}
                      </span>
                    </div>

                    {/* Language Tag */}
                    <div className="absolute top-3 right-3 sm:top-2 sm:right-2">
                      <span className="text-xs sm:text-sm font-semibold text-blue-800 bg-blue-100 border border-blue-300 rounded-full px-2 py-1 flex justify-center items-center sm:items-start sm:justify-end sm:w-auto">
                        {mock.language}
                      </span>
                    </div>

                    <div className="flex flex-col h-full">
                      <div className="text-center p-4 mt-5">
                        <h5 className="text-xl font-semibold">{mock.name}</h5>
                        <p className="text-gray-600">
                          {mock.description.toString()}
                        </p>
                      </div>
                      <div className="flex-grow" />
                      <div className="border-t border-gray-200">
                        <div className="flex justify-between items-center p-4">
                          <div className="flex items-center space-x-2">
                            <Image
                              src="/hourglass.svg"
                              alt="Duration"
                              width={24}
                              height={24}
                            />
                            <span className="text-gray-600 text-sm">
                              Duration: <br /> {mock.time_duration} mins
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src="/ques-ans.svg"
                              alt="Duration"
                              width={31}
                              height={24}
                            />
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
