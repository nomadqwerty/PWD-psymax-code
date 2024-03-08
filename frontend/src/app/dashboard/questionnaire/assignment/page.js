const { default: MyAppWrap } = require('../../../AppWrap');
import QuestionnaireAssignment from './Assigment';

const AssignmentPage = () => {
  return (
    <MyAppWrap>
      <QuestionnaireAssignment />
    </MyAppWrap>
  );
};

export default AssignmentPage;
