import { Grid } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const DatePicker = ({
  kontoData,
  setKontoData,
  handleDOBChange,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <DesktopDatePicker
        label="Geburtsdatum"
        name="Geburtsdatum"
        orientation="portrait"
        format="dd.MM.yy"
        sx={{
          mt: 2,
          '& input': {
            fontFamily: 'Inter Tight',
            color: '#717171',
          },
          '& fieldset': {
            borderColor: errors?.Geburtsdatum && '#d32f2f',
          },
          '& .MuiInputLabel-formControl': {
            color: errors?.Geburtsdatum && '#d32f2f',
          },
        }}
        className="w-full"
        disableFuture
        {...register('Geburtsdatum', {
          required: 'Dieses Feld ist ein Pflichtfeld',
        })}
        value={
          kontoData?.Geburtsdatum ? new Date(kontoData?.Geburtsdatum) : null
        }
        onChange={handleDOBChange}
        slotProps={{
          textField: {
            margin: 'normal',
            error: !!errors.Geburtsdatum,
            inputProps: { style: { border: 'none' } },
            placeholder: 'Geburtsdatum',
          },
        }}
      />
      {errors?.Geburtsdatum && (
        <span className="validationErr pl-2">
          {errors?.Geburtsdatum?.message}
        </span>
      )}
    </Grid>
  );
};

export default DatePicker;
