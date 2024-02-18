import { Grid } from '@mui/material';
import Button from '../common/Button';
import CssTextField from '../CssTextField';

const AddNewClient = ({ router }) => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
      <button
        type="button"
        className="h-[59px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
        onClick={() => router.push('/dashboard/klientinnen/add')}
      >
        Neue Klient:in hinzufügen
      </button>
    </Grid>
  );
};

const SearchClients = ({ search, setSearch }) => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3}>
      <CssTextField
        name="Suche"
        type="text"
        focusColor="#3C3C3C"
        id="Suche"
        fullWidth
        label="Suche"
        variant="outlined"
        inputProps={{
          className: 'interFonts',
        }}
        value={search || ''}
        onChange={(event) => {
          const inputValue = event.target.value;
          const alphanumericRegex = /^[a-zA-Z0-9]*$/;
          if (alphanumericRegex.test(inputValue)) {
            setSearch(event.target.value);
          }
        }}
      />
    </Grid>
  );
};

const Documentation = ({ handleAction, DokumentationData }) => {
  return (
    <Grid
      item
      xs={6}
      sm={4.5}
      md={3}
      lg={2}
      xl={1.5}
      className="flex items-center pb-4"
      onClick={() => {
        handleAction('Dokumentation', DokumentationData());
      }}
    >
      <svg
        className="mr-1.5"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 3V7"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 3V7"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 11H27"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[#2B86FC] interFonts font-medium text-base">
        Dokumentation
      </span>
    </Grid>
  );
};

const Contact = ({
  handleAction,
  kontaktData,
  router,
  activeSelectedKlients,
  handleEmail,
  handleBrief,
}) => {
  return (
    <Grid
      item
      xs={6}
      sm={3}
      md={2}
      lg={1.4}
      xl={1.1}
      className="flex items-center pb-4"
      onClick={() => {
        handleAction(
          'Kontakt',
          kontaktData(router, activeSelectedKlients, handleEmail, handleBrief)
        );
      }}
    >
      <svg
        className="mr-1.5"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.94786 18L4 22V6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5H21C21.2652 5 21.5196 5.10536 21.7071 5.29289C21.8946 5.48043 22 5.73478 22 6V17C22 17.2652 21.8946 17.5196 21.7071 17.7071C21.5196 17.8946 21.2652 18 21 18H8.94786Z"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 18V23C10 23.2652 10.1054 23.5196 10.2929 23.7071C10.4804 23.8946 10.7348 24 11 24H23.0521L28 28V12C28 11.7348 27.8946 11.4804 27.7071 11.2929C27.5196 11.1054 27.2652 11 27 11H22"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-[#2B86FC] interFonts font-medium text-base">
        Kontakt
      </span>
    </Grid>
  );
};

const Treatment = ({ handleAction, BehandlungData }) => {
  return (
    <Grid
      item
      xs={6}
      sm={3}
      md={2.5}
      lg={1.8}
      xl={1.3}
      className="flex items-center pb-4"
      onClick={() => {
        handleAction('Behandlung', BehandlungData());
      }}
    >
      <svg
        className="mr-1.5"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V13C4 12.7348 4.10536 12.4804 4.29289 12.2929C4.48043 12.1054 4.73478 12 5 12H12V5C12 4.73478 12.1054 4.48043 12.2929 4.29289C12.4804 4.10536 12.7348 4 13 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V19C28 19.2652 27.8946 19.5196 27.7071 19.7071C27.5196 19.8946 27.2652 20 27 20H20V27C20 27.2652 19.8946 27.5196 19.7071 27.7071C19.5196 27.8946 19.2652 28 19 28H13C12.7348 28 12.4804 27.8946 12.2929 27.7071C12.1054 27.5196 12 27.2652 12 27V20Z"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-[#2B86FC] interFonts font-medium text-base">
        Behandlung
      </span>
    </Grid>
  );
};

const Invoice = ({ handleAction, AbrechnungData }) => {
  return (
    <Grid
      item
      xs={6}
      sm={4.5}
      md={2.5}
      lg={1.8}
      xl={1.3}
      className="flex items-center pb-4"
      onClick={() => {
        handleAction('Abrechnung', AbrechnungData());
      }}
    >
      <svg
        className="mr-1.5"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.5 17.9091V6.5C5.5 6.23478 5.60536 5.98043 5.79289 5.79289C5.98043 5.60536 6.23478 5.5 6.5 5.5H25.5C25.7652 5.5 26.0196 5.60536 26.2071 5.79289C26.3946 5.98043 26.5 6.23478 26.5 6.5V25.5C26.5 25.7652 26.3946 26.0196 26.2071 26.2071C26.0196 26.3946 25.7652 26.5 25.5 26.5H16.9545"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 19L8 27L4 23"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-[#2B86FC] interFonts font-medium text-base">
        Abrechnung
      </span>
    </Grid>
  );
};

const Status = ({
  handleAction,
  StatusData,
  archivedKlients,
  activeSelectedKlients,
  changeStatus,
}) => {
  return (
    <Grid
      item
      xs={6}
      sm={4}
      md={2}
      lg={2}
      xl={1.3}
      className="flex items-center pb-4"
      onClick={() => {
        handleAction(
          'Status',
          StatusData(archivedKlients, activeSelectedKlients, changeStatus)
        );
      }}
    >
      <svg
        className="mr-1.5"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 20.9993L23 25.9993L27.9999 21"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 13.9993V25.9993"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 15.9993H14.9999"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 7.99927H22.9999"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 23.9993H13"
          stroke="#2B86FC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-[#2B86FC] interFonts font-medium text-base">
        Status
      </span>
    </Grid>
  );
};

const ClickToAddNew = ({ router }) => {
  return (
    <Button
      className="w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
      varient="secondary"
      size="md"
      onClick={() => router.push('/dashboard/klientinnen/add')}
    >
      Bitte klicken, um eine neue Klient:in hinzuzufügen.
    </Button>
  );
};

const Cipher = ({ selectedAll, handleChiffreAll }) => {
  return (
    <div className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#d6d8dc40]">
      <div
        className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer"
        onClick={() => handleChiffreAll(1)}
      >
        <svg
          className="m-4"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="24"
            height="24"
            rx="3"
            fill={`${selectedAll ? '#2B86FC' : 'white'}`}
          />
          {selectedAll && (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
              fill="white"
            />
          )}
        </svg>
      </div>
      <span className="text-[#3C3C3C] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%]">
        Chiffre
      </span>
      <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
        Erstellungsdatum
      </div>
      <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-right"></div>
    </div>
  );
};

export {
  AddNewClient,
  SearchClients,
  Documentation,
  Contact,
  Treatment,
  Invoice,
  Status,
  Cipher,
  ClickToAddNew,
};
