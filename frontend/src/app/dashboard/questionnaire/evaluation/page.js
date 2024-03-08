const { default: MyAppWrap } = require('../../../AppWrap');
import QuestionnairesEvaluation from './questionaireEvauluate.tsx';

const EvaluatePage = () => {
  return (
    <MyAppWrap>
      <QuestionnairesEvaluation />
    </MyAppWrap>
  );
};

export default EvaluatePage;
