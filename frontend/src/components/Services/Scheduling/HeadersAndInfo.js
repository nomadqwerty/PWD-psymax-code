import { Grid, Typography } from '@mui/material';

const RelevantInformation = () => {
  return (
    <Grid container sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <Typography
          sx={{
            lineHeight: 1.6,
          }}
          className="mt-3 font-bold text-[20px] text-[#363F4A] interFonts"
        >
          Relevante Angaben
        </Typography>
      </Grid>
    </Grid>
  );
};

const ValueAddedTax = () => {
  return (
    <Grid container sx={{ mt: 6 }}>
      <Grid item xs={12}>
        <Typography
          sx={{
            lineHeight: 1.6,
          }}
          className="mt-3 pl-1 font-bold text-[20px] text-[#363F4A] interFonts"
        >
          Umsatzsteuer
        </Typography>
      </Grid>
    </Grid>
  );
};

export { RelevantInformation, ValueAddedTax };
