import { Grid, useMediaQuery } from '@mui/material';

import CssTextField from '../../components/CssTextField';

const TitleInput = ({ register, errors, setValues, values }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const spacing = isMobile ? 0 : 2;
  const handleChange = (e) => {
    const value = e.target.value;
    setValues({ ...values, title: value });
  };

  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <CssTextField
          key="title"
          name="title"
          sx={{ mt: 2 }}
          type="text"
          fullWidth
          label="title"
          variant="outlined"
          {...register('title', { required: true })}
          error={!!errors.title}
          InputProps={{
            className: 'interFonts',
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={values?.title || ''}
          onChange={handleChange}
        />

        {errors?.title && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </Grid>
    </Grid>
  );
};

export default TitleInput;
