const { default: MyAppWrap } = require("../../AppWrap");
import DocumentTemplatePage from "@/components/documentTemplate/DocumentTemplatePage";

const Dokumentenvorlage = () => {
  return (
    <MyAppWrap>
      <DocumentTemplatePage />
    </MyAppWrap>
  );
};

export default Dokumentenvorlage;
