const { default: MyAppWrap } = require('../../AppWrap');
import JustificationPage from '../../../components/Justification/JustificationPage';

const Begruendungstexte = () => {
  return (
    <MyAppWrap>
      <JustificationPage />
    </MyAppWrap>
  );
};

export default Begruendungstexte;
