import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const Website = ({
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Website"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Website"
        fullWidth
        label="Website"
        variant="outlined"
        {...register('Website')}
        error={!!errors.Website}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!kontoData?.Website,
        }}
        value={kontoData?.Website || ''}
        onChange={handleChange}
      />
      {errors?.Website && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

export default Website;
