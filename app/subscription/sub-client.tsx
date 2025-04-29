import { useEffect, useState } from 'react';

export default function SubClient() {
  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [advisorText, setAdvisorText] = useState('1 mock');
  const [price, setPrice] = useState({
    currency: '$',
    amount: '5',
    value: '5',
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [isOneDollarOfferLoading, setIsOneDollarOfferLoading] = useState(false);

  const priceInput: any = {
    0: '1 mock',
    1: '5 mocks',
    2: '10 mocks',
    3: '13 mocks',
    4: '35 mocks',
  };

  const priceIds: any =
    process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
      ? {
          0: 'price_1QVRAJB0tTO2dqMYUeT6OYmu',
          1: 'price_1QVRB5B0tTO2dqMYKDhN5PeA',
          2: 'price_1QVRBLB0tTO2dqMYudniKOa2',
          3: 'price_1QVRCAB0tTO2dqMYXKqt2KsJ',
          4: 'price_1QVRCdB0tTO2dqMY9wwOk0V9',
          oneDollar: 'price_1RJ2jYB0tTO2dqMYxWVUsfk5',
        }
      : {
          0: 'price_1QRLrOB0tTO2dqMYzlTWyQo0',
          1: 'price_1QRLwtB0tTO2dqMY42wYI1W0',
          2: 'price_1QRLySB0tTO2dqMYXG2BmLA1',
          3: 'price_1QRLzEB0tTO2dqMYdqecclS9',
          4: 'price_1QRM07B0tTO2dqMYd0CiGMC5',
          oneDollar: 'price_1RJ2AvB0tTO2dqMYP8SQ3DBj',
        };

  const priceOutput: any = {
    0: ['$', '5', '5'],
    1: ['$', '20', '4'],
    2: ['$', '40', '4'],
    3: ['$', '50', '3.8'],
    4: ['$', '101', '2.8'],
  };

  useEffect(() => {
    setAdvisorText(priceInput[sliderValue]);
    setPrice({
      currency: priceOutput[sliderValue][0],
      amount: priceOutput[sliderValue][1],
      value: priceOutput[sliderValue][2],
    });
  }, [sliderValue]);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await fetch('/api/subscriptions/get');
        const data = await res.json();
        setSubscription(data.subscription);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      }
    };
    fetchSub();
  }, []);

  const handleChange = (e: any) => {
    setSliderValue(Number(e.target.value));
  };

  const handlePayment = async () => {
    setLoading(true);
    const priceId = priceIds[sliderValue];

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
      console.error('Error initiating payment:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="mx-auto flex flex-col gap-4 container mt-10">
      {subscription &&
        subscription.mocks_available === 0 &&
        subscription.mocks_used === 1 &&
        subscription.payment_required && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 p-4 rounded-md mb-4 max-w-lg  mx-auto text-center">
            <p className="font-medium">
              Looks like you've taken a shot … but forgot to pay the bill 🍽️
            </p>
            <p className="font-medium">
              Grade this mock for just <strong>$1 </strong>
              and see how you really did!
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

      <div className="p-6 text-center">
        <h2 className="text-center text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg ">
          Pricing + Benefits
        </h2>

        <p className="text-gray-400">
          Use the slider to select your preferred number of mocks tests.
        </p>

        {/* Slider Section */}
        <div className="w-full max-w-md mx-auto">
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={sliderValue}
            onChange={handleChange}
            className="w-full appearance-none h-2 rounded-lg outline-none bg-gray-300
                   accent-blue-500"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                sliderValue * 25
              }%, #d1d5db ${sliderValue * 25}%, #d1d5db 100%)`,
            }}
          />
        </div>

        {/* Pricing Section */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="w-72 p-6 bg-white rounded shadow-md">
            <div className="mt-2 mb-2 text-gray-900 text-2xl font-semibold">
              {advisorText}
            </div>
            <div className="text-3xl font-medium text-gray-600">
              <span>{price.currency}</span>
              <span>{price.amount}</span>
            </div>
            <div className="text-sm mt-2 mb-4 text-gray-400">
              <span>
                {'( '}
                {price.currency}
                {price.value} / mock
                {' )'}
              </span>
            </div>
            <ul className="mt-4 text-gray-600 m-3 flex flex-wrap justify-center">
              <li className="flex items-center py-2">
                <span className="text-green-500 mr-2">✓</span>Complete NAATI CCL
                Prep
              </li>
              <li className="flex items-center py-2">
                <span className="text-green-500 mr-2">✓</span>Segment Specific
                Result
              </li>
              <li className="flex items-center py-2">
                <span className="text-green-500 mr-2">✓</span>
                Identical Exam Simulation
              </li>
              <li className="flex items-center py-2">
                <span className="text-green-500 mr-2">✓</span>
                Powered by AI
              </li>
            </ul>
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
                  className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md hover:border-1 hover:rounded-lg bg-gradient-to-r from-[#099f9e] to-[#f7941e] hover:from-white hover:to-white hover:text-[#099f9e] transition ease-in-out duration-150 cursor-pointer text-white"
                  onClick={handlePayment}
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
