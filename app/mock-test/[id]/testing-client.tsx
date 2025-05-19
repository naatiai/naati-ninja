'use client';
import { useEffect, useState, useRef } from 'react';
import TestInstructions from './test-instructions';
import { saveRecordingToStorage } from './recording-helpers';
import { useRouter } from 'next/navigation';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

interface TestingClientProps {
  mockId: string;
  // userMockId: string;
}

declare global {
  interface Window {
    stopRecording?: () => void;
  }
}

const TestingClient: React.FC<TestingClientProps> = ({
  mockId,
  // userMockId,
}) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [mockDetails, setMockDetails] = useState<any>(null);
  // const [questionUrl, setQuestionUrl] = useState<string | null>(null);
  // const [userMockId, setUserMockId] = useState<string | null>(null);
  // const [quesId, setQuesId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [ansTime, setAnsTime] = useState(15);
  const [ansLanguage, setAnsLanguage] = useState('');
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Added uploading state
  const [isSavingAnswer, setIsSavingAnswer] = useState(false); // Added saving answer state
  const [userErrors, setUserErrors] = useState<string[]>([]); // State to store errors
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // For tracking audio element
  const [paymentRequired, setPaymentRequired] = useState(false);

  const router = useRouter();
  const redirectToDashboard = () => {
    router.push('/dashboard');
  };

  const playAudio = async (
    audioSrc: string,
    quesId: string,
    userMockId: string,
    answerTime: number, // New parameter
  ) => {
    const questionAudio = new Audio(audioSrc);
    audioRef.current = questionAudio;

    try {
      setAudioPlaying(true);
      await questionAudio.play();
      console.log('Audio started playing');
      questionAudio.onended = () => {
        console.log(
          `Audio finished playing, waiting 5 seconds before recording for ${answerTime} seconds`,
        );
        setTimeout(() => startRecording(quesId, userMockId, answerTime), 5000);
      };
    } catch (error: any) {
      console.error('Audio playback error:', error);
      setUserErrors((prev) => [
        ...prev,
        'Audio playback error: ' + error.message,
      ]);
      setAudioPlaying(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showInstructions && !isTestComplete) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showInstructions, isTestComplete]);

  const fetchMockDetails = async () => {
    try {
      console.log('Fetching mock details');
      const res = await fetch('/api/mocks/get_mock_from_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mockId }),
      });
      const data = await res.json();
      if (data) {
        // console.log('Mock details fetched:', data[0]);
        setMockDetails(data);
        // console.log('Setting userMockId', data[0].userMockId); // TOTEST
        // setUserMockId(data[0].userMockId);
      }
    } catch (error: any) {
      setUserErrors((prev) => [
        ...prev,
        'Error fetching mock details: ' + error.message,
      ]);
    }
  };

  const startTest = async () => {
    try {
      console.log('Starting the test');
      const res = await fetch('/api/mocks/activate_mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mockId }),
      });
      if (res.status !== 201) {
        throw new Error(
          'Your mock could not be activated. Please review your subscription or contact support.',
        );
      }
      const { status, userMock } = await res.json();
      if (mockId) {
        fetchMockDetails();
      }
      setShowInstructions(false);
      fetchNextQuestion(true, userMock.id); // True indicates first time fetching question
    } catch (error: any) {
      setUserErrors((prev) => [...prev, '' + error.message]);
    }
  };

  const debounceFetchNextQuestion = async (userMockId: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchNextQuestion(false, userMockId); // False for normal fetch, not first-time
    }, 500); // Set debounce delay (500ms)
  };

  const fetchNextQuestion = async (
    isFirstTime: boolean,
    userMockId: string,
  ) => {
    if (isFetchingQuestion || audioPlaying) return;

    try {
      setIsFetchingQuestion(true);
      const questionRes = await fetch('/api/mocks/get_question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mockId, questionNumber }),
      });

      if (questionRes.status === 202) {
        console.log('Test completed');
        setIsTestComplete(true);
        return;
      }

      const questionData = await questionRes.json();
      setIsFetchingQuestion(false);
      setAnsLanguage(questionData.answer_language);
      setAnsTime(questionData.answer_time);

      if (questionData.audio_file_url) {
        if (isFirstTime) {
          setIsTestStarted(true);
        }

        const beepAudio = new Audio('/audio/beep.wav');
        beepAudio.play();
        console.log('Playing beep sound');

        beepAudio.onended = () => {
          console.log('Beep sound ended, waiting 2 seconds');
          setTimeout(
            () =>
              playAudio(
                questionData.audio_file_url,
                questionData.id,
                userMockId,
                questionData.answer_time, // Pass answer time to audio playback
              ),
            2000,
          );
        };
      }
    } catch (error: any) {
      setUserErrors((prev) => [
        ...prev,
        'Error fetching next question: ' + error.message,
      ]);
    }
  };

  const startRecording = (
    quesId: string,
    userMockId: string,
    answerTime: number,
  ) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Media Devices API not supported in this browser.');
      setUserErrors((prev) => [
        ...prev,
        'Recording not supported in this browser.',
      ]);
      return;
    }

    setIsRecording(true);
    console.log(`Recording started with answer time: ${answerTime} seconds`);
    const beepAudio = new Audio('/audio/beep.wav');
    beepAudio.play();

    // Access the microphone stream
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm; codecs=opus',
        });

        const chunks: Blob[] = []; // Array to store recorded data chunks
        let recordingTimeout: NodeJS.Timeout;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data); // Collect chunks of recording data
          }
        };

        const stopRecording = () => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            clearTimeout(recordingTimeout);
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        mediaRecorder.onstop = () => {
          console.log('Recording ended');
          setIsRecording(false);
          const recordingBlob = new Blob(chunks, {
            type: 'audio/webm; codecs=opus',
          });
          handleRecordingEnd(recordingBlob, quesId, userMockId);
        };

        mediaRecorder.start(); // Start recording

        // Stop recording after specified answer time
        recordingTimeout = setTimeout(() => {
          stopRecording();
        }, answerTime * 1000);

        // Expose stop function to component state
        window.stopRecording = stopRecording;
      })
      .catch((error: any) => {
        console.error('Error accessing microphone:', error);
        setUserErrors((prev) => [
          ...prev,
          'Error accessing microphone: ' + error.message,
        ]);
        setIsRecording(false);
      });
  };

  const handleRecordingEnd = async (
    recordingBlob: Blob,
    quesId: string,
    userMockId: string,
  ) => {
    console.log('Saving recording');
    setIsUploading(true); // Set uploading state to true

    try {
      const recordingUrl = await saveRecordingToStorage(
        userMockId,
        questionNumber,
        recordingBlob,
      );
      setIsUploading(false); // Set uploading state to false
      await writeAnswerToDB(recordingUrl, quesId, userMockId);
    } catch (error: any) {
      setIsUploading(false); // Ensure uploading state is reset
      setUserErrors((prev) => [
        ...prev,
        'Error during upload: ' + error.message,
      ]);
    }
    await proceedToNextQuestion(userMockId);
  };

  const writeAnswerToDB = async (
    recordingUrl: string,
    quesId: string,
    userMockId: string,
  ) => {
    setIsSavingAnswer(true); // Set saving answer state to true
    try {
      // console.log('Writing answer to DB:', quesId, recordingUrl, userMockId);
      if (!quesId || !recordingUrl || !userMockId) {
        console.error(
          'quesId, recordingUrl or userMockId is null:',
          quesId,
          recordingUrl,
          userMockId,
        );
        return; // Exit if these values are not set
      }
      const res = await fetch('/api/mocks/write_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_file_url: recordingUrl,
          mock_question_id: quesId,
          userMockId: userMockId,
        }),
      });
      setIsSavingAnswer(false); // Reset saving answer state
      if (res.status === 202) {
        const data = await res.json();
        console.log('Test completed');
        setIsTestComplete(true);
        setPaymentRequired(data.payment_required || false);
        console.log('Payment required:', data.payment_required);
        return;
      }

      if (res.status === 200) {
        proceedToNextQuestion(userMockId);
      } else {
        throw new Error('Failed to Save Answer');
      }
    } catch (error: any) {
      setIsSavingAnswer(false); // Reset saving answer state
      setUserErrors((prev) => [
        ...prev,
        'Error saving answer: ' + error.message,
      ]);
    }
  };

  const proceedToNextQuestion = (userMockId: string) => {
    setQuestionNumber((prev) => prev + 1);
    console.log('Proceeding to next question');
    debounceFetchNextQuestion(userMockId); // Call with debounce to avoid re-fetching too fast
  };

  const handleProceedToNextStep = () => {
    setShowInstructions(false);
  };

  // Clear errors on button press or any API call that updates state
  const clearErrors = () => setUserErrors([]);

  return (
    <div className="flex-grow max-w-7xl mx-auto">
      {showInstructions ? (
        <TestInstructions proceedToNextStep={handleProceedToNextStep} />
      ) : (
        <>
          {!mockDetails ? (
            <div className="p-8 border-2 bg-white text-center shadow-lg rounded-lg overflow-hidden relative">
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
              <h2 className="text-center mt-4 text-3xl sm:text-[40px] font-semibold leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text pb-3 sm:pb-[30px]">
                Get Ready
              </h2>
              <p className="text-gray-700 font-normal text-2xl mt-2">
                Your test is about to start.
              </p>
              <p className="mt-5 text-gray-700 font-normal text-2xl">
                You will not be able to pause or exit. Please do not refresh the
                page until the test is completed.
              </p>
              <p className="text-gray-700 font-normal text-2xl mt-2">
                Ensure your browser has permission to access your microphone and
                play audio.
              </p>
              <p className="text-gray-700 font-normal text-2xl mt-2">
                Click the button below when you're ready.
              </p>
              <p className="text-gray-700 font-normal text-2xl mt-2">
                Good Luck!
              </p>
              <button
                onClick={startTest}
                className="mt-8 w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                Start Test
              </button>
            </div>
          ) : isTestStarted && !isTestComplete ? (
            <div className="mt-10 p-4 border-2 bg-white text-center shadow-lg rounded-lg overflow-hidden relative">
              <h2 className="text-center mt-4 text-3xl sm:text-[40px] font-semibold leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text pb-3 sm:pb-[30px]">
                {mockDetails.name}
                <p className="text-gray-700 font-normal text-xl">
                  Testing Language: {mockDetails.language}
                </p>
              </h2>
              <div className="border-t border-gray-200"></div>
              <p className="mt-5 text-gray-700 font-normal text-2xl">
                Segment {questionNumber}
              </p>
              <p className="text-gray-700 font-normal text-2xl">
                Record your Answer in {ansLanguage}
              </p>
              {isFetchingQuestion ? (
                <button className="w-full px-2 py-2 mt-4 text-white cursor-not-allowed rounded-md transition-all duration-200 bg-gray-500 hover:bg-gray-800">
                  Loading next question
                </button>
              ) : (
                <>
                  {timer > 0 && (
                    <div className="timer">
                      <p>Time Remaining: {timer}s</p>
                    </div>
                  )}
                  {/* <audio src={questionUrl} autoPlay /> */}
                  <button
                    className={`w-full px-2 py-2 mt-4 text-white cursor-not-allowed rounded-md transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500'
                        : 'bg-gray-400 hover:bg-blue-700 cursor-not-allowed'
                    }`}
                    // disabled={isRecording || isUploading || isSavingAnswer}
                    // onClick={isRecording ? handleRecordingEnd : startRecording}
                  >
                    {isRecording
                      ? 'Recording'
                      : audioPlaying
                      ? 'Playing Audio'
                      : 'Waiting'}
                  </button>
                  {/* <button
                    className={`w-full px-2 py-2 mt-4 text-white rounded-md transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500 cursor-pointer hover:bg-red-600'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={isRecording ? window.stopRecording : undefined}
                    disabled={!isRecording}
                  >
                    {isRecording
                      ? 'Stop Recording'
                      : audioPlaying
                      ? 'Playing Audio'
                      : 'Waiting'}
                  </button> */}
                  {isRecording && (
                    <p className="text-gray-700 font-normal text-sm">
                      Recording will automatically stop in {ansTime} seconds
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="mt-10 mb-10 p-8 border-2 bg-white text-center shadow-lg rounded-lg overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="absolute top-3 left-3 text-gray-600 hover:text-gray-900 text-xl"
              >
                ✕
              </button>

              <h2 className="text-center mt-4 text-3xl sm:text-[40px] font-semibold leading-[72px] tracking-[-0.6px] sm:tracking-[-1.2px] bg-clip-text pb-3 sm:pb-[30px]">
                Test Completed
              </h2>

              {paymentRequired ? (
                <>
                  <p className="text-gray-700 font-normal text-2xl mb-4">
                    Pay $1 to unlock your results and grading.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        const priceId =
                          process.env.NODE_ENV === 'production'
                            ? 'price_1RJ2AvB0tTO2dqMYP8SQ3DBj'
                            : 'price_1RJ2jYB0tTO2dqMYxWVUsfk5'; // Pick price based on env

                        const res = await fetch(
                          '/api/subscriptions/create_session',
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ priceId }),
                          },
                        );

                        if (!res.ok) {
                          throw new Error('Failed to initiate payment');
                        }

                        const data = await res.json();
                        if (data.url) {
                          window.location.href = data.url;
                        } else {
                          alert('Unexpected error. Please contact support.');
                        }
                      } catch (err) {
                        console.error('Stripe session error:', err);
                        alert('Failed to start payment. Please try again.');
                      }
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 mt-3 w-full py-2 text-white text-lg font-semibold rounded-lg shadow-lg duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/60"
                  >
                    Unlock Results for $1
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-700 font-normal text-2xl">
                    Grading is typically instant but can sometimes take between
                    2-4 hours for some tests. You will be notified by email
                    about accessing your results.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 mt-3 w-full py-2 text-white rounded-lg shadow-lg duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/50"
                  >
                    Back to Home
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
      {userErrors.length > 0 && (
        <div className="p-4 border-2 bg-white text-center shadow-lg rounded-lg overflow-hidden relative">
          <div className="text-1xl font-normal text-red-500 bg-red-100 p-4 mb-4">
            <ul>
              <li>
                <p className="text-gray-700 font-normal text-sm">
                  {userErrors[userErrors.length - 1]}
                </p>
              </li>
            </ul>
            <button
              onClick={clearErrors}
              className="font-normal text-sm text-blue-500"
            >
              Clear Errors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TestingClient;
