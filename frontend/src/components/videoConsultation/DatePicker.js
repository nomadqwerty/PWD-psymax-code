import { Grid } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

const DatePicker = ({ register, errors, setValues, values }) => {
  const [dateInput, setdateInput] = useState();
  const handleDOBChange = (e) => {
    const date = new Date(e);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    setdateInput(`${year}-${month}-${day}T00:00:00.000Z`);
    console.log(year, month, day);
    let constfinalDate = `${year}-${month}-${day}T00:00:00.000Z`;

    setValues({ ...values, scheduledDate: constfinalDate });
  };
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
        value={new Date(dateInput)}
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
