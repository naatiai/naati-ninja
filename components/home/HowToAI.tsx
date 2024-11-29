import Image from 'next/image';

const HowToAI = () => {
  return (
    <div className="container pt-[55px] mx-auto pb-[53px] sm:pb-[174px] px-8 sm:px-0">
      <h2 className="text-center text-3xl sm:text-[60px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
        Powered by the best
      </h2>
      <p className="text-primary  text-center text-[17px] sm:text-3xl font-light sm:leading-[34.5px] sm:tracking-[-0.6px] leading-[22px] tracking-[-0.34px] max-w-[728px] mx-auto pb-[18px] sm:pb-11">
        Utilising the Best AI Tech for delivering Unmatched NAATI Prep
      </p>
      <div className="flex justify-center">
        <div className="shadow-[0px_0.5px_4px_0px_rgba(0,0,0,0.15)_inset] drop_shadow rounded-full flex items-center gap-[3px] sm:gap-2 py-0.5 sm:py-3 px-6">
          <Image
            src="/openai.svg"
            alt="OpenAI"
            width={73}
            height={73}
            className="w-[37px] h-[23px] sm:w-[73px] sm:h-[73px]"
          />
          <Image
            src="/meta_ai.png"
            alt="Meta AI"
            width={73}
            height={45}
            className="w-[37px] h-[23px] sm:w-[73px] sm:h-[45px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HowToAI;
