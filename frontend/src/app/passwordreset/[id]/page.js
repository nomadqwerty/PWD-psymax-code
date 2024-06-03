'use client';
import PasswordResetPage from '../../../components/AuthPages/passwordResetPage';
import { useParams } from 'next/navigation';

const PasswordReset = () => {
  const { id } = useParams();
  return (
    <>
      <PasswordResetPage id={id}></PasswordResetPage>
    </>
  );
};

export default PasswordReset;
