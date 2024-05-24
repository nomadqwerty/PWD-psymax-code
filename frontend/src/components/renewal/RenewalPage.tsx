'use client';

import Layout from '@/components/Layout';
import kontoContext from '@/context/konto.context';
import { handleApiError } from '@/utils/apiHelpers';
import axiosInstance from '@/utils/axios';
import { SOMETHING_WRONG } from '@/utils/constants';
import { differenceInDays } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import PrivateRoute from '../PrivateRoute';

function RenewalPage() {
  const context = useContext(kontoContext);
  const { kontoData, setKontoData } = context.menuState;

  const router = useRouter();

  const fetchData = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
  };

  const { data, isLoading } = useSWR(
    kontoData._id ? `/subscriptions/${kontoData._id}` : null,
    fetchData
  );

  const daysToDeletion = useMemo(() => {
    const lastPaymentDate = data?.data?.lastPaymentDate;
    if (lastPaymentDate) {
      // Account deletion happens 86 days after the last payment
      return differenceInDays(new Date(lastPaymentDate), new Date()) + 86;
    }
    return 0;
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(`/user/get`);
        const responseData = response?.data?.data;
        if (response?.status === 200) {
          setKontoData(responseData);
        } else {
          toast.error(SOMETHING_WRONG);
        }
      } catch (error) {
        handleApiError(error, router);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <div className="mx-auto max-w-xl flex flex-col items-center mt-16">
        <h1 className="text-center text-3xl font-semibold">
          Das hat leider nicht geklappt.
        </h1>
        <p className="my-6 mb-8 font-medium text-center text-lg">
          Entweder ist Ihre Testphase abgelaufen oder Sie haben Ihr Abonnement
          mit uns nicht verlängert. Ihr Nutzerkonto wird in{' '}
          {isLoading ? '...' : daysToDeletion} Tagen unwiderruflich gelöscht.
        </p>

        <Link
          href="/subscription"
          className="block px-2 py-2 md:px-4 hover:bg-gray-200 hover:border-slate-200 border text-sm bg-gray-100 rounded-md w-fit font-medium"
        >
          Jetzt verlängern
        </Link>

        <Image
          src="/dog-ball.svg"
          alt="sad dog with ball"
          height={470}
          width={470}
          className="mt-12"
        />
      </div>
    </Layout>
  );
}

export default PrivateRoute(RenewalPage);
