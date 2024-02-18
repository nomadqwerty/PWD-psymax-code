import { Grid, Typography } from '@mui/material';

const WelcomeHeader = ({ state }) => {
  return (
    <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
          }}
        >
          Herzlich willkommen {state?.userData?.Vorname}{' '}
          {state?.userData?.Nachname}
        </Typography>
      </Grid>
    </Grid>
  );
};

const ReferralProgram = ({ state }) => {
  return (
    <div className="bg-[#F3F3F3] px-4 py-4">
      <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
        Empfehlungsprogramm
      </Typography>
      <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
        Für jede Nutzer:in, die sich mit Ihrem persönlichen Einladungscode{' '}
        {state?.userData?.inviteCode} anmeldet und psymax für mindestens 3
        Monate abonniert, erhalten Sie einen Gratismonat gutgeschrieben.
      </Typography>
    </div>
  );
};

const Treatment = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <Typography className="text-[#3C3C3C] text-[20px] font-bold interFonts leading-[26px] pt-16">
          Behandlung
        </Typography>
      </Grid>
    </Grid>
  );
};

const JustificationAndServices = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <Typography className="text-[#3C3C3C] text-[20px] font-bold interFonts leading-[26px] pt-16">
          Einstellungen
        </Typography>
      </Grid>
    </Grid>
  );
};

const Account = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <Typography className="text-[#3C3C3C] text-[20px] font-bold interFonts leading-[26px] pt-16">
          Konto
        </Typography>
      </Grid>
    </Grid>
  );
};

export {
  WelcomeHeader,
  ReferralProgram,
  Treatment,
  JustificationAndServices,
  Account,
};
