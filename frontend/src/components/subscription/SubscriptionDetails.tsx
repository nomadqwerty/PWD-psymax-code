'use client';
import AppLayout from '@/components/AppLayout';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CssTextField from '../CssTextField';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SOMETHING_WRONG } from '@/utils/constants';
import { cyclesToDays, getPlanInfo } from '@/utils/payment';
import { handleApiError } from '@/utils/apiHelpers';
import kontoContext from '@/context/konto.context';
import { addDays, differenceInDays, format, isAfter, isEqual } from 'date-fns';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import useSWR from 'swr';
import ModelDialogue from '../../components/Dialog/ModelDialogue';

function SubscriptionDetails() {
  const context = useContext(kontoContext);
  const { kontoData, setKontoData } = context.menuState;

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isCancelDialogModalOpen, setIsCancelDialogModalOpen] = useState(false);
  const [isOpenPaymentMethodModal, setIsOpenPaymentMethodModal] =
    useState(false);

  const router = useRouter();

  const fetchData = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
  };

  const {
    data: subscriptionData,
    error: subscriptionError,
    isLoading: isSubscriptionLoading,
    mutate: mutateSubscriptionData,
  } = useSWR(
    kontoData._id ? `/subscriptions/${kontoData._id}` : null,
    fetchData
  );

  // Check if subscription error is 404
  const isSubscriptionNotFound = useMemo(() => {
    return subscriptionError?.response?.status === 404;
  }, [subscriptionError]);

  const {
    data: invoicesData,
    // error: invoicesError,
    isLoading: isInvoicesLoading,
  } = useSWR(
    kontoData._id ? `/subscriptions/${kontoData._id}/invoices/` : null,
    fetchData
  );

  const [search, setSearch] = useState('');

  const filteredInvoices = useMemo(() => {
    if (!invoicesData?.invoices) return [];
    return invoicesData.invoices.filter((invoice) =>
      invoice.referenceId.includes(search)
    );
  }, [search, invoicesData]);

  const exportInvoices = async () => {
    const exportAndZip = async () => {
      const invoiceIds = selectedRows;
      try {
        if (invoiceIds.length === 0) return;
        setIsExporting(() => true);

        const res = await axiosInstance.post('/invoices/download-summary', {
          invoiceIds,
        });

        const responseData = res?.data?.data;
        if (responseData) {
          // create a new JSZip instance
          let zip = new JSZip();

          // loop through the pdf data array
          for (let i = 0; i < responseData.length; i++) {
            // get the base64 encoded pdf and the file name
            let base64Pdf = responseData[i].base64Pdf;
            let fileName = responseData[i].fileName;

            // add the pdf file to the zip
            zip.file(fileName, base64Pdf, { base64: true });
          }

          // generate the zip file as a blob
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            // save the zip file using FileSaver.js
            saveAs(content, 'psymax-invoice-summary.zip');
          });

          // reset the selection model
          setSelectedRows([]);

          // toast.success('Anlagen erfolgreich exportiert');
        }
      } catch (error) {
        console.log(error);
        toast.error(SOMETHING_WRONG);
        throw error;
      }
      setIsExporting(() => false);
    };

    toast.promise(exportAndZip(), {
      error: 'Failed to export invoice',
      loading: 'Exporting invoice',
      success: 'Anlagen erfolgreich exportiert',
    });
  };

  const trialInfo = useMemo(() => {
    return {
      trialEnd: kontoData?.trialEnd
        ? format(new Date(kontoData.trialEnd), 'E LLLL yyyy, kk:mm:ss')
        : 'N/A',
      trialDays: kontoData?.trialDays,
    };
  }, [kontoData]);

  const subscriptionPlan = useMemo(() => {
    const planInfo = getPlanInfo(subscriptionData?.data.plan);
    if (!planInfo) return {};
    return {
      amount: planInfo?.pricing_noVat,
      vatAmount: planInfo?.pricing_noVat * planInfo?.vatPercentage,
    };
  }, [subscriptionData?.data]);

  const referralCycles = useMemo(() => {
    return {
      totalDays: cyclesToDays(kontoData.referralBonusCycles ?? 0),
      endDate: subscriptionData?.data?.startDate
        ? format(
            addDays(new Date(subscriptionData?.data?.startDate), 1),
            'E LLLL yyyy, kk:mm:ss'
          )
        : 'N/A',
    };
  }, [kontoData, subscriptionData]);

  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
  }, []);
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

  async function cancelSubscription() {
    try {
      const response = await axiosInstance.post(
        `/subscriptions/${kontoData._id}/cancel`
      );
      if (response?.status === 200) {
        toast.success('Abonnement erfolgreich gekündigt');
        localStorage.setItem('psymax-account-restricted', 'true');
        router.push('/dashboard');
      } else {
        toast.error(SOMETHING_WRONG);
      }
    } catch (error) {
      handleApiError(error, router);
    }
    setIsCancelDialogModalOpen(false);
  }

  function closeModal() {
    setIsCancelDialogModalOpen(false);
  }

  return (
    <AppLayout>
      <div>
        <h1 className="font-bold text-4xl">Abonnement & Zahlungsdaten</h1>
        {subscriptionData?.data && !isSubscriptionNotFound && (
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-3xl">Abonnement</h2>
              <button
                className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6"
                onClick={() => setIsCancelDialogModalOpen(true)}
              >
                Abonnement kündigen
              </button>
            </div>
            <div>
              <p className="font-bold text-3xl">
                {subscriptionPlan?.amount ?? '--'}€
                <span className="text-base text-[#707070] font-normal">
                  {' '}
                  / 28 Tage zzgl. MwSt. von{' '}
                  {subscriptionPlan?.vatAmount
                    ? subscriptionPlan.vatAmount.toLocaleString()
                    : '--'}
                  €
                </span>
              </p>
              <p className="my-2 text-[#707070]">
                Ihr Abonnement wird in{' '}
                {differenceInDays(
                  new Date(
                    subscriptionData?.data?.nextChargeDate ?? Date.now()
                  ),
                  new Date()
                )}{' '}
                {/* TODO: No need for optional operator */}
                {/* {differenceInDays(subscriptionData?.nextChargeDate, new Date())}{' '} */}
                Tage(n) verlängert.
              </p>
              <div className="flex items-center gap-2">
                <AccountCircleOutlinedIcon htmlColor="#2B86FC" />
                <p className="text-[#707070]">1 Nutzer</p>
              </div>
            </div>
          </div>
        )}
        {/* TODO: IF is subscribed */}
        {/* If subscription is in the past(over) */}
        {!kontoData?.trialPeriodActive && !isSubscriptionNotFound ? (
          <div className="mt-16">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-3xl">Zahlungsmethode</h2>
              <button
                className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6"
                onClick={() => setIsOpenPaymentMethodModal(true)}
              >
                Zahlungsmethode ändern
              </button>
            </div>
            <p className="text-[#707070]">Lastschrift</p>
          </div>
        ) : (
          <div className="mt-16">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-3xl">Zahlungsmethode</h2>
              <Link
                className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6"
                href="/subscription"
              >
                Subscribe
              </Link>
            </div>
            <p className="text-[#707070]">Free Trial</p>
          </div>
        )}
        <div className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Rechnungsangaben</h2>
            <Link
              className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6"
              href="/dashboard/kontoeinstellungen"
            >
              Rechnungsangaben ändern
            </Link>
          </div>
          <ul className="text-[#707070]">
            <li>Praxis/Instiut/Firma</li>
            <li>
              {kontoData?.Vorname} {kontoData?.Nachname}
            </li>
            <li>{kontoData?.Strasse_und_Hausnummer}</li>
            <li>
              {kontoData?.PLZ} {kontoData?.Ort}
            </li>
            <li>{kontoData?.Land}</li>
          </ul>
        </div>
        <div className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Empfehlungsbonus</h2>
            {/* <button className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6">
              Rechnungsangaben ändern
            </button> */}
          </div>
          <div className="mt-2">
            {/* <p>
              Your current subscription is set to renew at
              <span className="text-[#707070]">
                {' '}
                Mon February 2024, 12:00:00
              </span>
            </p> */}
            {kontoData?.trialPeriodActive ? (
              <p>
                Sie nutzen derzeit eine kostenlose Testversion von{' '}
                {trialInfo.trialDays} Tagen, Ihre Testversion endet um
                <span className="text-[#707070]"> {trialInfo.trialEnd}</span>
              </p>
            ) : // {/* If startDate is still in the future */}
            isAfter(new Date(subscriptionData?.data?.startDate), new Date()) ||
              isEqual(
                new Date(subscriptionData?.data?.startDate),
                new Date()
              ) ? (
              <p>
                Sie befinden sich derzeit in Ihren {referralCycles.totalDays}{' '}
                kostenlosen Testtagen, diese würden um ablaufen
                <span className="text-[#707070]">
                  {' '}
                  {referralCycles.endDate}
                </span>
              </p>
            ) : (
              <p>
                Aufgrund der Empfehlungsboni stehen Ihnen noch{' '}
                {referralCycles.totalDays} kostenlose Tage zur Verfügung. Diese
                werden nach der Zahlung Ihres nächsten Abonnements
                berücksichtigt.
              </p>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex justify-between">
            <h2 className="font-bold text-3xl">Rechnungen</h2>
            <CssTextField
              name="suche"
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              id="suche"
              label="Suche"
              variant="outlined"
              inputProps={{
                className: 'interFonts',
              }}
            />
          </div>

          <button
            className="flex gap-3 text-[#2B86FC] mt-8 mb-12 items-center font-medium disabled:opacity-35"
            disabled={isExporting || !selectedRows.length}
            onClick={exportInvoices}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 3.99951V22.9995"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 13.9995L16 22.9995L25 13.9995"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 26.9995H27"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p>Anlage(n) exportieren</p>
          </button>

          <BillingTable
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setIsExporting={setIsExporting}
            rows={filteredInvoices ?? []}
            isLoading={isInvoicesLoading}
          />
        </div>
      </div>

      <PaymentModal
        open={isOpenPaymentMethodModal}
        setOpen={setIsOpenPaymentMethodModal}
        userId={kontoData?._id}
        initialMethod={subscriptionData?.data?.paymentMethod}
        mutate={mutateSubscriptionData}
      />

      <ModelDialogue
        className=""
        actionTitle={'Confirm Cancellation'}
        children={() => {
          return <></>;
        }}
        open={isCancelDialogModalOpen}
        setOpen={setIsCancelDialogModalOpen}
        confirmationText="Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden."
        agreeModel={cancelSubscription}
        closeModel={closeModal}
      />
    </AppLayout>
  );
}

function BillingTable({
  selectedRows: selected,
  setSelectedRows: setSelected,
  setIsExporting,
  isLoading,
  rows,
}) {
  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const downloadInvoice = async (id: string) => {
    const downloadAndZip = async () => {
      try {
        setIsExporting(() => true);

        const res = await axiosInstance.post(
          `/invoices/${id}/download-receipt`
        );

        const responseData = res?.data?.data;
        if (responseData) {
          // create a new JSZip instance
          let zip = new JSZip();

          // loop through the pdf data array
          for (let i = 0; i < responseData.length; i++) {
            // get the base64 encoded pdf and the file name
            let base64Pdf = responseData[i].base64Pdf;
            let fileName = responseData[i].fileName;

            // add the pdf file to the zip
            zip.file(fileName, base64Pdf, { base64: true });
          }

          // generate the zip file as a blob
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            // save the zip file using FileSaver.js
            saveAs(content, 'psymax-invoice.zip');
          });

          // reset the selection model
          setSelected(() => []);
          // toast.success('Anlagen erfolgreich exportiert');
        }
      } catch (error) {
        console.log(error);
        toast.error(SOMETHING_WRONG);
        throw error;
      }
    };

    toast.promise(downloadAndZip(), {
      error: 'Failed to export invoice',
      loading: 'Exporting invoice',
      success: 'Anlagen erfolgreich exportiert',
    });
    // setIsExporting(() => false);
  };

  function handleSelectAll(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);

      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }

  function handleClick(event: React.MouseEvent<unknown>, id: number) {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }
  return (
    <table className="border-separate border-spacing-y-3 w-full">
      <thead>
        <tr>
          <th className="p-3 text-left bg-[#D6D8DC]/25 border-t border-b border-l border-[#D6D8DC] rounded-tl-md rounded-bl-md">
            <Checkbox
              color="primary"
              onChange={handleSelectAll}
              checked={rows.length > 0 && selected.length === rows.length}
              indeterminate={
                selected.length > 0 && selected.length < rows.length
              }
            />
          </th>
          <th className="p-3 text-left bg-[#D6D8DC]/25 border-t border-b border-[#D6D8DC] ">
            Datum
          </th>
          <th className="p-3 text-left bg-[#D6D8DC]/25 border-t border-b border-[#D6D8DC] ">
            Rechnungsnummer
          </th>
          <th className="p-3 text-left bg-[#D6D8DC]/25 rounded-tr-md rounded-br-md  border-t border-b border-r border-[#D6D8DC] ">
            Beleg
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={4} className="text-center">
              Loading...
            </td>
          </tr>
        ) : rows.length ? (
          rows.map((row) => {
            const isItemSelected = isSelected(row._id);
            return (
              <tr
                key={row._id}
                onClick={(event) => handleClick(event, row._id)}
              >
                <td className="p-3 border-t border-b border-l border-[#D6D8DC] rounded-tl-md rounded-bl-md">
                  <Checkbox color="primary" checked={isItemSelected} />
                </td>
                <td className="p-3 border-t border-b border-[#D6D8DC] ">
                  {row.createdAt}
                </td>
                <td className="p-3 border-t border-b border-[#D6D8DC] ">
                  {row.referenceId}
                </td>
                <td className="p-3 border-t border-b border-r border-[#D6D8DC]  rounded-tr-md rounded-br-md text-[#2B86FC]">
                  <button onClick={() => downloadInvoice(row._id)}>
                    Download
                  </button>
                  {/* {row.name} */}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="text-center">
              No invoice found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

import Box from '@mui/material/Box';
import Link from 'next/link';
import PrivateRoute from '../PrivateRoute';
// import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '0.375rem',
};

function PaymentModal({ open, setOpen, userId, initialMethod, mutate }) {
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const [currentMethod, setCurrentMethod] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/subscriptions/${userId}/method`,
        {
          method: currentMethod,
        }
      );

      if (response?.status === 200) {
        toast.success('Zahlungsmethode erfolgreich aktualisiert');
        await mutate();
      } else {
        toast.error(SOMETHING_WRONG);
      }
    } catch (error) {
      handleApiError(error, router);
    }
  }

  function handlePaymentMethodChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setCurrentMethod((event.target as HTMLInputElement).value);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
      >
        <Box sx={style}>
          <h2 className="mb-2 font-semibold text-lg">Choose payment method</h2>
          <p className="text-sm text-[#707070]">
            Your current cycle payment would still be collected at the end of
            the cycle
          </p>

          <form onChange={handleSubmit}>
            <FormControl className="mt-2">
              <RadioGroup
                aria-labelledby="payment-method-radios"
                defaultValue={initialMethod}
                name="paymentMethod"
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="DIRECT_DEBIT"
                  control={<Radio />}
                  label="Direct Debit"
                />
                <FormControlLabel
                  value="WIRE_TRANSFER"
                  control={<Radio />}
                  label="Wire Transfer"
                />
              </RadioGroup>
              <button className="px-2 py-2 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium mt-3">
                Save
              </button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default PrivateRoute(SubscriptionDetails);
