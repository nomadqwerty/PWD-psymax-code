import { Grid } from '@mui/material';

import {
  QuestionnaireQuestion,
  QuestionnaireScale,
} from '../shared/QuestionnaireModel';
import QuestionnaireTemplate from './QuestionnaireTemplate';
import { Answer } from '../../../app/f/[...codeSlug]';

type AccessCodeProps = {
  formSubmitHandler: (answers: Answer[]) => void;
  questions: QuestionnaireQuestion[];
  scale: QuestionnaireScale[];
  randomizeQuestions: boolean;
};

const Questionnaire: React.FC<AccessCodeProps> = ({
  randomizeQuestions,
  formSubmitHandler,
  questions,
  scale,
}) => {
  const questionsShuffler = (questions: QuestionnaireQuestion[]) => {
    // Create a copy of the original array
    let questionsCopy = questions.slice();

    // Split the copy into subarrays based on the questions that have isRating == false
    let subarrays = questionsCopy.reduce(
      (acc, q) => {
        // If the question has isRating == false
        if (q.isRating === false) {
          // Push a new subarray with the question
          acc.push([q]);
        } else {
          // Push the question to the last subarray
          acc[acc.length - 1].push(q);
        }
        return acc;
      },
      [[]]
    );

    // Shuffle each subarray using the Array.sort() method
    subarrays.forEach((subarray) => {
      subarray.sort(() => Math.random() - 0.5);
    });

    // Concatenate the subarrays back into one array
    questionsCopy = subarrays.reduce((acc, subarray) => {
      return acc.concat(subarray);
    }, []);

    // Loop through the original array and the copy array
    for (let i = 0; i < questions.length; i++) {
      // If the question in the original array has isRating == false
      if (questions[i].isRating === false) {
        // Replace the question in the copy array with the question in the original array
        questionsCopy[i] = questions[i];
      }
    }

    return questionsCopy;
  };

  return (
    <div className="w-[90vw] sm:w-auto md:container md:mx-auto md:max-w-[1200px] py-20 grid items-center">
      <div className="grid gap-1">
        <Grid className="w-[90vw] sm:w-auto" spacing={6} zeroMinWidth>
          <Grid item xs={12}>
            <h3
              className="font-bold text-center text-2xl md:text-3xl flex-none mb-6 md:mb-10"
              style={{ fontFamily: 'inter Tight' }}
            >
              Fragebogendiagnostik
            </h3>
          </Grid>
          <Grid item xs={12}>
            <p className="text-md font-normal text-center md:text-lg w-fit max-w-2xl mx-auto flex-none mb-8 md:mb-16 interFonts">
              Bitte nehmen Sie sich ausreichend Zeit die Fragen zu beantworten.
              Ihr Fortschritt wird nicht gespeichert, Sie können den Fragebogen
              daher beliebig oft starten, bis Sie ihn vollständig bearbeitet
              haben.
            </p>
          </Grid>
          <Grid item xs={12}>
            <QuestionnaireTemplate
              formSubmitHandler={formSubmitHandler}
              questions={
                randomizeQuestions ? questionsShuffler(questions) : questions
              }
              scale={scale}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Questionnaire;
