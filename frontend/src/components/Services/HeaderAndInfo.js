import { Grid, Typography } from '@mui/material';

const Services = () => {
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
        Leistungen
      </Typography>
    </Grid>
  );
};

const BillingSpecification = () => {
  return (
    <Grid container sx={{ mb: 4, mt: 2, alignItems: 'center' }} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.6,
            color: '#3C3C3C',
            fontFamily: 'inter Tight',
          }}
        >
          Leistungsspezifikation für die Abrechnung
        </Typography>
      </Grid>
    </Grid>
  );
};

const ServiceInfo = () => {
  return (
    <div className="bg-[#F3F3F3] px-4 py-4">
      <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
        Hinweis
      </Typography>
      <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
        Die hier erstellten Leistungen können Sie in Ihrer Abrechnung auswählen.
      </Typography>
    </div>
  );
};

const PerformanceSpecifications = () => {
  return (
    <Grid container sx={{ mb: 4, mt: 2, alignItems: 'center' }} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.6,
            color: '#3C3C3C',
            fontFamily: 'inter Tight',
          }}
        >
          Leistungsspezifikation für Ihre Terminplanung
        </Typography>
      </Grid>
    </Grid>
  );
};

const AppointmentInfo = () => {
  return (
    <div className="bg-[#F3F3F3] px-4 py-4">
      <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
        Hinweis
      </Typography>
      <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
        Die hier erstellten Leistungen können Sie in Ihrer Terminplanung mit
        Zeiteinheiten ausweisen.
      </Typography>
    </div>
  );
};

export {
  Services,
  BillingSpecification,
  ServiceInfo,
  PerformanceSpecifications,
  AppointmentInfo,
};
