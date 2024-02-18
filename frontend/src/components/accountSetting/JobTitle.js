import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const JobTitle = ({
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Berufsbezeichnung"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Berufsbezeichnung"
        fullWidth
        label="Berufsbezeichnung"
        variant="outlined"
        {...register('Berufsbezeichnung')}
        error={!!errors.Berufsbezeichnung}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!kontoData?.Berufsbezeichnung,
        }}
        value={kontoData?.Berufsbezeichnung || ''}
        onChange={handleChange}
      />
      {errors?.Berufsbezeichnung && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

export default JobTitle;
