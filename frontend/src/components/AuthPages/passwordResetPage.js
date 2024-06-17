'use client';
import Layout from '../../components/Layout';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import { useEffect, useState } from 'react';
import Worker from 'worker-loader!./AuthUtils/authWorker';
import toast from 'react-hot-toast';

import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/navigation';

const PasswordResetPage = ({ id }) => {
  const [fileEncVault, setFileEncVault] = useState(false);
  const [clientEncVault, setClientEncVault] = useState(false);
  const [newRecoveryKey, setNewRecoveryKey] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // console.log(fileEncVault, clientEncVault, newRecoveryKey);
    if (fileEncVault && clientEncVault && newRecoveryKey) {
      // console.log(fileEncVault, clientEncVault, newRecoveryKey);
      (async () => {
        const resVault = await axiosInstance.post(`/vault/user/update`, {
          fileVault: fileEncVault,
          clientVault: clientEncVault,
          recoveryKey: newRecoveryKey,
          reqType: 'accountReset',
        });
        console.log(resVault);
        if (resVault.status === 200) {
          toast.success('Das Zurücksetzen des Kontos war erfolgreich');
          router.push(`/login`);
        }
      })();
    }
  }, [fileEncVault, clientEncVault, newRecoveryKey]);

  const onSubmit = async (data) => {
    // TODO: rest password.
    const psymaxToken = localStorage.getItem('psymax-token');
    const authWorker = new Worker();
    toast('Zurücksetzen des Kontos wird ausgeführt');

    authWorker.postMessage({
      type: 'restoreAccountEncryption',
      data: JSON.stringify({
        data,
        id,
        psymaxToken,
      }),
    });
    authWorker.onmessage = (message) => {
      toast.success('Kontoverzeichnisse wurden verschlüsselt');
      const restoredData = JSON.parse(message.data);
      setNewRecoveryKey(restoredData.setNewRecoveryKey);
      setFileEncVault(restoredData.setFileEncVault);
      setClientEncVault(restoredData.setClientEncVault);
    };
  };

  return (
    <>
      <Layout>
        <div className="main-content">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-middle">
              <Grid container>
                <Grid item xs={12}>
                  <p className="text-center mt-16 interFonts text-2xl font-semibold text[#0e0e0e]">
                    reset account password
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
                    name="password"
                    type="password"
                    focusColor="#3C3C3C"
                    id="password"
                    label="password"
                    variant="outlined"
                    {...register('password', { required: true })}
                    error={!!errors.password}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.password && (
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
                    id="passwordConfirm"
                    label="Password confirm"
                    variant="outlined"
                    {...register('passwordConfirm', { required: true })}
                    error={!!errors.password}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.password && (
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
        </div>
      </Layout>
    </>
  );
};

export default PasswordResetPage;
