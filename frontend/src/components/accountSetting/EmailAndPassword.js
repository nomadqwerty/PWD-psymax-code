import { Grid } from '@mui/material';
import CssTextField from '../../components/CssTextField';

import zxcvbn from 'zxcvbn';

const Email = ({ spacing, kontoData, register }) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          disabled
          name="email"
          sx={{ mt: 2 }}
          type="text"
          focusColor="#3C3C3C"
          id="email"
          fullWidth
          label="Email Ihres Nutzerkontos"
          variant="outlined"
          {...register('email')}
          value={kontoData?.email || ''}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );
};
const Password = ({
  spacing,
  kontoData,
  setKontoData,
  handleChange,
  register,
  getValues,
  errors,
}) => {
  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="newPassword"
          sx={{ mt: 2 }}
          type="password"
          focusColor="#3C3C3C"
          id="newPassword"
          fullWidth
          label="Passwort aktualisieren"
          variant="outlined"
          {...register('newPassword', {
            required: false,
            validate: (value) =>
              zxcvbn(value)?.score >= 3 || 'Das Passwort sollte sicher sein',
          })}
          autoComplete="new-password"
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.newPassword,
          }}
          value={kontoData?.newPassword || ''}
          onChange={handleChange}
        />
        {errors?.newPassword && (
          <span className="validationErr">{errors?.newPassword?.message}</span>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          name="confirmPassword"
          sx={{ mt: [2, 0, 2] }}
          type="password"
          focusColor="#3C3C3C"
          id="confirmPassword"
          fullWidth
          label="Passwort bestätigen"
          variant="outlined"
          {...register('confirmPassword', {
            // required: "Dieses Feld ist ein Pflichtfeld.",
            validate: (value) =>
              value === getValues('newPassword') ||
              'Passwörter stimmen nicht überein', // Compare with the password field's value
          })}
          error={!!errors.confirmPassword}
          inputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: !!kontoData?.confirmPassword,
          }}
          value={kontoData?.confirmPassword || ''}
          onChange={handleChange}
        />
        {(errors?.confirmPassword?.type === 'required' ||
          errors?.confirmPassword?.type === 'validate') && (
          <div className="validationErr pl-2">
            {errors.confirmPassword.message
              ? errors.confirmPassword.message
              : null}
          </div>
        )}
      </Grid>
    </Grid>
  );
};
/*
 */

export { Email, Password };

/* 

        */
