'use client';
import TwoFactorAuthPage from '../../../components/AuthPages/SpeakEasy';

import { useParams } from 'next/navigation';

const TwoFactorAuth = () => {
  const { id } = useParams();
  console.log(id);
  // console.log(userId, twoFaType);
  return (
    <>
      <TwoFactorAuthPage id={id}></TwoFactorAuthPage>
    </>
  );
};

export default TwoFactorAuth;
