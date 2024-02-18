const { default: MyAppWrap } = require("../../../../AppWrap");
import AddEditInvoice from "../../../../../components/Services/Invoice/InvoivePage";

const Abrechnung = () => {
  return (
    <MyAppWrap>
      <AddEditInvoice />
    </MyAppWrap>
  );
};

export default Abrechnung;
