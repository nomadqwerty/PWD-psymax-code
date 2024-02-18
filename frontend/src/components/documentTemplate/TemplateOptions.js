import { Grid } from '@mui/material';
import Button from '../common/Button';

const icon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99963 4.99976L4.79289 10.293C4.60536 10.4805 4.5 10.7348 4.5 11.0001C4.5 11.2653 4.60536 11.5196 4.79289 11.7072C4.98043 11.8947 5.23478 12.0001 5.5 12.0001C5.76522 12.0001 6.01957 11.8947 6.20711 11.7072L12.4138 5.41397C12.5996 5.22825 12.7469 5.00777 12.8474 4.76512C12.9479 4.52247 12.9996 4.2624 12.9996 3.99976C12.9996 3.73711 12.9479 3.47704 12.8474 3.23439C12.7469 2.99174 12.5996 2.77126 12.4138 2.58554C12.2281 2.39983 12.0077 2.25251 11.765 2.152C11.5223 2.05149 11.2623 1.99976 10.9996 1.99976C10.737 1.99976 10.4769 2.05149 10.2343 2.152C9.99161 2.25251 9.77114 2.39983 9.58542 2.58554L3.37868 8.87874C2.81607 9.44135 2.5 10.2044 2.5 11.0001C2.5 11.7957 2.81607 12.5588 3.37868 13.1214C3.94129 13.684 4.70435 14.0001 5.5 14.0001C6.29565 14.0001 7.05871 13.684 7.62132 13.1214L12.7496 7.99976"
      stroke="#0E0E0E"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GeneralTreatment = () => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {icon}

          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Allgemeine Behandlungsbedingungen</span>
      </div>
    </Grid>
  );
};

const ConsentToExposure = () => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pl: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {icon}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Einverständnis Exposition</span>
      </div>
    </Grid>
  );
};

const Return = ({ router }) => {
  return (
    <Grid container sx={{ mt: 3, alignItems: 'center' }}>
      <Grid item xs={3} sm={3} md={2} lg={1} className="text-left ">
        <Button
          varient="primary"
          size="sm"
          className="px-4 mt-6"
          onClick={() => router.back()}
        >
          Zurück
        </Button>
      </Grid>
    </Grid>
  );
};

export { GeneralTreatment, ConsentToExposure, Return };
