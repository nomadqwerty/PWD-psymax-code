'use client';
import SpeakEasyPage from '../../../components/AuthPages/SpeakEasy';

import { useParams } from 'next/navigation';

const TwoFactorAuth = () => {
  const { id } = useParams();

  const userId = id[0];
  const type = id[1];
  // console.log(userId, type);
  return (
    <>
      <SpeakEasyPage id={userId} type={type}></SpeakEasyPage>
    </>
  );
};

export default TwoFactorAuth;
