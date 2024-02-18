const { default: MyAppWrap } = require("../../AppWrap");
import ClientPage from "@/components/client/ClientPage";

const Klientinnen = () => {
  return (
    <MyAppWrap>
      <ClientPage />
    </MyAppWrap>
  );
};

export default Klientinnen;
