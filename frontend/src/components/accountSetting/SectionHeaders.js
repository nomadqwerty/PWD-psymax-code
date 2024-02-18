import { Grid, Typography } from '@mui/material';

const AccountSetting = () => {
  return (
    <Grid container sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Typography
          sx={{
            pl: 1,
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
          }}
        >
          Kontoeinstellungen
        </Typography>
      </Grid>
    </Grid>
  );
};

const Empfehlungsprogramm = ({ state }) => {
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

const Personliche = () => {
  return (
    <Grid container sx={{ mt: 4 }}>
      <Grid item xs={12}>
        <Typography
          sx={{
            lineHeight: 1.6,
          }}
          className="mt-3 pl-1 font-bold text-[20px] text-[#363F4A] interFonts"
        >
          Persönliche Angaben
        </Typography>
      </Grid>
    </Grid>
  );
};

const Praxisangaben = ({ spacing }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 6,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
            fontStyle: 'normal',
          }}
        >
          Praxisangaben und Personalisierung
        </Typography>
      </Grid>
    </Grid>
  );
};

const Rechnungsanschrift = ({ spacing }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 6,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
            fontStyle: 'normal',
          }}
        >
          Rechnungsanschrift und Steuernummerangabe
        </Typography>
      </Grid>
    </Grid>
  );
};

const Bankangaben = ({ spacing }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 6,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
            fontStyle: 'normal',
          }}
        >
          Bankangaben
        </Typography>
      </Grid>
    </Grid>
  );
};

const Abrechnungsangaben = ({ spacing }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 6,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
            fontStyle: 'normal',
          }}
        >
          Abrechnungsangaben
        </Typography>
      </Grid>
    </Grid>
  );
};

const Emailadresse = ({ spacing }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <Typography
        className={`interFonts text-[14px] font-normal text-[#6F7680] leading-[20px]`}
        sx={{
          mt: [2, 0, 2],
        }}
      >
        <span style={{ fontWeight: 500 }}>Hinweis</span>
        <br /> Die Angabe einer zusätzliche Email ist optional. Wir schicken dir
        an diese Emailadresse alle von dir erstellen Rechnungen zu.
      </Typography>
    </Grid>
  );
};

const Kontodaten = ({ spacing }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 6,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
            fontStyle: 'normal',
          }}
        >
          Kontodaten
        </Typography>
      </Grid>
    </Grid>
  );
};

const TwoFaktorAuthentifizierung = ({ spacing }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12}>
        <Typography
          sx={{
            mt: 6,
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
            fontStyle: 'normal',
          }}
        >
          2-Faktor-Authentifizierung
        </Typography>
      </Grid>
    </Grid>
  );
};

const TwoFaktorMessage = ({ spacing }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <Typography
        className={`interFonts text-[14px] font-normal text-[#6F7680] leading-[20px]`}
        sx={{
          mt: [2, 0, 2],
        }}
      >
        <span style={{ fontWeight: 500 }}>Hinweis</span>
        <br /> Wir empfehlen Ihnen ausdrücklich eine 2-Faktor-Authentifizierung
        um Ihr Nutzerkonto und die damit verbunden Daten zu schützen.
      </Typography>
    </Grid>
  );
};

export {
  AccountSetting,
  Empfehlungsprogramm,
  Personliche,
  Praxisangaben,
  Rechnungsanschrift,
  Bankangaben,
  Abrechnungsangaben,
  Emailadresse,
  Kontodaten,
  TwoFaktorAuthentifizierung,
  TwoFaktorMessage,
};
