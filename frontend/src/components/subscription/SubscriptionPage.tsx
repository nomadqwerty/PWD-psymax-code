'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AirplayOutlinedIcon from '@mui/icons-material/AirplayOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import Link from 'next/link';

export default function SubscriptionPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-xl flex flex-col items-center my-16">
        <h1 className="text-center text-3xl font-semibold">
          Alle Funktionalitäten in einem Abo. 7 Tage unverbindlich testen.
        </h1>
        <p className="my-6 mb-8 font-medium text-center text-lg">
          Falls wir Sie in der Testphase nicht überzeugen können, wird Ihr
          Nutzerkonto automatisch gelöscht. Ohne Abofalle.
        </p>
        <div className="grid grid-cols-2 gap-4 grid-rows-2">
          {/* 1 */}
          <div className="rounded border border-[#D6D8DC]">
            <div className="p-4 border-[#D6D8DC] border-b">
              <p className="font-semibold text-xl">Testphase</p>
              <p className="mt-2 text-[#707070]">
                Unverbindlich und kostenfrei bis zu 7 Tage testen.
              </p>
            </div>
            <div className="p-4">
              <p className="font-bold text-3xl">kostenfrei</p>
              <p className="my-2 text-[#707070]">
                ohne automatische Verlängerung
              </p>
              <div className="flex items-center gap-2">
                <AccountCircleOutlinedIcon htmlColor="#2B86FC" />
                <p className="text-[#707070]">1 Nutzer</p>
              </div>
              <Link
                href="/dashboard"
                className="text-center inline-block px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border text-sm bg-gray-100 rounded-md font-medium w-full mt-6"
              >
                Jetzt buchen
              </Link>
            </div>
          </div>
          {/* 2 */}
          <div className="rounded border border-[#D6D8DC] row-span-3">
            <div className="p-4 border-[#D6D8DC] border-b">
              <p className="font-semibold text-xl">Abonnement</p>
              <p className="mt-2 text-[#707070]">
                Alle Funktionen zum Einheitspreis.
              </p>
            </div>
            <div className="p-4 border-[#D6D8DC] border-b">
              <p className="font-bold text-3xl">
                69€
                <span className="text-base text-[#707070] font-normal">
                  {' '}
                  / 30 Tage zzgl. MwSt.{' '}
                </span>
              </p>
              <p className="my-2 text-[#707070]">jederzeit kündbar</p>
              <div className="flex items-center gap-2">
                <AccountCircleOutlinedIcon htmlColor="#2B86FC" />
                <p className="text-[#707070]">1 Nutzer</p>
              </div>
              <Link
                href="/subscription-complete"
                className="text-center inline-block px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border text-sm bg-gray-100 rounded-md font-medium w-full mt-6"
              >
                Jetzt buchen
              </Link>
            </div>
            <div className="p-4">
              <p className="text-[#707070]">
                Nach 12 Abrechnungen erhöht sich der Preis des Abonnements auf
                99€/ 30 Tage zzgl. MwSt.
              </p>
              <div className="mt-4">
                <h6 className="font-semibold">Inkludiert</h6>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center gap-2">
                    <AirplayOutlinedIcon htmlColor="#2B86FC" />
                    <p className="text-[#707070]">Praxisverwaltung</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarTodayOutlinedIcon htmlColor="#2B86FC" />
                    <p className="text-[#707070]">Videosprechstunde</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <InboxOutlinedIcon htmlColor="#2B86FC" />
                    <p className="text-[#707070]">Terminplanung</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PostAddOutlinedIcon htmlColor="#2B86FC" />
                    <p className="text-[#707070]">Fragebogeneditor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/female-cat.svg"
              alt="female with cats and laptop"
              height={470}
              width={470}
              className="w-full absolute -left-10 h-full"
            />
          </div>
        </div>

        <div className="px-4 py-4 md:px-4 border border-[#D6D8DC] text-sm bg-gray-100 rounded-md w-fit mt-6">
          <h3 className="font-semibold text-xl mb-2">Individuelles Angebot</h3>
          <p>
            Falls Sie mit uns kooperieren, mehrere Konten eröffnen oder unsere
            API in Ihre eigene Anwendung einbinden möchten, freuen wir uns über
            eine kurze Kontaktaufnahme.
          </p>

          <button className="px-2 py-4 md:px-4 rounded-md font-medium w-2/6 mt-6 bg-white">
            Kontakt
          </button>
        </div>

        <div className="mt-20">
          <h2 className="font-semibold text-3xl mb-6">
            Häufig gestellte Fragen
          </h2>

          {/* 1 */}
          <div className="grid grid-cols-2 gap-5 border-b border-[#D6D8DC] pb-4">
            <p>
              Muss ich während der Testphase meine Zahlungsdaten angeben und
              wird mein Konto automatisch verlängert, wenn ich nicht rechtzeitig
              kündige?
            </p>
            <p className="text-[#707070]">
              Sie müssen während der Testphase keine Zahlungsdaten offenlegen.
              Ihr Nutzerkonto wird ohne Ihr Einverständnis nicht automatisch
              nach Ablauf der Testphase verlängert.
            </p>
          </div>
          {/* 2 */}
          <div className="grid grid-cols-2 gap-5 border-b border-[#D6D8DC] py-4">
            <p>
              Was passiert mit meinem Nutzerkonto, falls ich mich nicht für ein
              Abonnement entscheide?
            </p>
            <p className="text-[#707070]">
              Wir löschen das Nutzerkonto mit Ablauf der Testphase innerhalb der
              nächsten 30 Tage.
            </p>
          </div>
          {/* 3 */}
          <div className="grid grid-cols-2 gap-5 py-4">
            <p>
              Was passiert mit meinem Nutzerkonto, falls ich mich nicht für ein
              Abonnement entscheide?
            </p>
            <p className="text-[#707070]">
              Wir löschen das Nutzerkonto mit Ablauf der Testphase innerhalb der
              nächsten 30 Tage.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
