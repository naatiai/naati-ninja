import Logo from '../ui/Logo';
import Link from 'next/link';
import Image from 'next/image';
import Tooltip from '@mui/material/Tooltip';

const Footer = () => {
  return (
    <div className="border-t-[rgba(0,0,0,0.20)] border-t border-solid pt-4">
      <div className="container flex flex-col sm:flex-row justify-between items-center sm:h-[77px] pt-3 pb-6 sm:pt-0 px-2 sm:px-0 sm:space-y-0 space-y-4 mx-auto">
        <Logo />
        <div className="flex items-center gap-[22px] sm:gap-[39px]">
          <div className="flex space-x-4 pb-4 sm:pb-0">
            <Link
              href="https://naatininja.com/terms/"
              className="group"
              aria-label="Terms"
              target="_blank"
            >
              Terms
            </Link>
            <Link
              href="https://naatininja.com/privacy/"
              className="group"
              aria-label="Privacy"
              target="_blank"
            >
              Privacy
            </Link>
            <Tooltip title="Email Support">
              <Link
                href="mailto:support@naatininja.com"
                className="group flex items-center gap-2"
                aria-label="Contact Suppoer"
              >
                <Image
                  src="/mail-logo.svg"
                  alt="Contact Support"
                  width={27}
                  height={27}
                />
                Email Support
              </Link>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
