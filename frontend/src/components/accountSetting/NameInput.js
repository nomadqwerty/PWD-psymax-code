import { Grid } from '@mui/material';

import CssTextField from '../../components/CssTextField';

const NameInput = ({ spacing, kontoData, handleChange, register, errors }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          key="Vorname"
          name="Vorname"
          sx={{ mt: 2 }}
          type="text"
          fullWidth
          label="Vorname"
          variant="outlined"
          {...register('Vorname', { required: true })}
          error={!!errors.Vorname}
          InputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Vorname,
          }}
          value={kontoData?.Vorname || ''}
          onChange={handleChange}
        />

        {errors?.Vorname && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="Nachname"
          sx={{ mt: [2, 0, 2] }}
          type="text"
          focusColor="#3C3C3C"
          id="Nachname"
          fullWidth
          label="Nachname"
          variant="outlined"
          {...register('Nachname', { required: true })}
          error={!!errors.Nachname}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Nachname,
          }}
          value={kontoData?.Nachname || ''}
          onChange={handleChange}
        />
        {errors?.Nachname && (
          <span className="validationErr pl-2">
            Dieses Feld ist ein Pflichtfeld
          </span>
        )}
      </Grid>
    </Grid>
  );
};

export default NameInput;
