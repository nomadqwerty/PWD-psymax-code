import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const BankName_Bic = ({
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
          name="Bankname"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="Bankname"
          fullWidth
          label="Bankname"
          variant="outlined"
          {...register('Bankname', { required: true })}
          error={!!errors.Bankname}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.Bankname,
          }}
          value={kontoData?.Bankname || ''}
          onChange={handleChange}
        />
        {errors?.Bankname && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="BIC"
          sx={{ mt: [2, 0, 2] }}
          type="text"
          focusColor="#3C3C3C"
          id="BIC"
          fullWidth
          label="BIC"
          variant="outlined"
          {...register('BIC', { required: true })}
          error={!!errors.BIC}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.BIC,
          }}
          value={kontoData?.BIC || ''}
          onChange={handleChange}
        />
        {errors?.BIC && (
          <span className="validationErr pl-2">
            Dieses Feld ist ein Pflichtfeld
          </span>
        )}
      </Grid>
    </Grid>
  );
};
const Iban = ({
  spacing,
  iban,
  setIban,
  handleIbanChange,
  control,
  errors,
  Controller,
}) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={12} xl={12}>
        <Controller
          name="IBAN"
          control={control}
          rules={{ required: 'IBAN is required' }}
          render={({ field }) => (
            <CssTextField
              name={field.name}
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="IBAN"
              fullWidth
              label="IBAN"
              variant="outlined"
              error={!!errors.IBAN}
              inputProps={{
                className: 'interFonts',
              }}
              value={iban || ''}
              ref={field.ref}
              onChange={(e) => {
                handleIbanChange(e);
                field.onChange(e);
              }}
            />
          )}
        />
        {errors?.IBAN && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </Grid>
    </Grid>
  );
};

export { BankName_Bic, Iban };
