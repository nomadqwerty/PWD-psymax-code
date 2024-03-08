const { default: MyAppWrap } = require('../../../../AppWrap');
import QuestionnaireEditDetail from './questionaire';

const QuestionnairePage = () => {
  return (
    <MyAppWrap>
      <QuestionnaireEditDetail />
    </MyAppWrap>
  );
};

export default QuestionnairePage;
