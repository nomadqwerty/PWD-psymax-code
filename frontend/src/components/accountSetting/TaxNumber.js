import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const TaxNumAndPostCode = ({
  spacing,
  register,
  setValue,
  errors,
  setKontoData,
  kontoData,
}) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setKontoData((prevData) => ({ ...prevData, [name]: value }));
    setValue(name, value, { shouldValidate: true });
  };
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="Steuernummer"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="Steuernummer"
          fullWidth
          label="Steuernummer/ Umsatzsteuer-ID"
          variant="outlined"
          {...register('Steuernummer', { required: true })}
          error={!!errors.Steuernummer}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Steuernummer,
          }}
          value={kontoData?.Steuernummer || ''}
          onChange={handleChange}
        />
        {errors?.Steuernummer && (
          <span className="validationErr pl-2">
            Dieses Feld ist ein Pflichtfeld
          </span>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="PLZ"
          sx={{ mt: [2, 0, 2] }}
          type="number"
          focusColor="#3C3C3C"
          id="PLZ"
          fullWidth
          label="PLZ"
          variant="outlined"
          {...register('PLZ', {
            required: 'Dieses Feld ist ein Pflichtfeld',
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
              message: 'Bitte nur Zahlen eingeben',
            },
            maxLength: {
              value: 5,
              message: 'Bitte maximal fünf Zeichen eingeben',
            },
          })}
          error={!!errors.PLZ}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.PLZ,
          }}
          value={kontoData?.PLZ || ''}
          onChange={handleChange}
        />
        {errors?.PLZ && (
          <span className="validationErr pl-2">{errors?.PLZ?.message}</span>
        )}
      </Grid>
    </Grid>
  );
};

export default TaxNumAndPostCode;
