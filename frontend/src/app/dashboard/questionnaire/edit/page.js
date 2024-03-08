const { default: MyAppWrap } = require('../../../AppWrap');
import QuestionnaireEditOverview from './edit';

const EditPage = () => {
  return (
    <MyAppWrap>
      <QuestionnaireEditOverview />
    </MyAppWrap>
  );
};

export default EditPage;
