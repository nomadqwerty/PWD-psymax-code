'use client';
import Layout from '../../components/Layout';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import { useEffect, useState } from 'react';
import { passwordGenerator } from '../../utils/utilityFn';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
let twoFaCode;

const TwoFactorEmailAuth = ({ id }) => {
  const [sent, setSent] = useState(false);
  const [timeSent, setTimeSent] = useState(false);
  const [code, setCode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
    (async () => {
      const twoFaRes = await axiosInstance.post(`/user/twofactor`, {
        code: twoFaCode,
        email: data.email,
        reqType: 'accountReset',
      });
      // console.log(twoFaRes);
      if (twoFaRes.status === 200) {
        toast.success('E-Mail-Bestätigung abgeschlossen');
        // console.log(twoFaRes.data.data.userId);
        router.push(`/emailverification/${twoFaRes.data.data.userId}-recovery`);
      } else {
        toast.error('E-Mail-Bestätigung fehlgeschlagen');
        router.push(`/login`);
      }
    })();
  };

  return (
    <>
      <Layout>
        <form
          id="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(getValues());
            // console.log('here');
          }}
        >
          <div className="main-content" style={{ height: '40vh' }}>
            <Grid item xs={12}>
              <p
                className="text-center mt-16 interFonts text-2xl font-semibold text[#0e0e0e]"
                style={{ marginTop: '150px' }}
              >
                Verify Your Email.
              </p>
            </Grid>
            <Grid container>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
              <Grid
                item
                xs={12}
                md={3.5}
                sm={7}
                xl={3.5}
                sx={{ textAlign: 'center', mt: 3 }}
              >
                <CssTextField
                  fullWidth
                  name="email"
                  type="email"
                  focusColor="#3C3C3C"
                  id="email"
                  label="email"
                  variant="outlined"
                  {...register('email', { required: true })}
                  error={!!errors.email}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.email && (
                  <p className="validationErr">
                    Dieses Feld ist ein Pflichtfeld
                  </p>
                )}
              </Grid>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
            </Grid>
            <Grid container>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
              <Grid
                item
                xs={12}
                md={3.5}
                sm={7}
                xl={3.5}
                sx={{ textAlign: 'center', mt: 3 }}
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
                  }}
                  className="h-[42px] px-5 py-2 rounded-[4px] justify-center items-center text-center text-sm interFonts"
                >
                  <span style={{ color: '#0E0E0E' }}>Submit</span>
                </button>
              </Grid>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
            </Grid>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default TwoFactorEmailAuth;
