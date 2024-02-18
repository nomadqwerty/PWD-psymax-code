import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

const InvoiceEmail = ({
  spacing,
  kontoData,
  setKontoData,
  handleChange,
  register,
  errors,
}) => {
  return (
    <Grid container spacing={spacing} style={{ alignItems: 'center' }}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="invoiceEmail"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="invoiceEmail"
          fullWidth
          label="Email für den Blindversand der Rechnung"
          variant="outlined"
          {...register('invoiceEmail', {
            required: false,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Die E-Mail-Adresse sollte korrekt sein.',
            },
          })}
          error={!!errors.invoiceEmail}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.invoiceEmail,
          }}
          value={kontoData?.invoiceEmail || ''}
          onChange={handleChange}
        />
        {errors?.invoiceEmail && (
          <span className="validationErr">
            {errors.invoiceEmail?.message ? errors.invoiceEmail?.message : null}
          </span>
        )}
      </Grid>
    </Grid>
  );
};
const SalesTax = ({
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
          name="StandardSalesTax"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="StandardSalesTax"
          fullWidth
          label="Standard-Umsatzsteuerhinweis “Der Gesamtbetrag enthält gem. §4 Nr. 21 b) bb) UStG keine Umsatzsteuer.” anpassen."
          variant="outlined"
          {...register('StandardSalesTax')}
          error={!!errors.StandardSalesTax}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.StandardSalesTax,
          }}
          value={kontoData?.StandardSalesTax || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};
/*
 */

export { InvoiceEmail, SalesTax };
