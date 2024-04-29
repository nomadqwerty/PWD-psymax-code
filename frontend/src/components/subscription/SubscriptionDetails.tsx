'use client';
import AppLayout from '@/components/AppLayout';
import { Checkbox } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CssTextField from '../CssTextField';
import { useState } from 'react';

export default function SubscriptionDetails() {
  return (
    <AppLayout>
      <div>
        <h1 className="font-bold text-4xl">Abonnement & Zahlungsdaten</h1>
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Abonnement</h2>
            <button className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6">
              Abonnement kündigen
            </button>
          </div>
          <div>
            <p className="font-bold text-3xl">
              69€
              <span className="text-base text-[#707070] font-normal">
                {' '}
                / 30 Tage zzgl. MwSt. von 13,11€
              </span>
            </p>
            <p className="my-2 text-[#707070]">
              Ihr Abonnement wird in {'{ X }'} Tage(n) verlängert.
            </p>
            <div className="flex items-center gap-2">
              <AccountCircleOutlinedIcon htmlColor="#2B86FC" />
              <p className="text-[#707070]">1 Nutzer</p>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Zahlungsmethode</h2>
            <button className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6">
              Zahlungsmethode ändern
            </button>
          </div>
          <p className="text-[#707070]">Lastschrift</p>
        </div>
        <div className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Rechnungsangaben</h2>
            <button className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border bg-gray-100 rounded-md font-medium  mt-6">
              Rechnungsangaben ändern
            </button>
          </div>
          <ul className="text-[#707070]">
            <li>Praxis/Instiut/Firma</li>
            <li>Vorname Nachname</li>
            <li>Strasse und Hausnummer</li>
            <li>Postleitzahl Ort</li>
            <li>Land</li>
          </ul>
        </div>

        <div className="mt-16">
          <div className="flex justify-between">
            <h2 className="font-bold text-3xl">Rechnungen</h2>
            <CssTextField
              name="suche"
              type="text"
              id="suche"
              label="Suche"
              variant="outlined"
              inputProps={{
                className: 'interFonts',
              }}
            />
          </div>

          <div className="flex gap-3 text-[#2B86FC] mt-8 mb-12 items-center font-medium">
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
          </div>

          <BillingTable />
        </div>
      </div>
    </AppLayout>
  );
}

const rows = [
  {
    id: 1,
    date: '{Date}',
    invoice: '{Rechnungsnummer}',
    name: '{documentname}',
  },
  {
    id: 2,
    date: '{Date}',
    invoice: '{Rechnungsnummer}',
    name: '{documentname}',
  },
  {
    id: 3,
    date: '{Date}',
    invoice: '{Rechnungsnummer}',
    name: '{documentname}',
  },
];

function BillingTable() {
  const [selected, setSelected] = useState<number[]>([]);

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  function handleSelectAll(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      console.log('Fooooo');
      const newSelected = rows.map((n) => n.id);
      console.log(newSelected);

      setSelected(newSelected);
      return;
    }
    console.log('Baaa');
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
        {rows.map((row) => {
          const isItemSelected = isSelected(row.id);
          return (
            <tr key={row.id} onClick={(event) => handleClick(event, row.id)}>
              <td className="p-3 border-t border-b border-l border-[#D6D8DC] rounded-tl-md rounded-bl-md">
                <Checkbox color="primary" checked={isItemSelected} />
              </td>
              <td className="p-3 border-t border-b border-[#D6D8DC] ">
                {row.date}
              </td>
              <td className="p-3 border-t border-b border-[#D6D8DC] ">
                {row.invoice}
              </td>
              <td className="p-3 border-t border-b border-r border-[#D6D8DC]  rounded-tr-md rounded-br-md text-[#2B86FC]">
                {row.name}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
