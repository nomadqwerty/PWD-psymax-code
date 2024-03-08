const { default: MyAppWrap } = require('../AppWrap');
import DashboardPage from '../../components/dashboard/DashboardPage';

const Dashboard = () => {
  return (
    <MyAppWrap>
      <DashboardPage />
    </MyAppWrap>
  );
};

export default Dashboard;
