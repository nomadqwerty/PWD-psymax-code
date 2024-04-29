'use client';

import Layout from '@/components/Layout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CssTextField from '../CssTextField';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export default function SubscriptionPageCompletion() {
  return (
    <Layout>
      <div className="mx-auto max-w-xl flex flex-col items-center my-16">
        {/* 1 */}
        <div className="my-4">
          <h2 className="text-center text-3xl font-semibold">Testphase</h2>
          <div className="rounded border border-[#D6D8DC] flex mt-10">
            <div className="flex flex-col p-4 flex-1 justify-between">
              <div>
                <p className="font-bold text-3xl">kostenfrei</p>
                <p className="my-2 text-[#707070]">
                  ohne automatische Verlängerung
                </p>
                <div className="flex items-center gap-2">
                  <AccountCircleOutlinedIcon htmlColor="#2B86FC" />
                  <p className="text-[#707070]">1 Nutzer</p>
                </div>
              </div>
              <button className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium w-full mt-6">
                Unverbindlich testen
              </button>
            </div>
            <div className="p-4 text-[#6F7680] border-l border-[#D6D8DC] flex-1">
              <p>
                Die Testphase wird automatisch beendet. Die Angabe einer
                Zahlungsmethode ist nur im Fall einer Verlängerung notwendig.
                Falls Sie sich entscheiden, ihr Nutzerkonto nicht zu verlängern,
                wird Ihr Nutzerkonto und alle damit verbundenen Informationen
                (insbesondere Klient:innendaten) nach einer Wartezeit
                unwiderruflich gelöscht.
              </p>
              <p className="mt-4">
                Mit einem Klick auf „Unverbindlich testen“, bestätigen Sie die
                <a href="#" className="text-[#2B86FC]">
                  {' '}
                  Allgemeinen Geschäftsbedingungen
                </a>{' '}
                unser
                <a href="#" className="text-[#2B86FC]">
                  {' '}
                  Service-Level-Agreement
                </a>{' '}
                sowie unsere
                <a href="#" className="text-[#2B86FC]">
                  {' '}
                  Datenschutzbestimmungen
                </a>{' '}
                gelesen und ihnen zugestimmt zu haben.
              </p>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className="my-4">
          <h2 className="text-center text-3xl font-semibold">Abonnement</h2>
          <div className="border rounded border-[#D6D8DC] mt-10">
            <div className="border-b border-[#D6D8DC] flex pb-4">
              <div className="flex flex-col p-4 flex-1 justify-between">
                <div>
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
                </div>
                <button className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium w-full mt-6">
                  Verbindlich bestellen
                </button>
              </div>
              <div className="p-4 text-[#6F7680] border-l border-[#D6D8DC] flex-1">
                <p className="mt-4">
                  Mit einem Klick auf „Verbindlich bestellen“, bestätigen Sie
                  die
                  <a href="#" className="text-[#2B86FC]">
                    {' '}
                    Allgemeinen Geschäftsbedingungen
                  </a>{' '}
                  unser
                  <a href="#" className="text-[#2B86FC]">
                    {' '}
                    Service-Level-Agreement
                  </a>{' '}
                  sowie unsere
                  <a href="#" className="text-[#2B86FC]">
                    {' '}
                    Datenschutzbestimmungen
                  </a>{' '}
                  gelesen und ihnen zugestimmt zu haben.
                </p>
                <p className="mt-4">
                  Mit einem Klick auf „Verbindlich bestellen“, stimmen Sie zu,
                  dass Ihr Widerrufsrecht bei Erfüllung des Vertrages (Nutzung
                  der Plattform) erlischt.
                </p>
                <p className="text-[#E30C40] mt-4">
                  Bitte vervollständigen Sie Ihre Rechnungsangaben und
                  Zahlungsinformationen um fortzufahren.
                </p>
              </div>
            </div>
            <div className="border-b border-[#D6D8DC] p-4">
              <h3 className="text-xl font-semibold mb-2">Rechnungsangaben</h3>
              <p className="text-[#707070]">
                Bitte vervollständigen Sie Ihre Rechnungsangaben.
              </p>

              <div className="mt-6 grid gap-6">
                <CssTextField
                  fullWidth
                  name="email"
                  type="text"
                  id="email"
                  label="Praxis/Institut/Firma"
                  variant="outlined"
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                <div className="grid grid-cols-2 gap-7">
                  <CssTextField
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    label="Vorname"
                    variant="outlined"
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  <CssTextField
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    label="Nachname"
                    variant="outlined"
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  <CssTextField
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    label="Strasse und Hausnummer"
                    variant="outlined"
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  <CssTextField
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    label="PLZ"
                    variant="outlined"
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  <CssTextField
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    label="Ort"
                    variant="outlined"
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  <CssTextField
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    label="Land"
                    variant="outlined"
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                Zahlungsinformationen
              </h3>
              <p className="text-[#707070]">
                Bitte wählen Sie eine Zahlungsmethode.
              </p>

              <div className="mt-6 grid gap-6">
                <div className="grid grid-cols-2 gap-7 grid-rows-[3.75rem]">
                  <RadioGroup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RadioGroup() {
  return (
    <>
      <div className="flex items-center justify-between text-[#707070] cursor-pointer relative">
        <input
          type="radio"
          name="payment_method"
          id="payment_method_1"
          className="appearance-none sr-only peer"
        />
        <label
          className="p-3 cursor-pointer h-full w-full leading-loose border border-[#D6D8DC] peer-checked:border-[#2B86FC] rounded absolute inset-0"
          htmlFor="payment_method_1"
        >
          Latschrift
        </label>
        <CheckRoundedIcon
          htmlColor="#2B86FC"
          className="peer-checked:block hidden absolute right-3 z-10"
        />
      </div>
      <div className="flex items-center justify-between text-[#707070] cursor-pointer relative">
        <input
          type="radio"
          name="payment_method"
          id="payment_method_two"
          className="appearance-none sr-only peer"
        />
        <label
          className="p-3 cursor-pointer h-full w-full leading-loose border border-[#D6D8DC] peer-checked:border-[#2B86FC] rounded absolute inset-0"
          htmlFor="payment_method_two"
        >
          Überweisung
        </label>
        <CheckRoundedIcon
          htmlColor="#2B86FC"
          className="peer-checked:block hidden absolute right-3 z-10"
        />
      </div>
    </>
  );
}
