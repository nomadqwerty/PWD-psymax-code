import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const PracticeInput = ({
  spacing,
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="Praxistitel"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="Praxistitel"
          fullWidth
          label="Praxistitel [optional]"
          variant="outlined"
          {...register('Praxistitel')}
          error={!!errors.Praxistitel}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Praxistitel,
          }}
          value={kontoData?.Praxistitel || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="Praxisbezeichnung"
          sx={{ mt: [2, 0, 2] }}
          type="text"
          focusColor="#3C3C3C"
          id="Praxisbezeichnung"
          fullWidth
          label="Praxisbezeichnung [optional]"
          variant="outlined"
          {...register('Praxisbezeichnung')}
          error={!!errors.Praxisbezeichnung}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Praxisbezeichnung,
          }}
          value={kontoData?.Praxisbezeichnung || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};
const PracticeDescInput = ({
  spacing,
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={12} xl={12}>
        <CssTextField
          name="Praxisbeschreibung"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="Praxisbeschreibung"
          fullWidth
          label="Praxisbeschreibung [optional]"
          variant="outlined"
          {...register('Praxisbeschreibung')}
          error={!!errors.Praxisbeschreibung}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Praxisbeschreibung,
          }}
          value={kontoData?.Praxisbeschreibung || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export { PracticeInput, PracticeDescInput };
