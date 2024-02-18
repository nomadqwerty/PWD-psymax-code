import { Grid, Typography } from '@mui/material';
const JustificationSection = () => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={6}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.6,
          color: '#363F4A',
          fontFamily: 'inter Tight',
        }}
      >
        Begründungstexte
      </Typography>
    </Grid>
  );
};

export default JustificationSection;
