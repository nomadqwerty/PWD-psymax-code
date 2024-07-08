'use client';
import TwoFactorAuthPage from '../../../components/AuthPages/TwoFaPage';
import { useParams } from 'next/navigation';

const TwoFactorAuth = () => {
  const { id } = useParams();
  const dataArr = id.split('-');
  const userId = dataArr[0];
  const twoFaType = dataArr[1];
  // console.log(userId, twoFaType);
  return (
    <>
      <TwoFactorAuthPage id={userId} type={twoFaType}></TwoFactorAuthPage>
    </>
  );
};

export default TwoFactorAuth;
