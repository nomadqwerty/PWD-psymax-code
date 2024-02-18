import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const PrimaryColorInput = ({
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Primaerfarbe"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Primaerfarbe"
        fullWidth
        label="Primärfarbe [optional]"
        variant="outlined"
        {...register('Primaerfarbe', {
          pattern: {
            value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // Regular expression for hex color code
            message: 'Ungültiger Farbcode', // Error message if the pattern is not matched
          },
        })}
        error={!!errors.Primaerfarbe}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!kontoData?.Primaerfarbe,
        }}
        value={kontoData?.Primaerfarbe || ''}
        onChange={handleChange}
      />
      {errors?.Primaerfarbe && (
        <span className="validationErr pl-2">
          {errors?.Primaerfarbe?.message}
        </span>
      )}
    </Grid>
  );
};

export default PrimaryColorInput;
