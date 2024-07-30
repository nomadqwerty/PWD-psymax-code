import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import CssTextField from '../../CssTextField';
import { useRouter } from 'next/navigation';

const DoctorTitle = ({
  Controller,
  control,
  register,
  errors,
  editData,
  setValue,
  handleChange,
}) => {
  return (
    <Grid item xs={12} sm={12} md={3} xl={3}>
      <FormControl sx={{ mt: [2, 0, 4] }} fullWidth>
        <InputLabel
          id="ArztAnrede"
          className="text-md"
          sx={{
            fontStyle: 'normal',
            fontWeight: 400,
          }}
        >
          Anrede
        </InputLabel>
        <Controller
          name="ArztAnrede"
          control={control}
          defaultValue={editData?.ArztAnrede || ''}
          render={({ field }) => (
            <Select
              labelId="ArztAnrede"
              label="ArztAnrede"
              fullWidth
              {...field}
              error={!!errors.ArztAnrede}
              {...register('ArztAnrede', { required: true })}
              onChange={(e) => {
                setValue('ArztAnrede', e?.target?.value, {
                  shouldValidate: true,
                });
                handleChange(e);
              }}
              value={field.value || ''}
            >
              <MenuItem value={'Herr'}>männlich</MenuItem>
              <MenuItem value={'Frau'}>weiblich</MenuItem>
              <MenuItem value={' '}>divers</MenuItem>
            </Select>
          )}
        />
        {errors?.ArztAnrede && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </FormControl>
    </Grid>
  );
};

const DoctorSalutation = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={3} xl={3}>
      <CssTextField
        name="ArztTitel"
        sx={{ mt: [2, 0, 4] }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztTitel"
        fullWidth
        label="Titel"
        variant="outlined"
        {...register('ArztTitel')}
        error={!!errors.ArztTitel}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztTitel,
        }}
        value={editData?.ArztTitel || ''}
        onChange={handleChange}
      />
    </Grid>
  );
};

const DoctorFirstName = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        key="ArztVorname"
        name="ArztVorname"
        sx={{ mt: 2 }}
        type="text"
        fullWidth
        label="Vorname"
        variant="outlined"
        {...register('ArztVorname', { required: true })}
        error={!!errors.ArztVorname}
        InputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztVorname,
        }}
        value={editData?.ArztVorname || ''}
        onChange={handleChange}
      />

      {errors?.ArztVorname && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const DoctorLastName = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztNachname"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztNachname"
        fullWidth
        label="Nachname"
        variant="outlined"
        {...register('ArztNachname', { required: true })}
        error={!!errors.ArztNachname}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztNachname,
        }}
        value={editData?.ArztNachname || ''}
        onChange={handleChange}
      />
      {errors?.ArztNachname && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

const DoctorStreetAndHouseNumber = ({
  register,
  errors,
  editData,
  handleChange,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztStrasse_und_Hausnummer"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztStrasse_und_Hausnummer"
        fullWidth
        label="Strasse und Hausnummer"
        variant="outlined"
        {...register('ArztStrasse_und_Hausnummer', {
          required: true,
        })}
        error={!!errors.ArztStrasse_und_Hausnummer}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztStrasse_und_Hausnummer,
        }}
        value={editData?.ArztStrasse_und_Hausnummer || ''}
        onChange={handleChange}
      />
      {errors?.ArztStrasse_und_Hausnummer && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const DoctorPostCode = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztPLZ"
        sx={{ mt: [2, 0, 2] }}
        type="number"
        focusColor="#3C3C3C"
        id="ArztPLZ"
        fullWidth
        label="PLZ"
        variant="outlined"
        {...register('ArztPLZ', {
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
        error={!!errors.ArztPLZ}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztPLZ,
        }}
        value={editData?.ArztPLZ || ''}
        onChange={handleChange}
      />
      {errors?.ArztPLZ && (
        <span className="validationErr pl-2">{errors?.ArztPLZ?.message}</span>
      )}
    </Grid>
  );
};

const DoctorLocation = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztOrt"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztOrt"
        fullWidth
        label="Ort"
        variant="outlined"
        {...register('ArztOrt', { required: true })}
        error={!!errors.ArztOrt}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztOrt,
        }}
        value={editData?.ArztOrt || ''}
        onChange={handleChange}
      />
      {errors?.ArztOrt && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const DoctorLand = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztLand"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztLand"
        fullWidth
        label="Land"
        variant="outlined"
        {...register('ArztLand', { required: true })}
        error={!!errors.ArztLand}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztLand,
        }}
        value={editData?.ArztLand || ''}
        onChange={handleChange}
      />
      {errors?.ArztLand && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const DoctorEmail = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztEmail"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztEmail"
        fullWidth
        label="Email"
        variant="outlined"
        {...register('ArztEmail', {
          required: 'Dieses Feld ist ein Pflichtfeld',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'Die E-Mail-Adresse sollte korrekt sein.',
          },
        })}
        error={!!errors.ArztEmail}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztEmail,
        }}
        value={editData?.ArztEmail || ''}
        onChange={handleChange}
      />
      {errors?.ArztEmail && (
        <span className="validationErr">
          {errors.ArztEmail?.message ? errors.ArztEmail?.message : null}
        </span>
      )}
    </Grid>
  );
};

