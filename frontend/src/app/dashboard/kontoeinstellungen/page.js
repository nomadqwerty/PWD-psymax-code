const { default: MyAppWrap } = require('../../AppWrap');
import AccountsSettingsPage from '../../../components/accountSetting/AccountsSettingsPage';

const kontoeinstellungen = () => {
  return (
    <MyAppWrap>
      <AccountsSettingsPage />
    </MyAppWrap>
  );
};

export default kontoeinstellungen;
