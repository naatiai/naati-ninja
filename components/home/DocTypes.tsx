import Image from 'next/image';
import Link from 'next/link';

interface Feature {
  name: string;
  icon: string;
  content: string;
}

interface FeatureContent {
  title: string;
  features: Feature[];
}

const featureContent: FeatureContent = {
  title: 'The Best NAATI Exam Prep Simulation',
  features: [
    {
      name: 'Real-Exam Environment',
      icon: '/test-image.svg',
      content: 'Simulate exact NAATI CCL test conditions and formats.',
    },
    {
      name: 'Detailed Transcripts for Clarity',
      icon: '/ai-icon.svg',
      content:
        'Review every word to catch mispronunciations or unclear speech.',
    },
  ],
};

const DocTypes = () => {
  return (
    <>
      <div className="container pt-[188px] md:pt-[300px] pb-[215px] sm:pb-[290px] px-[22px] sm:px-0 mx-auto text-center">
        <div className="text-center mt-10">
          <h2 className="text-3xl sm:text-[60px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
            {featureContent.title}
          </h2>
        </div>
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-2">
          {featureContent.features.map((item, i) => (
            <div
              className="feature-card rounded-xl bg-white p-5 pb-8 text-center"
              key={`feature-${i}`}
            >
              {item.icon && (
                <Image
                  className="mx-auto"
                  src={item.icon}
                  width={55}
                  height={55}
                  alt={item.name}
                />
              )}
              <div className="flex flex-col items-center gap-1 sm:gap-9 mb-10">
                <h3 className="text-center text-primary text-2xl sm:text-5xl leading-[34.5px] tracking-[-1.2px]">
                  {item.name}
                </h3>

                <p className="text-primary text-center text-[17px] sm:text-2xl leading-[20px] sm:leading-[34.5px] tracking-[-0.34px] sm:tracking-[-0.6px] pb-5 sm:pb-0 max-w-sm">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link href={'/dashboard'}>
          <button className="bg-[#099f9e] hover:bg-[#0b8d8c] rounded-full sm:px-14 px-12 py-[2.5px] sm:py-4 text-white text-center text-xl sm:text-[30px] font-medium leading-[37px] tracking-[-0.3px]">
            Get Started
          </button>
        </Link>
      </div>
    </>
  );
};

export default DocTypes;
