'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Subscription {
  id: string;
  userId: string;
  mocks_available: number;
  mocks_used: number;
  expires_on?: Date | string;
  created_on: Date | string;
}

const Tooltips: React.FC = () => {
  const [tooltip, setTooltip] = useState<number | null>(null);
  const [sub, setSub] = useState<Subscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch('/api/subscriptions/get');
        if (!res.ok) {
          throw new Error('Failed to fetch subscription');
        }
        const subscription = await res.json();
        setSub(subscription.subscription);
        // console.log(subscription.subscription)
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchSubs();
  }, []);

  const showTooltip = (flag: number) => setTooltip(flag);
  const hideTooltip = () => setTooltip(null);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleDateString();
  };

  return (
    <div className="">
      <div className="container mx-auto px-3 flex flex-col items-start pl-12 md:pl-0 md:items-center">
        <div className="flex-col md:flex-row flex items-center md:justify-center">
          <div
            role="button"
            tabIndex={0}
            aria-label="tooltip"
            className="focus:outline-none focus:ring-gray-300 rounded-full focus:ring-offset-2 focus:ring-2 focus:bg-gray-200 relative"
            onMouseEnter={() => showTooltip(3)}
            onFocus={() => showTooltip(3)}
            onMouseLeave={hideTooltip}
            onBlur={hideTooltip}
          >
            <div className="cursor-pointer">
              <svg
                aria-haspopup="true"
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-info-circle"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#A0AEC0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
                <polyline points="11 12 12 12 12 16 13 16" />
              </svg>
            </div>
            {tooltip === 3 && sub && (
              <div className="z-20 m-4 w-64 absolute transition duration-150 ease-in-out left-1/2 transform -translate-x-1/2 shadow-lg bg-gray-800 p-4 rounded">
                <svg
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2"
                  width="16px"
                  height="9px"
                >
                  <polygon points="8,0 16,9 0,9" fill="#2D3748" />
                </svg>
                <h2 className="text-white text-center mt-2 mb-2">
                  Your Subscription
                </h2>
                <p className="text-sm font-bold text-white pb-1">
                  Mocks Available: {sub.mocks_available}
                </p>
                <p className="text-sm font-bold text-white pb-1">
                  Mocks Used: {sub.mocks_used}
                </p>
                {/* <p className="text-sm font-bold text-white pb-1">
                  Expires: {formatDate(sub.expires_on)}
                </p> */}
              </div>
            )}
            {tooltip === 3 && !sub && (
              <div className="z-20 m-4 w-64 absolute transition duration-150 ease-in-out left-1/2 transform -translate-x-1/2 shadow-lg bg-gray-800 p-4 rounded">
                <svg
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2"
                  width="16px"
                  height="9px"
                >
                  <polygon points="8,0 16,9 0,9" fill="#2D3748" />
                </svg>
                <h2 className="text-white text-center mt-2 mb-2">
                  No Active Subscription
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltips;
