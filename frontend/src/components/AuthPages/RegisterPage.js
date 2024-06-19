'use client';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axios';
import { SOMETHING_WRONG } from '../../utils/constants';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/auth.context';
import { useRouter } from 'next/navigation';
import zxcvbn from 'zxcvbn';
import Layout from '../../components/Layout';
import { handleApiError } from '../../utils/apiHelpers';
import { passwordGenerator } from '../../utils/utilityFn';

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const { dispatch } = useContext(AuthContext);
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const onSubmit = async (data) => {
    try {
      if (!isRegistering) {
        setIsRegistering(true);
        data.emergencyPassword = passwordGenerator();
        // TODO:
        // isEncrypted: false - pass
        if (data.inviteCode.length === 0) {
          data.inviteCode = undefined;
        }
        console.log(data);
        const response = await axiosInstance.post(`/register`, data);
        const responseData = response?.data;
        console.log(responseData);
        if (response?.status === 200) {
          let user_id = responseData.data.userId;
          let fileVault = JSON.stringify({
            data: [{ fileName: '', fileReference: '', fileKey: '' }],
          });
          let clientVault = JSON.stringify({
            data: [{ clientId: '', clientKey: '' }],
          });

          // create user file and client vaults.
          const resVault = await axiosInstance.post(`/vault/user`, {
            userId: user_id,
            type: 'main',
            isEncrypted: false,

            passwords: fileVault.data,
            clients: clientVault.data,
            reqType: 'register',
          });
          // create user file store.
          const resFile = await axiosInstance.post(`/file/create`, {
            userId: user_id,
            reqType: 'register',
          });
          console.log(resVault, resFile);
          dispatch({ type: 'INITIAL_STATE' });
          router.push('/login');
          toast.success(responseData?.message);
          setIsRegistering(false);
        } else {
          toast.error(SOMETHING_WRONG);
          setIsRegistering(false);
        }
      } else {
        toast('account setup is ongoing, please be patient');
      }
    } catch (error) {
      handleApiError(error, router);
      setIsRegistering(false);
    }
  };
  return (
    <Layout>
      <div className="main-content">
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-middle">
            <Grid container>
              <Grid item xs={12}>
                <p className="text-center mt-16 interFonts text-2xl font-semibold text[#0e0e0e]">
                  Registrieren
                </p>
              </Grid>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
              <Grid
                item
                xs={12}
                md={3.5}
                sm={7}
                xl={3.5}
                sx={{ textAlign: 'center', mt: 4 }}
              >
                <CssTextField
                  fullWidth
                  name="email"
                  type="text"
                  focusColor="#3C3C3C"
                  id="email"
                  label="E-Mail Adresse"
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
              >
                <CssTextField
                  fullWidth
                  name="password"
                  type="password"
                  focusColor="#3C3C3C"
                  id="password"
                  label="Passwort"
                  variant="outlined"
                  {...register('password', {
                    required: 'Dieses Feld ist ein Pflichtfeld',
                    validate: (value) =>
                      zxcvbn(value)?.score >= 3 ||
                      'Das Passwort sollte sicher sein',
                  })}
                  error={!!errors.password}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.password && (
                  <p className="validationErr">{errors?.password?.message}</p>
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
              >
                <CssTextField
                  fullWidth
                  name="confirmPassword"
                  type="password"
                  focusColor="#3C3C3C"
                  id="confirmPassword"
                  label="Passwort wiederholen"
                  variant="outlined"
                  {...register('confirmPassword', {
                    // required: true,
                    validate: (value) =>
                      value === getValues('password') ||
                      'Passwörter stimmen nicht überein',
                  })}
                  error={!!errors.confirmPassword}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />

                {errors?.confirmPassword?.type === 'validate' && (
                  <p className="validationErr">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {errors?.confirmPassword?.type === 'required' && (
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
              >
                <CssTextField
                  fullWidth
                  name="inviteCode"
                  type="text"
                  focusColor="#3C3C3C"
                  id="inviteCode"
                  label="Einladungscode"
                  variant="outlined"
                  {...register('inviteCode')}
                  error={!!errors.inviteCode}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.inviteCode && (
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
              >
                <CssTextField
                  fullWidth
                  name="recoveryPhrase"
                  type="text"
                  focusColor="#3C3C3C"
                  id="recoveryPhrase"
                  label="Wiederherstellungssatz"
                  variant="outlined"
                  {...register('recoveryPhrase', { required: true })}
                  error={!!errors.recoveryPhrase}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.inviteCode && (
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
              >
                <Typography
                  sx={{
                    // width: '14%',
                    margin: 'auto',
                    color: '#989898',
                    textAlign: 'center',
                    fontFamily: 'Inter Tight',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  Falls Sie von einer Kolleg:in eingeladen worden sind, können
                  Sie hier Ihren Einladungscode angeben. Ihre Kolleg:in erhält
                  einen Gratismonat.
                </Typography>
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
                className="register"
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
                  <span style={{ color: '#0E0E0E' }}>Registrieren</span>
                </button>
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
              >
                <Typography
                  sx={{
                    color: '#989898',
                    textAlign: 'center',
                    fontFamily: 'Inter Tight',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  Mit einem Klick auf „Registrieren“, bestätigen Sie die
                  Allgemeinen Geschäftsbedingungen sowie die
                  Datenschutzbestimmungen gelesen und ihnen zugestimmt zu haben.
                </Typography>
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
              >
                <Typography
                  sx={{
                    color: '#989898',
                    textAlign: 'center',
                    fontFamily: 'Inter Tight',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  Sie haben ein Konto und möchten sich anmelden.
                </Typography>
              </Grid>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
            </Grid>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
