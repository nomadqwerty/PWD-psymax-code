const { default: MyAppWrap } = require("../../../AppWrap");
import BriefPage from "../../../../components/brief/BriefPage";

const Brief = () => {
  return (
    <MyAppWrap>
      <BriefPage />
    </MyAppWrap>
  );
};

export default Brief;
