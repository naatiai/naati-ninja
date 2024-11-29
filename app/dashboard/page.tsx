'use client';

import { useState, useEffect } from 'react';
import DashboardClient from './dashboard-client';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 0, // Remove focus outline on modal
};

export default function Page() {
  const [mocksList, setMocksList] = useState([]);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    const fetchDocsList = async () => {
      try {
        const response = await fetch('/api/mocks/get_mocks');
        if (!response.ok) {
          throw new Error('Failed to fetch mocks');
        }
        const data = await response.json();
        setMocksList(data);
      } catch (error) {
        console.error('Error fetching Mocks:', error);
      }
    };

    fetchDocsList();

    const hasAcknowledgedDisclaimer = localStorage.getItem(
      'hasAcknowledgedDisclaimer',
    );
    if (!hasAcknowledgedDisclaimer) {
      setDisclaimerOpen(true);
    }
  }, []);

  const handleDisclaimerClose = () => {
    setDisclaimerOpen(false);
    localStorage.setItem('hasAcknowledgedDisclaimer', 'true');
  };

  return (
    <div>
      <DashboardClient mocksList={mocksList} />
      {/* <Modal
        open={disclaimerOpen}
        onClose={handleDisclaimerClose}
        aria-labelledby="disclaimer-title"
        aria-describedby="disclaimer-description"
      >
        <Box sx={modalStyle}>
          <Typography className="text-2xl leading-[1.1] tracking-tighter font-medium text-center">
            Disclaimer
          </Typography>
          <Typography className="mt-3 mb-5">
            S32 does not offer legal or financial advice. The information
            provided should be verified before making any financial or legal
            decisions. By contnuing, you agree to S32's Terms and Conditions.
            <br></br>
            To continue, please activate your Free Trial under the
            "Subscriptions" tab.
          </Typography>
          <button
            className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md hover:border-1 hover:rounded-lg bg-gradient-to-r from-[#099f9e] to-[#f7941e] hover:from-white hover:to-white hover:text-[#099f9e] transition ease-in-out duration-150 cursor-pointer text-white"
            onClick={handleDisclaimerClose}
          >
            Continue
          </button>
        </Box>
      </Modal> */}
    </div>
  );
}
