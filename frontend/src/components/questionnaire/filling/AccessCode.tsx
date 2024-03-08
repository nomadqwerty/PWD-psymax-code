import React, { Dispatch, SetStateAction, useState } from 'react';

import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import toast from 'react-hot-toast';

import QuestionnaireModel from '../shared/QuestionnaireModel';
import { QuestionnaireResponse } from '../../../app/f/[...codeSlug]';

import axiosInstance from '../../../utils/axios';

type AccessCodeProps = {
  onNextQuestionnairePage: (direction?: 'next' | 'back') => void;
  setAccessCode: Dispatch<SetStateAction<string>>;
  accessCode: string;
  setQuestionnaire: Dispatch<SetStateAction<QuestionnaireModel>>;
  setQuestionnaireResponse: Dispatch<SetStateAction<QuestionnaireResponse>>;
};

const AccessCode: React.FC<AccessCodeProps> = ({
  onNextQuestionnairePage: onNext,
  setAccessCode,
  accessCode,
  setQuestionnaire,
  setQuestionnaireResponse,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(() => e.target.value === '');
    setAccessCode(() => e.target.value);
  };

  const nextPageClickHandler = () => {
    if (!accessCode) {
      setError(true);
      toast.error('Bitte geben Sie Ihren Zugangscode ein.');
      return;
    }

    const fetchQuestionnaireResponse = async (accessCode: string) => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/questionnaire-responses/${accessCode}`
        );

        const questionnaireResponseData = response.data?.response;
        setQuestionnaireResponse(questionnaireResponseData);
        setQuestionnaire(questionnaireResponseData?.questionnaire);
        onNext();
      } catch (error) {
        setError(true);
        if (error.response.status === 404) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
      }
      setIsLoading(false);
    };

    try {
      fetchQuestionnaireResponse(accessCode);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="lg:container lg:mx-auto px-4 py-24 grid items-center">
      <Container maxWidth="xs">
        <Grid container spacing={4} zeroMinWidth textAlign={'center'}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              fontWeight={600}
              sx={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',
                wordBreak: 'break-word',

                '@media (max-width: 600px)': {
                  fontSize: 24,
                },
              }}
            >
              Fragebogendiagnostik
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              className="interFonts"
              sx={{
                fontSize: 16,

                '@media (max-width: 600px)': {
                  fontSize: 14,
                },
              }}
            >
              Falls Sie noch keinen Zugangscode erhalten haben kontaktieren Sie
              bitte Ihre Behandler:in.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="access-code"
              required
              fullWidth
              label="Wie lautet Ihr Zugangscode?"
              variant="outlined"
              color={error ? 'error' : 'primary'}
              focused={error}
              value={accessCode}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <button
              className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border interFonts md:py-4 bg-gray-100 rounded-sm w-full"
              onClick={nextPageClickHandler}
            >
              Beitreten
            </button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AccessCode;
