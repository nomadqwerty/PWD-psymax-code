import { useRouter } from 'next/navigation';

import { Container, Grid, Typography } from '@mui/material';

const QuestionnaireExitPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="md:container md:mx-auto px-4 py-24 grid items-center">
      <Container maxWidth="xs">
        <Grid container spacing={4} zeroMinWidth textAlign={'center'}>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              fontSize={24}
              fontWeight={600}
              sx={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',

                '@media (max-width: 600px)': {
                  fontSize: 24,
                },
              }}
            >
              Vielen Dank für die Bearbeitung
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              className="interFonts"
              sx={{
                fontSize: 16,

                '@media (max-width: 600px)': {
                  fontSize: 14,
                },
              }}
            >
              Ihre Angaben wurden erfolgreich übermittelt. Sie können dieses
              Fenster nun schließen.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <button
              className="flex-none px-4 py-4 bg-gray-100 hover:bg-gray-200 rounded-sm interFonts w-full"
              onClick={() => router.push('/')}
            >
              Zu Psymax
            </button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default QuestionnaireExitPage;
