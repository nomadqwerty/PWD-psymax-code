'use client';

import Layout from '@/components/Layout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CssTextField from '../CssTextField';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import axiosInstance from '@/utils/axios';
import { Controller, useForm } from 'react-hook-form';
import kontoContext from '@/context/konto.context';
import { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SOMETHING_WRONG } from '@/utils/constants';
import { handleApiError } from '@/utils/apiHelpers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isValidIBAN } from 'ibantools';

export default function SubscriptionPageCompletion() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    control,
  } = useForm({
    defaultValues: {
      payment_method: 'DIRECT_DEBIT',
      given_name: '',
      iban: '',
      family_name: '',
      account_holder_name: '',
      address_line1: '',
      postal_code: '',
      country_code: '',
      city: '',
    },
  });

  const context = useContext(kontoContext);
  const { kontoData, setKontoData } = context.menuState;
  const router = useRouter();

  const parseJOIErrorToReactHookForm = (error) => {
    error?.details.forEach((e) => {
      setError(e.path[0], e.message);
    });
  };

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
  }, []);

  const onSubmit = async (data) => {
    const submitPromise = async () => {
      try {
        await axiosInstance.post(`/subscriptions`, {
          ...data,
          email: kontoData?.email || '',
        });

        reset();
        localStorage.setItem('psymax-account-restricted', 'false');
        router.push('/dashboard/subscription');
      } catch (error) {
        if (error.response.status === 400) {
          parseJOIErrorToReactHookForm(error.response.data.data);
        }
        handleApiError(error, router);
        throw error;
      }
    };
    toast.promise(submitPromise(), {
      error: 'Subscription Error',
      loading: 'Subscribing..',
      success: 'Subscription successful',
    });
  };
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
              <Link
                href="/login"
                className="inline-block text-center px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium w-full mt-6"
              >
                Unverbindlich testen
              </Link>
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
          <form
            className="border rounded border-[#D6D8DC] mt-10"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                <button
                  className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium w-full mt-6"
                  disabled={isSubmitting}
                >
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
                {/* DE89370400440532013000 */}
                <div>
                  <Controller
                    name="iban"
                    control={control}
                    render={({ field }) => (
                      <CssTextField
                        fullWidth
                        type="text"
                        id="iban"
                        label="IBAN"
                        variant="outlined"
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        error={!!errors.iban}
                        inputProps={{
                          className: 'interFonts',
                        }}
                      />
                    )}
                    rules={{
                      validate: {
                        required: (value) => {
                          const isIbanValid = isValidIBAN(value);
                          if (!value) return 'Dieses Feld ist ein Pflichtfeld';
                          if (!isIbanValid) return 'IBAN is not valid';
                        },
                      },
                      maxLength: 22,
                    }}
                    defaultValue=""
                  />

                  {errors?.iban && (
                    <p className="validationErr">
                      {errors?.iban.message.toString() ||
                        'Dieses Feld ist ein Pflichtfeld'}
                    </p>
                  )}
                </div>
                <div>
                  <CssTextField
                    fullWidth
                    name="account_holder_name"
                    type="text"
                    id="account_holder_name"
                    label="Name des Kontoinhabers"
                    variant="outlined"
                    // disabled
                    {...register('account_holder_name', {
                      required: true,
                    })}
                    // value={`${watchFields[0]} ${watchFields[1]}`}
                    error={!!errors.account_holder_name}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.account_holder_name && (
                    <p className="validationErr">
                      Dieses Feld ist ein Pflichtfeld
                    </p>
                  )}
                </div>
                {/* <div>
                  <CssTextField
                    fullWidth
                    name="account_number"
                    type="text"
                    id="account_number"
                    label="Kontonummer"
                    // label="Praxis/Institut/Firma"
                    // account
                    variant="outlined"
                    {...register('account_number', {
                      required: true,
                      maxLength: 10,
                    })}
                    error={!!errors.account_number}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.account_number && (
                    <p className="validationErr">
                      Dieses Feld ist ein Pflichtfeld
                    </p>
                  )}
                </div> */}
                {/* <div>
                  <CssTextField
                    fullWidth
                    name="bank_code"
                    type="text"
                    id="bank_code"
                    label="Bankleitzahl"
                    variant="outlined"
                    {...register('bank_code', {
                      required: true,
                      maxLength: 8,
                      minLength: 8,
                    })}
                    error={!!errors.bank_code}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.bank_code && (
                    <p className="validationErr">
                      Dieses Feld ist ein Pflichtfeld
                    </p>
                  )}
                </div> */}
                <div className="grid grid-cols-2 gap-7">
                  <div>
                    <CssTextField
                      fullWidth
                      name="given_name"
                      type="text"
                      id="given_name"
                      label="Vorname"
                      variant="outlined"
                      {...register('given_name', { required: true })}
                      error={!!errors.given_name}
                      inputProps={{
                        className: 'interFonts',
                      }}
                    />
                    {errors?.given_name && (
                      <p className="validationErr">
                        Dieses Feld ist ein Pflichtfeld
                      </p>
                    )}
                  </div>
                  <div>
                    <CssTextField
                      fullWidth
                      name="family_name"
                      type="text"
                      id="family_name"
                      label="Nachname"
                      variant="outlined"
                      {...register('family_name', { required: true })}
                      error={!!errors.family_name}
                      inputProps={{
                        className: 'interFonts',
                      }}
                    />
                    {errors?.family_name && (
                      <p className="validationErr">
                        Dieses Feld ist ein Pflichtfeld
                      </p>
                    )}
                  </div>
                  <div>
                    <CssTextField
                      fullWidth
                      name="address_line1"
                      type="text"
                      id="address_line1"
                      label="Strasse und Hausnummer"
                      variant="outlined"
                      {...register('address_line1', { required: true })}
                      error={!!errors.address_line1}
                      inputProps={{
                        className: 'interFonts',
                      }}
                    />
                    {errors?.address_line1 && (
                      <p className="validationErr">
                        Dieses Feld ist ein Pflichtfeld
                      </p>
                    )}
                  </div>
                  <div>
                    <CssTextField
                      fullWidth
                      name="postal_code"
                      type="text"
                      id="postal_code"
                      label="PLZ"
                      variant="outlined"
                      {...register('postal_code', { required: true })}
                      error={!!errors.postal_code}
                      inputProps={{
                        className: 'interFonts',
                      }}
                    />
                    {errors?.postal_code && (
                      <p className="validationErr">
                        Dieses Feld ist ein Pflichtfeld
                      </p>
                    )}
                  </div>
                  <div>
                    <CssTextField
                      fullWidth
                      name="city"
                      type="text"
                      id="city"
                      label="Ort"
                      variant="outlined"
                      {...register('city', { required: true })}
                      error={!!errors.city}
                      inputProps={{
                        className: 'interFonts',
                      }}
                    />
                    {errors?.city && (
                      <p className="validationErr">
                        Dieses Feld ist ein Pflichtfeld
                      </p>
                    )}
                  </div>
                  <div>
                    <CssTextField
                      fullWidth
                      name="country_code"
                      type="text"
                      id="country_code"
                      label="Land"
                      variant="outlined"
                      {...register('country_code', { required: true })}
                      error={!!errors.country_code}
                      inputProps={{
                        className: 'interFonts',
                      }}
                    />
                    {errors?.country_code && (
                      <p className="validationErr">
                        Dieses Feld ist ein Pflichtfeld
                      </p>
                    )}
                  </div>
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
                  <RadioGroup register={register} errors={errors} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

