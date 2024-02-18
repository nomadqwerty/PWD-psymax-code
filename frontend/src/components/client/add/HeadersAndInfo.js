import { Grid, Typography } from '@mui/material';

const CipherHeader = ({ editData }) => {
  return (
    <Grid container sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'Inter Tight',
          }}
        >
          {editData?.Chiffre ? editData?.Chiffre : `${'{{Chiffre}}'}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

const PersonalData = () => {
  return (
    <Grid container sx={{ mt: 1 }}>
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

const SupervisingDoctorInfo = ({ spacing }) => {
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
          Angaben zum Betreuenden Arzt
        </Typography>
      </Grid>
    </Grid>
  );
};

export { CipherHeader, PersonalData, SupervisingDoctorInfo };
