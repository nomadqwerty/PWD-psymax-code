import { Grid, Typography } from '@mui/material';

const ClientHeader = () => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={6}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.6,
          color: '#3C3C3C',
          fontFamily: 'inter Tight',
        }}
      >
        Klient:innen
      </Typography>
    </Grid>
  );
};

const ActiveClient = () => {
  return (
    <Grid container sx={{ mb: 4, mt: 2, alignItems: 'center' }} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.6,
            color: '#3C3C3C',
            fontFamily: 'inter Tight',
          }}
        >
          Aktive Klient:innen
        </Typography>
      </Grid>
    </Grid>
  );
};

const NewlyAdded = () => {
  return (
    <Grid container sx={{ mb: 4, mt: 1, alignItems: 'center' }} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.6,
            color: '#3C3C3C',
            fontFamily: 'inter Tight',
          }}
        >
          Neuaufzunehmende Klient:innen
        </Typography>
      </Grid>
    </Grid>
  );
};

const ArchivedClients = () => {
  return (
    <Grid container sx={{ mb: 4, mt: 1, alignItems: 'center' }} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.6,
            color: '#3C3C3C',
            fontFamily: 'inter Tight',
          }}
        >
          Archivierte Klient:innen
        </Typography>
      </Grid>
    </Grid>
  );
};

export { ClientHeader, ActiveClient, NewlyAdded, ArchivedClients };
