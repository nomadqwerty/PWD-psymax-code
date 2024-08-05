import {
  Autocomplete,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CssTextField from '../../CssTextField';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';

const FirstName = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Nachname"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Nachname"
        fullWidth
        label="Nachname"
        variant="outlined"
        {...register('Nachname', { required: true })}
        error={!!errors.Nachname}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Nachname,
        }}
        value={editData?.Nachname || ''}
        onChange={handleChange}
      />
      {errors?.Nachname && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

const LastName = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Vorname"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Vorname"
        fullWidth
        label="Vorname"
        variant="outlined"
        {...register('Vorname', { required: true })}
        error={!!errors.Vorname}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Vorname,
        }}
        value={editData?.Vorname || ''}
        onChange={handleChange}
      />
      {errors?.Vorname && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

const Email = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="email"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="email"
        fullWidth
        label="Email"
        variant="outlined"
        {...register('email', {
          required: 'Dieses Feld ist ein Pflichtfeld',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'Die E-Mail-Adresse sollte korrekt sein.',
          },
        })}
        error={!!errors.email}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.email,
        }}
        value={editData?.email || ''}
        onChange={handleChange}
      />
      {errors?.email && (
        <span className="validationErr">
          {errors.email?.message ? errors.email?.message : null}
        </span>
      )}
    </Grid>
  );
};

const DateSelect = ({ register, errors, editData, handleDOBChange }) => {
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
            // borderColor: errors?.Geburtsdatum && '#d32f2f',
          },
          '& .MuiInputLabel-formControl': {
            // color: errors?.Geburtsdatum && '#d32f2f',
          },
        }}
        className="w-full"
        disableFuture
        {...register('Geburtsdatum', {
          required: 'Dieses Feld ist ein Pflichtfeld',
        })}
        value={editData?.Geburtsdatum ? new Date(editData?.Geburtsdatum) : null}
        onChange={handleDOBChange}
        renderInput={(params) => (
          <TextField
            placeholder="Geburtsdatum"
            margin="normal"
            {...params}
            error={!!errors.Geburtsdatum}
            InputProps={{
              ...params.InputProps,
              style: { border: 'none' },
            }}
          />
        )}
      />
      {errors?.Geburtsdatum && (
        <span className="validationErr pl-2">
          {errors?.Geburtsdatum?.message}
        </span>
      )}
    </Grid>
  );
};

const MyTimePicker = ({ handleTimeChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <TimePicker
        disableOpenPicker={true}
        onChange={handleTimeChange}
      ></TimePicker>
    </Grid>
  );
};

const Remove = ({ router }) => {
  return (
    <Grid
      item
      xs={6}
      sm={6}
      md={6}
      xl={6}
      style={{ textAlign: 'left', cursor: 'pointer' }}
    >
      <button
        type="button"
        className="text-center text-sm font-medium interFonts rounded-[8px] justify-center items-center w-22 h-[42px] px-5 py-2 gap-2.5 inline-flex bg-[#FBD6D8] text-[#E30C40] hover:bg-[#e30c40] hover:text-[#fff]"
        onClick={() => {
          router.push('/dashboard/videosprechstunde');
        }}
      >
        Entfernen
      </button>
    </Grid>
  );
};

const Confirm = ({ isSubmitting }) => {
  return (
    <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'right' }}>
      <button
        type="submit"
        //   disabled={isSubmitting}
        className="text-center text-sm font-medium interFonts rounded-[8px] justify-center items-center w-22 h-[42px] px-5 py-2 gap-2.5 inline-flex bg-[#EEE] text-[#0E0E0E] hover:bg-[#2B86FC] hover:text-[#FFFFFF]"
        style={
          {
            // opacity: 0,
          }
        }
      >
        Bestätigen
      </button>
    </Grid>
  );
};

export {
  FirstName,
  LastName,
  Email,
  DateSelect,
  Remove,
  Confirm,
  MyTimePicker,
};
