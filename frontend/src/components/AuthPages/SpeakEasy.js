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

// generate TwoFaCode

const SpeakEasyPage = ({ id, type }) => {
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
    (async () => {
      // console.log(data);
      if (data?.code) {
        let reqObj = {
          token: data.code,
          userId: id,
          reqType: 'twoFA',
        };
        if (type === 'recovery') {
          reqObj.reqType = 'accountReset';
        }
        try {
          const twoFaRes = await axiosInstance.post(`/user/verify`, reqObj);
          // console.log(twoFaRes);
          if (twoFaRes.status === 200) {
            toast.success('code is Valid');
            if (type === 'login') {
              router.push('/dashboard');
            }
            if (type === 'recovery') {
              router.push(`/recoveryphrase/${id}`);
            }
          }
        } catch (error) {
          toast.error('code is Invalid');
        }
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
                Two Factor Authentication
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
                  name="code"
                  type="password"
                  focusColor="#3C3C3C"
                  id="code"
                  label="code"
                  variant="outlined"
                  {...register('code', { required: true })}
                  error={!!errors.code}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.code && (
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

export default SpeakEasyPage;
