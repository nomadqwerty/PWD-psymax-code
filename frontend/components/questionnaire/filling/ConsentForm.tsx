import { Container, Grid, Typography, Box } from '@mui/material';

type AccessCodeProps = {
  onNextQuestionnairePage: (direction?: 'next' | 'back') => void;
};

const ConsentForm: React.FC<AccessCodeProps> = ({
  onNextQuestionnairePage: onNext,
}) => {
  return (
    <div className="md:container md:mx-auto px-4 py-24 grid items-center">
      <Container maxWidth="md">
        <Grid container spacing={6} zeroMinWidth>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              textAlign={'center'}
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
              Einverständniserklärung
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              textAlign={'center'}
              className="interFonts"
              sx={{
                fontSize: 16,

                '@media (max-width: 600px)': {
                  fontSize: 14,
                },
              }}
            >
              Ihre Teilnahme ist freiwillig und kann jederzeit beendet werden.
              Mit einem Klick auf “Weiter” stimmen Sie der Erhebung und
              Verarbeitung Ihrer Daten unwiderruflich zu, da eine individuelle
              Löschung unmöglich ist.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Grid item xs={'auto'}>
                <button
                  // className="flex-none px-4 hover:bg-gray-100 hover:border-slate-200 border interFonts"
                  className="px-2 py-2 md:px-4 hover:bg-gray-200 hover:border-slate-200 border interFonts bg-gray-100 rounded-md w-fit"
                  onClick={() => onNext('back')}
                >
                  Zurück
                </button>
              </Grid>
              <Grid item xs={'auto'}>
                <button
                  className="px-2 py-2 md:px-4 hover:bg-gray-200 hover:border-slate-200 border interFonts bg-gray-100 rounded-md w-fit"
                  onClick={() => onNext('next')}
                >
                  Weiter
                </button>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ConsentForm;
