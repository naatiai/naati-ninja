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
          <Image src="/logo.png" alt="Naati Ninja" width={101} height={101} />
        </div>
        {!isMobile ? (
          <h1 className="shadows  text-primary text-[32px] sm:text-[35px]"></h1>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