function RadioGroup({ register, errors }) {
  return (
    <>
      <div className="flex items-center justify-between text-[#707070] cursor-pointer relative">
        <input
          type="radio"
          name="payment_method"
          id="payment_method_1"
          className="appearance-none sr-only peer"
          value="DIRECT_DEBIT"
          {...register('payment_method', { required: true })}
        />
        <label
          className="p-3 cursor-pointer h-full w-full leading-loose border border-[#D6D8DC] peer-checked:border-[#2B86FC] rounded absolute inset-0"
          htmlFor="payment_method_1"
        >
          Latschrift
        </label>
        <CheckRoundedIcon
          htmlColor="#2B86FC"
          className="peer-checked:!block !hidden absolute right-3 z-10"
        />
      </div>
      <div className="flex items-center justify-between text-[#707070] cursor-pointer relative">
        <input
          type="radio"
          name="payment_method"
          id="payment_method_two"
          className="appearance-none sr-only peer"
          defaultChecked={false}
          value="WIRE_TRANSFER"
          {...register('payment_method', { required: true })}
        />
        <label
          className="p-3 cursor-pointer h-full w-full leading-loose border border-[#D6D8DC] peer-checked:border-[#2B86FC] rounded absolute inset-0"
          htmlFor="payment_method_two"
        >
          Überweisung
        </label>
        <CheckRoundedIcon
          htmlColor="#2B86FC"
          className="peer-checked:!block !hidden absolute right-3 z-10"
        />
      </div>

      {errors?.payment_method && (
        <p className="validationErr">Dieses Feld ist ein Pflichtfeld</p>
      )}
    </>
  );
}