const DoctorPhoneNumber = ({ register, errors, editData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ArztTelefonnummer"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="ArztTelefonnummer"
        fullWidth
        label="Telefonnummer"
        variant="outlined"
        {...register('ArztTelefonnummer', {
          required: 'Dieses Feld ist ein Pflichtfeld',
          pattern: {
            value: /^\d{1,20}$/,
            message: 'Ungültiges Telefonnummer.',
          },
        })}
        error={!!errors.ArztTelefonnummer}
        inputProps={{
          className: 'interFonts',
        }}
        InputLabelProps={{
          shrink: !!editData?.ArztTelefonnummer,
        }}
        value={editData?.ArztTelefonnummer || ''}
        onChange={handleChange}
      />
      {errors?.ArztTelefonnummer && (
        <span className="validationErr">
          {errors.ArztTelefonnummer?.message
            ? errors.ArztTelefonnummer?.message
            : null}
        </span>
      )}
    </Grid>
  );
};

const Remove = ({ isEdit, setOpen }) => {
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
          isEdit && setOpen(true);
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
        disabled={isSubmitting}
        className="text-center text-sm font-medium interFonts rounded-[8px] justify-center items-center w-22 h-[42px] px-5 py-2 gap-2.5 inline-flex bg-[#EEE] text-[#0E0E0E] hover:bg-[#2B86FC] hover:text-[#FFFFFF]"
      >
        Bestätigen
      </button>
    </Grid>
  );
};

const KlientAction = ({ params, router }) => {
  const id = params.id;

  return (
    <Grid
      item
      xs={12}
      md={3.5}
      sm={7}
      xl={3.5}
      sx={{ textAlign: 'center', mt: 3, display: 'flex' }}
      className="login"
    >
      <button
        type="submit"
        style={{
          width: '100%',
          color: '#989898',
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '20px',
          marginRight: '20px',
        }}
        className="h-[42px] px-5 py-2 rounded-[4px] justify-center items-center text-center text-sm interFonts"
        onClick={() => {
          if (id) {
            router.push(`/dashboard/brief/${id}`);
          }
        }}
      >
        <span style={{ color: '#0E0E0E' }}>Brief</span>
      </button>
      <button
        type="submit"
        style={{
          width: '100%',
          color: '#989898',
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '20px',
        }}
        className="h-[42px] px-5 py-2 rounded-[4px] justify-center items-center text-center text-sm interFonts"
        onClick={() => {
          if (id) {
            router.push(`/dashboard/email/${id}`);
          }
        }}
      >
        <span style={{ color: '#0E0E0E' }}>Email</span>
      </button>
    </Grid>
  );
};

export {
  DoctorTitle,
  DoctorSalutation,
  DoctorFirstName,
  DoctorLastName,
  DoctorStreetAndHouseNumber,
  DoctorPostCode,
  DoctorLocation,
  DoctorLand,
  DoctorEmail,
  DoctorPhoneNumber,
  Remove,
  Confirm,
  KlientAction,
};
