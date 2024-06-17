'use client';
import Layout from '../../components/Layout';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import { useEffect, useState } from 'react';
import { passwordGenerator } from '../../utils/utilityFn';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/navigation';
let twoFaCode;
import toast from 'react-hot-toast';

const RecoveryPhrasePage = ({ id }) => {
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
    // TODO: verify phrase.
    (async () => {
      // console.log(data);
      toast('Überprüfung der Wiederherstellungsphrase');
      const recoveryRes = await axiosInstance.post(`/user/recoveryphrase`, {
        userId: id,
        phrase: data.phrase,
        reqType: 'accountReset',
      });
      // console.log(recoveryRes);
      if (recoveryRes.status === 200) {
        toast.success('verifizierter Wiederherstellungssatz');
        router.push(`/passwordreset/${recoveryRes.data.data.userId}`);
      } else {
        toast.error('Unverified Recovery phrase');
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
                Verify Your recovery phrase.
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
                  name="phrase"
                  type="phrase"
                  focusColor="#3C3C3C"
                  id="phrase"
                  label="phrase"
                  variant="outlined"
                  {...register('phrase', { required: true })}
                  error={!!errors.phrase}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.phrase && (
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

export default RecoveryPhrasePage;
