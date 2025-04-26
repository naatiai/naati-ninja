import Image from 'next/image';

const CTA = () => {
  return (
    <div className="container pt-[55px] mx-auto pb-[53px] sm:pb-[174px] px-8 sm:px-0">
      <h2 className="text-center text-3xl sm:text-[60px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
        As little as $5 / mock
      </h2>
      <p className="text-primary text-center text-[17px] sm:text-2xl font-light sm:leading-[34.5px] sm:tracking-[-0.6px] leading-[22px] tracking-[-0.34px] max-w-[728px] mx-auto pb-[18px] sm:pb-11">
        Currently supporting{'  '}
        <span className="underline pb-[66px] sm:pb-[174px] text-center text-3xl sm:text-3xl text_bg leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px]">
          Hindi, Tamil & Mandarin, Punjabi
        </span>
        {'  '}
        with more languages coming soon!
      </p>
    </div>
  );
};

export default CTA;
