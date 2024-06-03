'use client';
import RecoveryPhrasePage from '../../../components/AuthPages/RecoveryPhrasePage';
import { useParams } from 'next/navigation';

const RecoveryPhrase = () => {
  const { id } = useParams();
  return (
    <>
      <RecoveryPhrasePage id={id}></RecoveryPhrasePage>
    </>
  );
};

export default RecoveryPhrase;
