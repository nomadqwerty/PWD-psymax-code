'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';

export default function RenewalPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-xl flex flex-col items-center mt-16">
        <h1 className="text-center text-3xl font-semibold">
          Das hat leider nicht geklappt.
        </h1>
        <p className="my-6 mb-8 font-medium text-center text-lg">
          Entweder ist Ihre Testphase abgelaufen oder Sie haben Ihr Abonnement
          mit uns nicht verlängert. Ihr Nutzerkonto wird in {'{ x }'} Tagen
          unwiderruflich gelöscht.
        </p>
        {/* {x}* is how many days to account expiry/deletion */}
        <button className="px-2 py-2 md:px-4 hover:bg-gray-200 hover:border-slate-200 border text-sm bg-gray-100 rounded-md w-fit font-medium">
          Jetzt verlängern
        </button>

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
