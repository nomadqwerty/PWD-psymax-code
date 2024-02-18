import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const Address = ({
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Strasse_und_Hausnummer"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Strasse_und_Hausnummer"
        fullWidth
        label="Strasse und Hausnummer"
        variant="outlined"
        {...register('Strasse_und_Hausnummer', {
          required: true,
        })}
        error={!!errors.Strasse_und_Hausnummer}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!kontoData?.Strasse_und_Hausnummer,
        }}
        value={kontoData?.Strasse_und_Hausnummer || ''}
        onChange={handleChange}
      />
      {errors?.Strasse_und_Hausnummer && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const Location = ({
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
          name="Ort"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="Ort"
          fullWidth
          label="Ort"
          variant="outlined"
          {...register('Ort', { required: true })}
          error={!!errors.Ort}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Ort,
          }}
          value={kontoData?.Ort || ''}
          onChange={handleChange}
        />
        {errors?.Ort && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="Land"
          sx={{ mt: [2, 0, 2] }}
          type="text"
          focusColor="#3C3C3C"
          id="Land"
          fullWidth
          label="Land"
          variant="outlined"
          {...register('Land', { required: true })}
          error={!!errors.Land}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Land,
          }}
          value={kontoData?.Land || ''}
          onChange={handleChange}
        />
        {errors?.Land && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </Grid>
    </Grid>
  );
};

export { Address, Location };
