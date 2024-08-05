import {
  Grid,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
} from '@mui/material';
import CssTextField from '../../components/CssTextField';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import toast from 'react-hot-toast';

const Secret = ({ show }) => {
  const [secret, setSecret] = useState(null);
  const [twoFaQr, setTwoFaQr] = useState(null);
  useEffect(() => {
    if (show) {
      axiosInstance.get(`/user/text`).then((res) => {
        if (res.status === 200) {
          if (res?.data?.data?.text) {
            console.log('here');
            setSecret(res.data.data.text);
          }
          if (res?.data?.data?.url) {
            console.log('here');
            setTwoFaQr(res.data.data.url);
          }
        }
      });
    }
  }, [show]);
  console.log(twoFaQr);
  if (show) {
    return (
      <Grid item xs={12} sm={12} md={6} xl={6} style={{ textAlign: 'center' }}>
        <img src={twoFaQr || '#'}></img>
        <CssTextField
          name="newPassword"
          sx={{ mt: 2 }}
          type="password"
          focusColor="#3C3C3C"
          id="2fa secret"
          fullWidth
          variant="outlined"
          autoComplete="new-password"
          inputProps={{
            className: 'interFonts',
          }}
          value={'12345678901234567890123456789012345678901234567890'}
        />
        <button
          type="button"
          className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
          onClick={() => {
            if (show) {
              axiosInstance.get(`/user/text/email`).then((res) => {
                console.log(res);
                if (res.status === 200) {
                  toast.success('sent to email');
                }
              });
            }
          }}
          style={{ margin: '10px' }}
        >
          Send to Email
        </button>
        <button
          type="button"
          className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
          onClick={() => {
            if (navigator?.clipboard && secret) {
              navigator.clipboard.writeText(secret);
              toast.success('copied to clipboard');
            }
          }}
          style={{ margin: '10px' }}
        >
          Copy
        </button>
      </Grid>
    );
  } else {
    return <div></div>;
  }
};
const TwoFA = ({
  spacing,
  kontoData,
  handleChange,
  register,
  errors,
  responseData,
  values,
}) => {
  let twoPermission = values?.TwoFA?.permission;
  useEffect(() => {
    twoPermission = values?.TwoFA?.permission;
    console.log(twoPermission);
  }, [values]);
  return (
    <Grid container spacing={spacing} style={{ alignItems: 'center' }}>
      <Grid item xs={12} sm={12} md={6} xl={6}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue=""
          name="TwoFaPermission"
          onChange={handleChange}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
          {/* if 2fa add secret to front end */}
        </RadioGroup>
        <Secret show={twoPermission} />
      </Grid>
    </Grid>
  );
};

export { TwoFA };
