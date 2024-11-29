import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

export default function SubClient() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [sliderValue, setSliderValue] = useState(0);
  const [payLink, setPayLink] = useState('');
  const [advisorText, setAdvisorText] = useState('1 mock');
  const [price, setPrice] = useState({
    currency: '$',
    amount: '5',
  });

  const priceInput: any = {
    0: '1 mock',
    1: '5 mocks',
    2: '10 mocks',
    3: '13 mocks',
    4: '35 mocks',
  };

  const priceOutput: any = {
    0: ['$', '5', ''],
    1: ['$', '20', ''],
    2: ['$', '40', ''],
    3: ['$', '50', ''],
    4: ['$', '101', ''],
  };

  useEffect(() => {
    setAdvisorText(priceInput[sliderValue]);
    setPrice({
      currency: priceOutput[sliderValue][0],
      amount: priceOutput[sliderValue][1],
    });
    setPayLink(priceOutput[sliderValue][2]);
  }, [sliderValue]);

  const handleChange = (e: any) => {
    setSliderValue(Number(e.target.value));
  };

  return (
    <div className="mx-auto flex flex-col gap-4 container mt-10">
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
            <div className="text-3xl font-medium text-gray-500">
              <span>{price.currency}</span>
              <span>{price.amount}</span>
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
            <button
              className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md hover:border-1 hover:rounded-lg bg-gradient-to-r from-[#099f9e] to-[#f7941e] hover:from-white hover:to-white hover:text-[#099f9e] transition ease-in-out duration-150 cursor-pointer text-white"
              onClick={() => router.push(payLink)}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
