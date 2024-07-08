'use client';
import Layout from '../../components/Layout';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import { useEffect, useState } from 'react';
import { passwordGenerator } from '../../utils/utilityFn';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/navigation';
import styles from './authStyles/speakeasy.module.css';
import { birdSvg } from './AuthSvg/2faBird';
import toast from 'react-hot-toast';
import { isNumber } from '@mui/x-data-grid/internals';
// generate TwoFaCode

const SpeakEasyPage = ({ id, type }) => {
  const [sent, setSent] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState([]);
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
    console.log(data);
    console.log('submit');
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

  const handleTwoInput = (e, i) => {
    console.log(e.target.value, ' ', i);

    twoFaCode[i] = e.target.value[0];
    e.target.value = twoFaCode[i] || '';
    setTwoFaCode(twoFaCode);
  };
  useEffect(() => {
    function logKey(e) {
      const text = `${e.code}`;
      if (text === 'Enter') {
        if (twoFaCode.length !== 6) {
          toast.error('incomplete input');
        } else if (twoFaCode.length === 6) {
          let hasUndefined = false;
          twoFaCode.forEach((i) => {
            if (i === undefined) {
              hasUndefined = true;
              toast.error('incomplete input');
            }
          });
          if (!hasUndefined) {
            let keys = twoFaCode.join('');
            keys = Number(keys);
            if (isNumber(keys)) {
              console.log(keys);
              onSubmit({ code: keys });
            }
          }
        }
      }
    }
    const formBtn = document.getElementById('login-two');
    formBtn.addEventListener('keypress', logKey);

    return () => {
      formBtn.removeEventListener('keypress', logKey);
    };
  });
  return (
    <>
      <Layout>
        <form
          id="login-form"
          onSubmit={() => {
            console.log('object');
          }}
        >
          <div className="main-content" style={{ height: 'auto' }}>
            <Grid item xs={12}>
              <div
                className="text-center mt-16 interFonts text-3xl font-semibold text[#0e0e0e]"
                style={{ marginTop: '150px' }}
              >
                <p
                  style={{
                    margin: 'auto',
                    width: '30%',
                  }}
                >
                  Wir warten noch kurz auf die Bestätigung.
                </p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                className="text-center mt-16 interFonts text-2ml font-light text[#0e0e0e]"
                style={{ marginTop: '20px', textAlign: 'center' }}
              >
                <p
                  style={{
                    margin: 'auto',
                    width: '25%',
                  }}
                >
                  Authentifizierungscode an, den wir Ihnen an Ihre Emailadresse
                  gesendet haben.
                </p>
              </div>
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
              ></Grid>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
            </Grid>
            <Grid container>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
              <div className={styles.formTwoFa}>
                <form id="login-two" className={styles.formWrap}>
                  {[1, 2, 3, 4, , 5, 6].map((i) => {
                    return (
                      <input
                        key={i}
                        onChange={(e) => {
                          handleTwoInput(e, i - 1);
                        }}
                        className={styles.formInput}
                      />
                    );
                  })}
                </form>
                <Grid
                  item
                  xs={12}
                  md={3.5}
                  sm={7}
                  xl={3.5}
                  sx={{
                    textAlign: 'center',
                    mt: 3,
                    paddingTop: '100px',
                    paddingBottom: '100px',
                  }}
                >
                  {birdSvg}
                </Grid>
              </div>

              {/* <Grid
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
              </Grid> */}
              <Grid item sm={2.5} md={4.25} xl={4.25} />
            </Grid>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default SpeakEasyPage;
