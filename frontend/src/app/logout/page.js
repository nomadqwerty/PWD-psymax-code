const { default: MyAppWrap } = require('../AppWrap');
import LogoutPage from '../../components/AuthPages/LogoutPage';

const Logout = () => {
  return (
    <MyAppWrap>
      <LogoutPage />
    </MyAppWrap>
  );
};

export default Logout;
