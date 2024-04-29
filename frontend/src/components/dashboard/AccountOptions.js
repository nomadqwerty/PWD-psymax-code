import { paymentSvg, accountSettingSvg } from './Dashboard assets/dashboardSvg';
import { Grid } from '@mui/material';

const PaymentDetailsAndSubscription = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/subscription')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {paymentSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Zahlungsdaten & Abonnement</span>
      </div>
    </Grid>
  );
};

const AccountSetting = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pl: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/kontoeinstellungen')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {accountSettingSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Kontoeinstellungen</span>
      </div>
    </Grid>
  );
};

export { PaymentDetailsAndSubscription, AccountSetting };
