import { Grid, Typography } from '@mui/material';

const EmailHeader = () => {
  return (
    <Grid container sx={{ mb: 4 }}>
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
          Email
        </Typography>
      </Grid>
    </Grid>
  );
};

export { EmailHeader };
