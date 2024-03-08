const { default: MyAppWrap } = require('../AppWrap');
import LoginPage from '../../components/AuthPages/LoginPage';

const Login = () => {
  return (
    <MyAppWrap>
      <LoginPage />
    </MyAppWrap>
  );
};

export default Login;
