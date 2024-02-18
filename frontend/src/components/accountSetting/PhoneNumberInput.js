import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const PhoneNumberInput = ({
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Telefon"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Telefon"
        fullWidth
        label="Telefonnummer"
        variant="outlined"
        {...register('Telefon', {
          required: 'Dieses Feld ist ein Pflichtfeld',
          pattern: {
            value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
            message: 'Ungültiges Telefonnummer.',
          },
        })}
        error={!!errors.Telefon}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!kontoData?.Telefon,
        }}
        value={kontoData?.Telefon || ''}
        onChange={handleChange}
      />
      {errors?.Telefon && (
        <span className="validationErr">
          {errors.Telefon?.message ? errors.Telefon?.message : null}
        </span>
      )}
    </Grid>
  );
};

export default PhoneNumberInput;
