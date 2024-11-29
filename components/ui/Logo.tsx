import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  isMobile?: boolean;
}

const Logo = ({ isMobile }: LogoProps) => {
  return (
    <Link href={'/'}>
      <div className="flex  items-center">
        <div className="flex justify-center items-center">
          <Image src="/logo.png" alt="S32 Logo" width={71} height={71} />
        </div>
        {!isMobile ? (
          <h1 className="shadows  text-primary text-[32px] sm:text-[35px]"></h1>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
