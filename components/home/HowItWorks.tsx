import Image from 'next/image';
import Link from 'next/link';

const data = [
  {
    title: 'Select from 50+ Mocks Tests',
    description: 'Hear sentences in English and your chosen language.',
    image: '/test-list-icon.svg',
  },
  {
    title: 'Translate and Record Your Answers',
    description: 'Respond in real-time and record your interpretation.',
    image: '/translation-icon.svg',
  },
  {
    title: 'AI Grading and Instant Feedback',
    description: 'Get transcriptions and accuracy score report.',
    image: '/ai-grading-icon.svg',
  },
];

const HowToAI = () => {
  return (
    // <div
    //   id="how-it-works"
    //   className="xl:max-w-[1700px] xl:mx-auto container pt-9 sm:pt-[77px] pb-[100px] sm:pb-[264px] px-[30px] sm:px-0"
    // >
    <div className="container pt-[188px] md:pt-[300px] pb-[215px] sm:pb-[290px] px-[22px] sm:px-0 mx-auto text-center">
      <h3 className="pb-[66px] sm:pb-[174px] text-center text-3xl sm:text-[60px] text_bg leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px]">
        How it Works
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[64px] sm:gap-[112px] md:mx-20">
        {data.map((item, index) => (
          <div key={index} className="">
            <div className="flex justify-center items-center pb-2 sm:pb-[50px]">
              <Image
                src={item.image}
                alt="Step 1"
                width={62}
                height={62}
                className="w-6 sm:w-[62px] h-6 sm:h-[62px]"
              />
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-9">
              <h3 className="text-center text-primary text-2xl sm:text-5xl leading-[34.5px] tracking-[-1.2px]">
                {item.title}
              </h3>
              <p className="text-primary text-center text-[17px] sm:text-2xl leading-[20px] sm:leading-[34.5px] tracking-[-0.34px] sm:tracking-[-0.6px] pb-5 sm:pb-0 max-w-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToAI;
