import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

import CssTextField from '../../components/CssTextField';

const TitleInput = ({
  spacing,
  kontoData,
  setKontoData,
  handleChange,
  Controller,
  register,
  control,
  setValue,
  errors,
}) => {
  let registerObj = register('Anrede', { required: true });

  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={3} xl={3}>
        <FormControl sx={{ mt: 4 }} fullWidth>
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
            control={control}
            defaultValue={kontoData?.Anrede}
            name={registerObj?.name || 'Anrede'}
            onChange={registerObj?.onChange}
            onBlur={registerObj?.onBlur}
            innerRef={registerObj?.ref}
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
                value={field.value || ''}
              >
                <MenuItem value={'Herr'}>männlich</MenuItem>
                <MenuItem value={'Frau'}>weiblich</MenuItem>
                <MenuItem value={' '}>divers</MenuItem>
              </Select>
            )}
          />
          {errors?.Anrede && (
            <span className="validationErr">
              Dieses Feld ist ein Pflichtfeld
            </span>
          )}
        </FormControl>
      </Grid>
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
            shrink: !!kontoData?.Titel,
          }}
          value={kontoData?.Titel || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default TitleInput;
