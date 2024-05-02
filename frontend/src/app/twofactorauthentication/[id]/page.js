'use client';
import TwoFactorAuthPage from '@/components/AuthPages/TwoFaPage';
import { useParams } from 'next/navigation';

const TwoFactorAuth = () => {
  const { id } = useParams();
  return (
    <>
      <TwoFactorAuthPage id={id}></TwoFactorAuthPage>
    </>
  );
};

export default TwoFactorAuth;
