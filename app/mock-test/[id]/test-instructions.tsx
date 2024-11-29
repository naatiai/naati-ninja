import React, { useState, useRef } from 'react';
// import Header from '@/components/ui/Header';
import { useRouter } from 'next/navigation';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

const TestInstructions: React.FC<{ proceedToNextStep: () => void }> = ({
  proceedToNextStep,
}) => {
  const [showTestAudio, setShowTestAudio] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // visualiser
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const startTestAudioRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        setIsRecording(false);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // 5 seconds recording
    } catch (error) {
      console.error('Audio access denied or error:', error);
      setIsRecording(false);
    }
  };

  const redirectToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div>
      <div className="text-left pl-4">
        {/* <Header /> */}
        <Tooltip title="Back to Dashboard">
          <CloseIcon
            onClick={redirectToDashboard}
            fontSize="large"
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
      </div>
      <div className="mx-auto w-4/5">
        <div className="text-lg space-y-2">
          {/* Step 1: Instructions */}
          {!showTestAudio ? (
            <>
              <ul className="list-disc pl-6 space-y-1">
                {/* Include detailed instructions here */}

                <div className="mx-auto w-4/5">
                  <h2 className="text-center text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
                    Instructions
                  </h2>
                  <div className="mb-5">
                    <iframe
                      width="100%"
                      height="315"
                      src="https://www.youtube.com/embed/ueBOKLl1LWE?si=ypNNERTeEjSzQBaL"
                      title="NAATI Mock Test Instructions Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="text-lg space-y-2">
                    <p className="text-center text-xl sm:text-[25px] font-normal tracking-[-0.6px] sm:tracking-[-1.2px] m-4 bg-clip-text text_bg">
                      Before starting the mock test, please read the following:
                    </p>
                    <div className="p-6 bg-white shadow-md rounded-lg">
                      {/* Preparation Checklist */}
                      <div className="mb-8">
                        <h3 className="text-center text-xl sm:text-[25px] font-normal leading-[52px]  tracking-[-0.6px] sm:tracking-[-1.2px] m-4 bg-clip-text text_bg">
                          Preparation Checklist
                        </h3>
                        <ul className="mb-10 list-disc pl-6 space-y-2 text-gray-700">
                          <li>
                            <strong className="text-gray-500">
                              Environment:
                            </strong>{' '}
                            Choose a quiet space where you won’t be interrupted.
                            Background noise or distractions can interfere with
                            your responses.
                          </li>
                          <li>
                            <strong className="text-gray-500">
                              Internet Connection:
                            </strong>{' '}
                            Ensure a stable, high-speed connection to avoid
                            issues with audio recording or interruptions.
                          </li>
                        </ul>

                        <div className="pt-5 border-t border-gray-200">
                          <h3 className="text-center text-xl sm:text-[25px] leading-[52px] font-normal tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg">
                            Audio Setup
                          </h3>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <ul className="list-disc pl-6 space-y-1">
                            <li>
                              <strong className="text-gray-500">
                                Headphones:
                              </strong>{' '}
                              Use headphones for clarity and to minimize echo or
                              feedback.
                            </li>
                            <li>
                              <strong className="text-gray-500">
                                Microphone Check:
                              </strong>{' '}
                              Ensure your microphone is connected and
                              functional. A quick test recording can help check
                              audio clarity.
                            </li>
                          </ul>
                          <li>
                            <strong className="text-gray-500">
                              Browser Permissions:
                            </strong>{' '}
                            Allow microphone access when prompted. If previously
                            blocked, update your browser settings to re-enable
                            permissions.
                          </li>
                        </ul>
                      </div>

                      <div className="border-t border-gray-200">
                        {/* Test Guidelines */}
                        <div className="mb-8">
                          <h3 className="text-center text-xl sm:text-[25px] leading-[52px] font-normal tracking-[-0.6px] sm:tracking-[-1.2px] m-4 bg-clip-text text_bg">
                            Test Guidelines
                          </h3>
                          <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>
                              <strong className="text-gray-500">
                                Recording Process:
                              </strong>{' '}
                              Each prompt records your response automatically
                              for 5 seconds. Start speaking as soon as you hear
                              the prompt.
                            </li>
                            <li>
                              <strong className="text-gray-500">
                                Stay on Page:
                              </strong>{' '}
                              Remain on this page until the test is complete.
                              Navigating away could interrupt the test and
                              require a restart.
                            </li>
                            <li>
                              <strong className="text-gray-500">
                                Playback Options:
                              </strong>{' '}
                              After each recording, you can replay or download
                              your audio to review your responses.
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-gray-200">
                        {/* Technical Support & Limitations */}
                        <div className="mb-8">
                          <h3 className="text-center text-xl sm:text-[25px] leading-[52px] font-normal tracking-[-0.6px] sm:tracking-[-1.2px] m-4 bg-clip-text text_bg">
                            Technical Support & Limitations
                          </h3>
                          <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>
                              <strong className="text-gray-500">
                                Device Limitations:
                              </strong>{' '}
                              The test relies on your device’s microphone and
                              audio setup. We are not responsible for issues due
                              to device limitations, blocked permissions, or
                              poor connections.
                            </li>
                            <li>
                              <strong className="text-gray-500">
                                Technical Issues:
                              </strong>{' '}
                              Ensure all checks are complete if issues arise.
                              Try reloading, switching browsers, or using
                              another device if needed.
                            </li>
                            <li>
                              <strong className="text-gray-500">
                                Support:
                              </strong>{' '}
                              If you encounter issues related to software that
                              prevent you from taking the test, please take a
                              screenshot of the issue and email us at
                              support@naatininja.com
                            </li>
                            <li>
                              <strong className="left-2 text-gray-500">
                                Disclaimer:
                              </strong>{' '}
                              This practice test is for preparation only and
                              does not guarantee a pass result on official NAATI
                              exams.
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="border-t border-gray-200">
                        {/* Proceed Button */}
                        <div className="text-center">
                          <p className="text-gray-500 mb-4">
                            By proceeding, you confirm that you understand and
                            accept these guidelines.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ul>
              <button
                onClick={() => setShowTestAudio(true)}
                className="mt-8 w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                Next
              </button>
            </>
          ) : (
            /* Step 2: Audio test */
            <>
              <h3 className="text-center text-3xl sm:text-[40px] font-normal leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text text_bg pb-3 sm:pb-[30px]">
                Test Your Audio
              </h3>
              <p className="text-center">
                Press "Record" to test your microphone. The recording will stop
                after 5 seconds.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={startTestAudioRecording}
                  disabled={isRecording || !!audioUrl}
                  className={`mt-3 w-full py-2 text-white rounded-lg shadow-lg duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/50 ${
                    isRecording
                      ? 'bg-red-600'
                      : audioUrl
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600'
                  }`}
                >
                  {isRecording ? 'Recording...' : 'Start Test Recording'}
                </button>
              </div>
              {audioUrl && (
                <div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={() => new Audio(audioUrl).play()}
                      className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg shadow-lg duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/50"
                    >
                      Play Test Audio
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setAudioUrl(null); // Clear the audio from memory
                    proceedToNextStep();
                  }}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                >
                  Proceed to Start Test
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;
