const { default: MyAppWrap } = require("../../AppWrap");
import Servicespage from "@/components/Services/Servicespage";

const Leistungen = () => {
  return (
    <MyAppWrap>
      <Servicespage />
    </MyAppWrap>
  );
};

export default Leistungen;
