const { default: MyAppWrap } = require("../AppWrap");
import RegisterPage from "@/components/AuthPages/RegisterPage";

const Register = () => {
  return (
    <MyAppWrap>
      <RegisterPage />
    </MyAppWrap>
  );
};

export default Register;
