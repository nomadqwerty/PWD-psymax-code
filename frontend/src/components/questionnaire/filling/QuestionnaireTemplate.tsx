import React, { useState } from 'react';

import {
  Radio,
  FormHelperText,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  IconButton,
  TextField,
  Tooltip,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { useTheme } from '@emotion/react';

import {
  QuestionnaireQuestion,
  QuestionnaireScale,
} from '../shared/QuestionnaireModel';
import { Answer } from '../../../app/f/[...codeSlug]';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme: any = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

type QuestionnaireTemplateProps = {
  formSubmitHandler: (answers: Answer[]) => void;
  questions: QuestionnaireQuestion[];
  scale: QuestionnaireScale[];
};

const QuestionnaireTemplate: React.FC<QuestionnaireTemplateProps> = ({
  formSubmitHandler,
  questions,
  scale,
}) => {
  const [answers, setAnswers] = useState<Answer[]>(
    questions?.map((question) => ({
      questionId: question.id,
      answer: '',
      value: null,
    }))
  );

  let ratingQuestions: { index: number; question: QuestionnaireQuestion }[] =
    [];
  let nonRatingQuestions: { index: number; question: QuestionnaireQuestion }[] =
    [];

  questions.forEach((question, index) => {
    if (question.isRating) {
      ratingQuestions.push({ index, question });
    } else {
      nonRatingQuestions.push({ index, question });
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questions.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => {
    setPage(() => newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(() => parseInt(event.target.value, 10));
    setPage(() => 0);
  };

  const getCellColor = (questionIndex: number) => {
    if (!error) return 'inherit';
    return answers[questionIndex].answer === '' ? 'red' : 'inherit';
  };

  const answerChangeHandler = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isOpen?: boolean
  ) => {
    const newAnswers = [...answers];

    if (isOpen) {
      newAnswers[index].answer = event.target.value;
      newAnswers[index].value = null;
    } else {
      newAnswers[index].answer = event.target.name;
      newAnswers[index].value = +event.target.value;
    }

    setAnswers(() => [...newAnswers]);
  };

  const answersSubmitHandler = () => {
    const allAnswered = answers.every((answer) => answer.answer !== '');
    if (!allAnswered) return setError(() => true);

    setIsSubmitting(() => true);
    setError(() => false);

    // loop through each question, if it is to be recoded, recode it. Recoding just sets the value to the value at the same position in the reverse scale.
    const recodedAnswers = [...answers];
    questions.forEach((question, index) => {
      if (!question.isRating || !question.isRecoded || !answers[index].value)
        return;
      const scaleIndex = scale.findIndex(
        (scaleItem) => scaleItem.value === answers[index].value
      );
      const recodedValue = scale[scale.length - 1 - scaleIndex].value;
      recodedAnswers[index].value = recodedValue;
    });

    formSubmitHandler(recodedAnswers);
  };

  const getRadioCell = (
    scaleItem: QuestionnaireScale,
    questionIndex: number
  ) => (
    <TableCell align="center" key={scaleItem.value}>
      <Tooltip title={scaleItem.name} placement="left" arrow enterDelay={1000}>
        <Radio
          checked={answers[questionIndex].value == scaleItem.value}
          onChange={(event) => answerChangeHandler(questionIndex, event)}
          value={scaleItem.value}
          name={scaleItem.name}
          inputProps={{ 'aria-label': scaleItem.name }}
          style={{ color: getCellColor(questionIndex) }}
          className="interFonts"
        />
      </Tooltip>
    </TableCell>
  );

  return (
    <Box display={'flex'} flexDirection={'column'} gap={3}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {scale.map((scaleItem, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    fontFamily: 'inter Tight',
                  }}
                >
                  {scaleItem.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* table body, rating questions only */}
          <TableBody>
            {(rowsPerPage > 0
              ? ratingQuestions.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : ratingQuestions
            ).map(({ index, question }) => (
              <TableRow
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="interFonts text-md lg:text-[1rem]"
                  style={{ color: getCellColor(index) }}
                >
                  {question.question}
                </TableCell>

                {scale.map((scaleItem) => getRadioCell(scaleItem, index))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          {/* <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 30, 50, { label: 'All', value: -1 }]}
                colSpan={6}
                count={questions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter> */}
        </Table>

        {error && (
          <FormHelperText
            error
            className="font text-sm text-center p-4 interFonts"
          >
            Please answer all questions
          </FormHelperText>
        )}
      </TableContainer>

      {/* div with all non rating questions */}
      <div className="grid gap-8 mt-16">
        {nonRatingQuestions.map(({ index, question }) => (
          <div key={index} className="grid gap-6">
            {/* label as the question */}
            <InputLabel
              className="text-lg interFonts"
              htmlFor={`${index}`}
              style={{ color: getCellColor(index) }}
            >
              {question.fragetext || question.question}
            </InputLabel>
            <TextField
              fullWidth
              id={`${index}`}
              placeholder={question.question + '...'}
              multiline
              rows={6}
              maxRows={8}
              className="interFonts"
              value={answers[index].answer}
              onChange={(event) => answerChangeHandler(index, event, true)}
              style={{ outline: getCellColor(index) }}
            />
          </div>
        ))}
      </div>

      <LoadingButton
        loading={isSubmitting}
        loadingIndicator="Einreichen..."
        variant="text"
        onClick={answersSubmitHandler}
        className="py-3 px-12 mt-10 ml-auto self-end w-40 flex-none bg-gray-100 hover:bg-gray-200 interFonts"
      >
        Weiter
      </LoadingButton>
    </Box>
  );
};

export default QuestionnaireTemplate;
