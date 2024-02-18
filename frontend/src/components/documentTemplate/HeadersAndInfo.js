import { Grid, Typography } from '@mui/material';

const DocumentTemplate = () => {
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
          Dokumentenvorlage
        </Typography>
      </Grid>
    </Grid>
  );
};

const Disclaimer = () => {
  return (
    <div className="bg-[#F3F3F3] px-4 py-4">
      <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
        Hinweis
      </Typography>
      <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
        Die hier bereitgestellten Unterlagen dienen ausschließlich zu
        Informationszwecken. Sie stellen keine rechtliche Beratung dar und
        sollten nicht als solche aufgefasst werden. Wir übernehmen keine
        Verantwortung für die Richtigkeit, Vollständigkeit, Aktualität oder
        Qualität der bereitgestellten Informationen und Dokumente. Wir haften
        nicht für Schäden, die durch die Verwendung oder das Vertrauen auf die
        bereitgestellten Materialien entstehen.
      </Typography>
    </div>
  );
};

const Template = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <Typography className="text-[#3C3C3C] text-[20px] font-bold interFonts leading-[26px] pt-16">
          Vorlagen
        </Typography>
      </Grid>
    </Grid>
  );
};

export { DocumentTemplate, Disclaimer, Template };
