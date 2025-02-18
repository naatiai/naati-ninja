import Link from 'next/link';

const Hero = () => {
  return (
    <div className="container pt-[188px] md:pt-[300px] pb-[215px] sm:pb-[290px] px-[22px] sm:px-0 mx-auto text-center">
      <h2 className="text-center max-w-[867px] pb-5 sm:pb-7 text-[52px] sm:text-[100px] leading-[39.5px] tracking-[-1.04px] sm:leading-[75px] sm:tracking-[-2.74px] mx-auto sm:mt-12 mt-10">
        Master NAATI with AI-Powered Mock Tests
      </h2>
      <p className="text-xl sm:text-2xl pb-10 sm:pb-8 leading-[19px] sm:leading-[34.5px] w-[232px] sm:w-full tracking-[-0.4px] sm:tracking-[-0.6px] text-center mx-auto">
        Practice, perfect, and pass with real-world simulations tailored for
        your success.
      </p>
      <Link href={'/dashboard'}>
        <button className="bg-[#099f9e] hover:bg-[#0b8d8c] rounded-full sm:px-14 px-12 py-[2.5px] sm:py-4 text-white text-center text-xl sm:text-[30px] font-medium leading-[37px] tracking-[-0.3px]">
          Register for Free
        </button>
      </Link>
    </div>
  );
};

export default Hero;
