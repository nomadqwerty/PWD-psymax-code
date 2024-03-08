import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/router';
import { Collapse } from '@mui/material';

import QuestionnaireExitPage from '../../components/questionnaire/filling/QuestionnaireExitPage';

import AccessCode from '../../components/questionnaire/filling/AccessCode';
import ConsentForm from '../../components/questionnaire/filling/ConsentForm';
import Questionnaire from '../../components/questionnaire/filling/Questionnaire';
import toast from 'react-hot-toast';
import QuestionnaireModel from '../../components/questionnaire/shared/QuestionnaireModel';

export interface QuestionnaireResponse {
  id: string;
  accessCode: string;
  isCompleted: boolean;
  questionnaire: QuestionnaireModel;
  klient: QuestionnaireModel['clientsAssigned'][0];
  user: string;
  responses: [
    {
      question: number;
      response: number;
    },
  ];
  creationDate: Date;
  lastUpdated: Date;
}

// total questionnaire pages
const TOTAL_PROGRESS = 3;

export interface Answer {
  questionId: number;
  answer: string;
  value: number;
}

const LogoSVG = (
  <svg
    className="mb-2"
    width="110"
    height="22"
    viewBox="0 0 110 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.717 10.0883C31.2285 9.41101 30.605 8.88999 29.8657 8.5383C29.12 8.1801 28.3036 7.84143 27.4294 7.52882C26.5552 7.21621 25.7324 6.96221 24.9931 6.77985C24.2474 6.5975 23.611 6.36304 23.1096 6.09601C22.5954 5.82248 22.3382 5.50987 22.3382 5.17121C22.3382 4.55249 22.6789 4.07055 23.3539 3.72538C24.016 3.38671 24.7553 3.21738 25.5524 3.21738C26.343 3.21738 27.0823 3.38671 27.7508 3.72538C28.4129 4.05753 28.7536 4.53295 28.7665 5.13864H31.9163C31.9099 3.80353 31.3056 2.60518 30.1293 1.58267C28.94 0.553658 27.4037 0.026123 25.5588 0.026123C23.7139 0.026123 22.1775 0.547146 20.9883 1.58267C19.8055 2.61169 19.2013 3.81655 19.2013 5.17121C19.2013 6.20022 19.5484 7.09247 20.2362 7.83493C20.924 8.57738 21.7726 9.14399 22.7625 9.52173C23.7525 9.89947 24.7488 10.2251 25.7324 10.4986C26.7159 10.7722 27.5644 11.0522 28.2587 11.3453C28.9658 11.6449 29.3193 11.9966 29.3193 12.4004C29.3193 13.0386 28.9208 13.5336 28.1429 13.8592C27.3716 14.1849 26.5037 14.3477 25.5588 14.3477C24.6138 14.3477 23.746 14.1849 22.9746 13.8592C22.2097 13.5336 21.8111 13.0516 21.7983 12.4329H18.6484C18.6613 13.7485 19.3041 14.9404 20.5641 15.9694C21.8368 17.0114 23.5146 17.5389 25.5524 17.5389C27.5901 17.5389 29.2679 17.0114 30.5407 15.9694C31.8135 14.9273 32.4563 13.729 32.4563 12.4004C32.4499 11.5407 32.1992 10.7657 31.717 10.0883Z"
      fill="#0E0E0E"
    />
    <path
      d="M8.67812 0C6.29967 0 4.23621 0.866196 2.54558 2.57905C0.854954 4.29191 0 6.38251 0 8.79223V21.3944H3.34911V15.7544C4.87903 16.9657 6.66608 17.5845 8.65883 17.5845C11.0437 17.5845 13.1072 16.7183 14.7978 15.0054C16.4884 13.2926 17.3498 11.202 17.3498 8.79223C17.3498 6.38251 16.4949 4.29191 14.8042 2.57905C13.12 0.872709 11.0566 0 8.67812 0ZM14.0071 8.79223C14.0071 10.2902 13.4993 11.5341 12.4451 12.5892C11.3973 13.6508 10.163 14.1653 8.67812 14.1653C7.1932 14.1653 5.95898 13.6508 4.91117 12.5892C3.86337 11.5276 3.34911 10.2902 3.34911 8.79223C3.34911 7.29429 3.85694 6.05036 4.91117 4.99529C5.95898 3.93371 7.1932 3.4192 8.67812 3.4192C10.163 3.4192 11.3973 3.93371 12.4451 4.99529C13.4993 6.05687 14.0071 7.29429 14.0071 8.79223Z"
      fill="#0E0E0E"
    />
    <path
      d="M66.4809 0C64.141 0 62.3346 0.937839 61.1133 2.79398C59.8855 0.944352 58.0856 0 55.7457 0C53.7658 0 52.0752 0.690353 50.7252 2.05152C49.3753 3.41269 48.6875 5.13206 48.6875 7.15753V17.3109H52.0366V7.15753C52.0366 6.11549 52.3902 5.2558 53.123 4.51986C53.8558 3.78392 54.7108 3.42571 55.7393 3.42571C56.7678 3.42571 57.6227 3.78392 58.3556 4.51986C59.0884 5.2558 59.4419 6.122 59.4419 7.15753V17.3109H62.791V7.15753C62.791 6.11549 63.1446 5.2558 63.8774 4.51986C64.6102 3.78392 65.4652 3.42571 66.4937 3.42571C67.5222 3.42571 68.3772 3.78392 69.11 4.51986C69.8428 5.2558 70.1964 6.122 70.1964 7.15753V17.3109H73.5455V7.15753C73.5455 5.12555 72.8641 3.41269 71.5077 2.05152C70.1514 0.690353 68.4608 0 66.4809 0Z"
      fill="#0E0E0E"
    />
    <path
      d="M83.7152 0C81.3368 0 79.2733 0.866196 77.5827 2.57905C75.8921 4.29191 75.0371 6.38251 75.0371 8.79223C75.0371 11.202 75.8985 13.2925 77.5891 15.0054C79.2797 16.7183 81.3496 17.5845 83.7281 17.5845C85.7208 17.5845 87.5079 16.9723 89.0378 15.7544V17.3109H92.3869V8.79223C92.3869 6.38251 91.532 4.29191 89.8413 2.57905C88.1571 0.872708 86.0937 0 83.7152 0ZM89.0442 8.79223C89.0442 10.2902 88.5364 11.5341 87.4822 12.5892C86.4344 13.6508 85.2002 14.1653 83.7152 14.1653C82.2303 14.1653 80.9961 13.6508 79.9483 12.5892C78.9005 11.5276 78.3862 10.2902 78.3862 8.79223C78.3862 7.29429 78.8941 6.05036 79.9483 4.99529C80.9961 3.93371 82.2303 3.4192 83.7152 3.4192C85.2002 3.4192 86.4344 3.93371 87.4822 4.99529C88.5364 6.05687 89.0442 7.29429 89.0442 8.79223Z"
      fill="#0E0E0E"
    />
    <path
      d="M40.7488 11.358C40.7488 11.3515 40.7424 11.3515 40.7424 11.345L36.3326 0.462158H32.3535L38.936 15.1354L35.8119 21.9999H39.611L48.9127 0.462158H45.1586L40.7488 11.358Z"
      fill="#0E0E0E"
    />
    <path
      d="M97.1756 0.273682H92.8301L98.7183 8.81842L100.885 5.65322L97.1756 0.273682Z"
      fill="#0E0E0E"
    />
    <path
      d="M105.654 11.0067L104.144 8.81842L105.654 6.61059L110 0.273682H105.744L99.8945 8.84447L105.776 17.3111H110L105.654 11.0067Z"
      fill="#0E0E0E"
    />
    <path
      d="M92.8301 17.311H97.1756L100.891 11.9705L98.7183 8.81836L92.8301 17.311Z"
      fill="#0E0E0E"
    />
  </svg>
);

