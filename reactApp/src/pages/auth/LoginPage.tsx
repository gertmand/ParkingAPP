import { Box, Button, Container, makeStyles, TextField, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { authenticateUser } from '../../services/queries/userQueries';
import Page from '../../style/Page';

const LoginPage = (props: any) => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [isSubmitting, setSubmit] = useState(false);

  const handleLogin = () => {
      setSubmit(true);
      // getUserData(email).then((result) => {
      //     //localStorage.setItem('email', email);
      //     //localStorage.setItem('currentUser', JSON.stringify(result));
      //     setSubmit(false);
      //     //window.location.reload(false);
      //   }).catch((error) => {
      //     setSubmit(false);
      //     setError("E-posti aadress on vale või puudulik!");
      // });

      authenticateUser({email: email, password: password})
      .then((result) => {
        localStorage.setItem('token', result.jwtToken)
        //window.location.reload(false);
        //props.history.push('/');
        setSubmit(false);
      })
      .catch(err => {
        setSubmit(false);
        if(err.response !== undefined) {
          setError(err.response.data.message);
        } else console.log(err)
      })
      
      //window.location.reload(false);
  }

  const onEmailChange = (e: any) => {
      setEmail(e);
  }
  const onPasswordChange = (e: any) => {
      setPassword(e);
  }

  return (
    <Page {...props.children} className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'tootaja@rik.ee',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
              .email('Email peab olema õige!')
                .max(255)
                .required('Email on nõutud'),
            })}
            //onSubmit={() => {navigate('/app/dashboard', { replace: true });}}>
            onSubmit={() => {handleLogin()}}>
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <Typography color="textPrimary" variant="h2">Logi sisse</Typography>
                  <Typography className={classes.margin} color="textSecondary" gutterBottom variant="body2" >Parkimiskoha broneerimiseks sisestage email</Typography>
                </Box>
                <TextField error={Boolean(touched.email && errors.email)} fullWidth helperText={touched.email && errors.email} label="E-posti aadress" margin="normal"  name="email" onBlur={handleBlur} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {onEmailChange(e.target.value); }} type="email" value={email} variant="outlined" />
                <TextField error={Boolean(touched.password && errors.password)} fullWidth helperText={touched.password && errors.password} label="Parool" margin="normal" name="password" onBlur={handleBlur} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {onPasswordChange(e.target.value); }} type="password" value={password} variant="outlined"/>
                <Box my={1}>
                  <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" >
                    SISENE
                  </Button>
                </Box>
                <Box mb={1}>
                  {error ? <Typography color="textPrimary" gutterBottom variant="body2" >{error}</Typography> : ""}
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
    margin: {
      marginTop: theme.spacing(1)
    }
  }));


export default LoginPage;