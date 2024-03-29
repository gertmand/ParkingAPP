import { Box, Button, Container, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { login } from '../../store/queries/userQueries';
import { User } from '../../store/types/userType';
import Page from '../../style/Page';
import RegisterModal from '../../components/auth/registerModal';

const LoginPage = (props: any) => {
  const classes = useStyles();

  const [userAddModal, setUserAddModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setSubmit] = useState(false);

  

  const handleLogin = () => {
    setSubmit(true);
    login({ email: email, password: password })
      .then((result: User) => {
        localStorage.setItem('token', result.jwtToken);
        if (localStorage.getItem('enterprise') === undefined) {
          localStorage.setItem('enterprise', '0');
        }
        if(localStorage.getItem('email') !== email) {
          localStorage.setItem('enterprise', '0');
        }
        localStorage.setItem('email', email)
        props.history.push('/');
        window.location.reload(false);
        setSubmit(false);
      })
      .catch(err => {
        setSubmit(false);
        if (err.response !== undefined) {
          setError(err.response.data.message);
        } else setError('Vale kasutaja!');
      });
  };
  const onEmailChange = (e: any) => {
    setEmail(e);
  };
  const onPasswordChange = (e: any) => {
    setPassword(e);
  };

  return (
    <Page {...props.children} className={classes.root} title="Login">
      <RegisterModal
        userAddModal={userAddModal}
        setUserAddModal={setUserAddModal}
      />
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'test@test.ee',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Email peab olema õige!')
                .max(255)
                .required('Email on nõutud')
            })}
            //onSubmit={() => {navigate('/app/dashboard', { replace: true });}}>
            onSubmit={() => {
              handleLogin();
            }}
          >
            {({ errors, handleBlur, handleSubmit, touched }) => (
              <form onSubmit={handleSubmit}>
                <Grid container>
                  <Grid item>
                    <Typography color="textPrimary" variant="h2">
                      Logi sisse
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      className={classes.margin}
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Sisesta email ja parool
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => setUserAddModal(!userAddModal)}
                      title="Registreeri uus kasutaja"
                    >
                      <PersonAddIcon color="primary" />
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="E-posti aadress"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onEmailChange(e.target.value);
                  }}
                  type="email"
                  value={email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Parool"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onPasswordChange(e.target.value);
                  }}
                  type="password"
                  value={password}
                  variant="outlined"
                />
                <Box my={1}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    SISENE
                  </Button>
                </Box>
                <Box mb={1}>
                  {error ? (
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="body2"
                    >
                      {error}
                    </Typography>
                  ) : null}
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    minWidth: 120
  },
  margin: {
    marginTop: theme.spacing(1)
  }
}));

export default LoginPage;