const getClientResponse = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};

const QuestionnaireFilling = () => {
  const router = useRouter();

  const { codeSlug } = router?.query;

  const [currentPage, setCurrentPage] = useState(0);
  const [accessCode, setAccessCode] = useState('');
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireModel>(null);
  const [questionnaireResponse, setQuestionnaireResponse] =
    useState<QuestionnaireResponse>(null);

  const percentageComplete = (currentPage / TOTAL_PROGRESS) * 100;

  useEffect(() => {
    if (!codeSlug) return;

    setAccessCode(codeSlug[0]);
  }, [codeSlug]);

  const formSubmitHandler = async (answers: Answer[]) => {
    // required all fields: questionnaire, klient, user, accessCode, responses {questionId, answer}, isCompleted
    const clientResponseData = {
      questionnaire: questionnaire._id,
      klient: questionnaireResponse.klient,
      user: questionnaireResponse.user,
      accessCode: accessCode,
      responses: answers,
    };

    try {
      const response = await axiosInstance.put(
        '/questionnaire-responses',
        clientResponseData
      );

      toast.success(response.data.message);

      // move to next page
      handleNextQuestionnairePage();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleNextQuestionnairePage = (direction: 'next' | 'back' = 'next') => {
    setCurrentPage((prevStep) => {
      if (direction === 'next') {
        return prevStep + 1;
      } else {
        return prevStep - 1;
      }
    });
  };

  return (
    <div className="p-6 grid min-h-screen items-center">
      <div className="app-top-logo p-8 pb-0 fixed top-0 left-0 right-0 z-10 bg-white border-b-2 shadow-sm">
        {LogoSVG}

        {/* progress-bar */}
        <span className="absolute bottom-2 md:left-1/2 text-md right-8">
          {percentageComplete.toFixed(0)}%
        </span>
        <div
          className="h-1 mt-4 rounded-t-lg bg-slate-400 transition-all duration-600"
          style={{ width: `${percentageComplete}%` }}
        ></div>
      </div>

      <div>
        <Collapse in={currentPage == 0} mountOnEnter unmountOnExit>
          <AccessCode
            onNextQuestionnairePage={handleNextQuestionnairePage}
            accessCode={accessCode}
            setAccessCode={setAccessCode}
            setQuestionnaireResponse={setQuestionnaireResponse}
            setQuestionnaire={setQuestionnaire}
          />
        </Collapse>
        <Collapse in={currentPage === 1} mountOnEnter unmountOnExit>
          <ConsentForm onNextQuestionnairePage={handleNextQuestionnairePage} />
        </Collapse>
        <Collapse in={currentPage === 2} mountOnEnter unmountOnExit>
          <Questionnaire
            formSubmitHandler={formSubmitHandler}
            questions={questionnaire?.questions}
            scale={questionnaire?.scale}
            randomizeQuestions={questionnaire?.randomizeQuestions}
          />
        </Collapse>
        <Collapse in={currentPage === 3} mountOnEnter unmountOnExit>
          <QuestionnaireExitPage />
        </Collapse>
      </div>
    </div>
  );
};

export default QuestionnaireFilling;
