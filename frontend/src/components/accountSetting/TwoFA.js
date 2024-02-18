import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const TwoFA = ({ spacing, kontoData, handleChange, register, errors }) => {
  return (
    <Grid container spacing={spacing} style={{ alignItems: 'center' }}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="Authentifizierungscode"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="Authentifizierungscode"
          fullWidth
          label="Authentifizierungscode"
          variant="outlined"
          {...register('Authentifizierungscode')}
          error={!!errors.Authentifizierungscode}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Authentifizierungscode,
          }}
          value={kontoData?.Authentifizierungscode || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export { TwoFA };
