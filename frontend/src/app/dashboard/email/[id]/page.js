const { default: MyAppWrap } = require("../../../AppWrap");
import EmailPage from "../../../../components/email/EmailPage";

const Email = () => {
  return (
    <MyAppWrap>
      <EmailPage />
    </MyAppWrap>
  );
};

export default Email;
