import { Grid, IconButton } from '@mui/material';
import CssTextField from '../../components/CssTextField';

import PreviewIcon from '@mui/icons-material/Preview';

const Logo = ({
  kontoData,
  setKontoData,
  handleUploadLogo,
  register,
  errors,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <div className="flex items-center">
        <div className="relative w-full">
          <CssTextField
            name="Logo"
            sx={{
              mt: 2,
            }}
            type="file"
            focusColor="#3C3C3C"
            id="Logo"
            fullWidth
            label="Logo [optional]"
            variant="outlined"
            {...register('Logo')}
            error={!!errors.Logo}
            inputProps={{
              className: 'interFonts text-md w-full',
              accept: 'image/png,image/svg+xml',
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              handleUploadLogo(e.target.files[0]);
            }}
          />
          <IconButton
            color="inherit"
            sx={{
              position: 'absolute',
              right: 0,
              top: '60%',
              transform: 'translateY(-50%)',
              '&:hover': {
                color: '#2b86fc',
              },
            }}
            onClick={() =>
              window.open(
                `${IMAGEURL}uploads/logo/${kontoData?.Logo}`,
                '_blank'
              )
            }
          >
            <PreviewIcon />
          </IconButton>
        </div>
      </div>

      {errors?.Logo && (
        <span className="validationErr pl-2">{errors?.Logo?.message}</span>
      )}
    </Grid>
  );
};

export default Logo;
