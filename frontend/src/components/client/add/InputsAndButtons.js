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

const CipherInput = ({ isEdit, register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        disabled={isEdit}
        name="Chiffre"
        sx={{
          mt: 4,
        }}
        type="text"
        focusColor="#3C3C3C"
        color="primary"
        id="Chiffre"
        fullWidth
        label="Chiffre"
        variant="outlined"
        {...register('Chiffre', { required: true })}
        error={!!errors.Chiffre}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Chiffre,
        }}
        value={editData?.Chiffre || ''}
        onChange={handleChange}
      />
      {errors?.Chiffre && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const Salutation = ({
  Controller,
  control,
  register,
  editData,
  errors,
  setValue,
  handleChange,
}) => {
  return (
    <Grid item xs={12} sm={12} md={3} xl={3}>
      <FormControl sx={{ mt: [2, 0, 4] }} fullWidth>
        <InputLabel
          id="Anrede"
          className="text-md"
          sx={{
            fontStyle: 'normal',
            fontWeight: 400,
          }}
        >
          Anrede
        </InputLabel>
        <Controller
          name="Anrede"
          control={control}
          defaultValue={editData?.Anrede || ''}
          render={({ field }) => (
            <Select
              labelId="Anrede"
              label="Anrede"
              fullWidth
              {...field}
              error={!!errors.Anrede}
              onChange={(e) => {
                setValue('Anrede', e?.target?.value, {
                  shouldValidate: true,
                });
                handleChange(e);
              }}
              {...register('Anrede', { required: true })}
              value={field.value || ''}
            >
              <MenuItem value={'Herr'}>männlich</MenuItem>
              <MenuItem value={'Frau'}>weiblich</MenuItem>
              <MenuItem value={' '}>divers</MenuItem>
            </Select>
          )}
        />
        {errors?.Anrede && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </FormControl>
    </Grid>
  );
};

const Title = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={3} xl={3}>
      <CssTextField
        name="Titel"
        sx={{ mt: [2, 0, 4] }}
        type="text"
        focusColor="#3C3C3C"
        id="Titel"
        fullWidth
        label="Titel"
        variant="outlined"
        {...register('Titel')}
        error={!!errors.Titel}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Titel,
        }}
        value={editData?.Titel || ''}
        onChange={handleChange}
      />
    </Grid>
  );
};

const Firm = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={12} xl={12}>
      <CssTextField
        name="Firma"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        color="primary"
        id="Firma"
        fullWidth
        label="Firma"
        variant="outlined"
        {...register('Firma', { required: true })}
        error={!!errors.Firma}
        InputLabelProps={{
          shrink: !!editData?.Firma,
        }}
        inputProps={{
          className: 'interFonts',
        }}
        value={editData?.Firma || ''}
        onChange={handleChange}
      />
      {errors?.Firma && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const FirstName = ({
  register,
  errors,
  editData,
  handleChange,
  handleBlur,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        key="Vorname"
        name="Vorname"
        sx={{ mt: 2 }}
        type="text"
        fullWidth
        label="Vorname"
        variant="outlined"
        {...register('Vorname', { required: true })}
        error={!!errors.Vorname}
        InputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Vorname,
        }}
        value={editData?.Vorname || ''}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, 'Vorname')}
      />

      {errors?.Vorname && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const LastName = ({ register, errors, editData, handleChange, handleBlur }) => {
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
        onBlur={(e) => handleBlur(e, 'Nachname')}
      />
      {errors?.Nachname && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

const StreetAndHouseNumber = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Strasse_und_Hausnummer"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Strasse_und_Hausnummer"
        fullWidth
        label="Strasse und Hausnummer"
        variant="outlined"
        {...register('Strasse_und_Hausnummer', {
          required: true,
        })}
        error={!!errors.Strasse_und_Hausnummer}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Strasse_und_Hausnummer,
        }}
        value={editData?.Strasse_und_Hausnummer || ''}
        onChange={handleChange}
      />
      {errors?.Strasse_und_Hausnummer && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const PostCode = ({ register, errors, editData, handleChange }) => {
  return (
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
          shrink: !!editData?.PLZ,
        }}
        value={editData?.PLZ || ''}
        onChange={handleChange}
      />
      {errors?.PLZ && (
        <span className="validationErr pl-2">{errors?.PLZ?.message}</span>
      )}
    </Grid>
  );
};

const Location = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Ort"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Ort"
        fullWidth
        label="Ort"
        variant="outlined"
        {...register('Ort', { required: true })}
        error={!!errors.Ort}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Ort,
        }}
        value={editData?.Ort || ''}
        onChange={handleChange}
      />
      {errors?.Ort && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const Land = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Land"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Land"
        fullWidth
        label="Land"
        variant="outlined"
        {...register('Land', { required: true })}
        error={!!errors.Land}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Land,
        }}
        value={editData?.Land || ''}
        onChange={handleChange}
      />
      {errors?.Land && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
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

const PhoneNumber = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Telefonnummer"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Telefonnummer"
        fullWidth
        label="Telefonnummer"
        variant="outlined"
        {...register('Telefonnummer', {
          required: 'Dieses Feld ist ein Pflichtfeld',
          pattern: {
            value: /^\d{1,20}$/,
            message: 'Ungültiges Telefonnummer.',
          },
        })}
        error={!!errors.Telefonnummer}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.Telefonnummer,
        }}
        value={editData?.Telefonnummer || ''}
        onChange={handleChange}
      />
      {errors?.Telefonnummer && (
        <span className="validationErr">
          {errors.Telefonnummer?.message ? errors.Telefonnummer?.message : null}
        </span>
      )}
    </Grid>
  );
};

const Diagnosis = ({ register, errors, editData, handleDiagnose }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <Autocomplete
        sx={{ mt: 2 }}
        multiple
        freeSolo
        options={[]}
        value={editData?.Diagnose || []}
        name="Diagnose"
        id="Diagnose"
        {...register('Diagnose', {
          required: editData?.Diagnose?.length > 0 ? false : true,
        })}
        onChange={(_, newValue) => {
          handleDiagnose(newValue);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={index}
              variant="outlined"
              label={option}
              // {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Diagnose"
            placeholder="Weitere Diagnose hinzufügen"
            error={!!errors.Diagnose}
            InputLabelProps={{
              shrink: !!editData?.Diagnose,
            }}
            inputProps={{
              ...params.inputProps,
              className: 'interFonts',
            }}
          />
        )}
      />

      {errors?.Diagnose && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

const DateSelect = ({
  register,
  errors,
  editData,
  handleDOBChange,
  handleBlur,
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
        value={editData?.Geburtsdatum ? new Date(editData?.Geburtsdatum) : null}
        onChange={handleDOBChange}
        onAccept={handleBlur}
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

export {
  CipherInput,
  Salutation,
  Title,
  Firm,
  FirstName,
  LastName,
  StreetAndHouseNumber,
  PostCode,
  Location,
  Land,
  Email,
  PhoneNumber,
  Diagnosis,
  DateSelect,
};
