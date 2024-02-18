const { default: MyAppWrap } = require("../../../AppWrap");
import ClientAddEdit from "../../../../components/client/add/AddClient";
const KlientAdd = () => {
  return (
    <MyAppWrap>
      <ClientAddEdit />
    </MyAppWrap>
  );
};

export default KlientAdd;
