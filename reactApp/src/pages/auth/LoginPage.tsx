import { Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormHelperText, Grid, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../components/common/siteActions';
import { addUser, login } from '../../store/queries/userQueries';
import { User } from '../../store/types/userType';
import Page from '../../style/Page';

const LoginPage = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [, setSuccess] = React.useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [isSubmitting, setSubmit] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};

  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailForAdd, setEmailForAdd] = useState("");
  const [passwordForAdd, setPasswordForAdd] = useState("");
  const [confirmPasswordForAdd, setConfirmPasswordForAdd] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [titleError,setTitleError] = useState(false);
  const [firstNameError,setFirstNameError] = useState(false);
  const [lastNameError,setLastNameError] = useState(false);
  const [emailError,setEmailError] = useState(false);
  const [passwordError,setPasswordError] = useState(false);
  const [confirmPasswordError,setConfirmPasswordError] = useState(false);

  const [emailErrorText, setEmailErrorText] = useState("");
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState("");


  const handleTitleChange = (titleName:string) => {
    setTitle(titleName);
    setTitleError(false);
  }
  const handleFirstNameChange = (e: any) => {
    setFirstName(e);
    setFirstNameError(false);
  }
  const handleLastNameChange = (e: any) => {
    setLastName(e);
    setLastNameError(false);
  }
  const handleEmailChange = (e: any) => {
    setEmailForAdd(e);
    setEmailError(false);
  }
  const handlePasswordChange = (e: any) => {
    setPasswordForAdd(e);
    setPasswordError(false);
  }
  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPasswordForAdd(e);
    setConfirmPasswordError(false);
  }

  const genders = [
    {value: 'mees', label :'Mr.'},
    {value: 'naine', label : 'Mrs.'}
  ]

  const handleLogin = () => {
    setSubmit(true);
    login({email: email, password: password})
      .then((result: User) => {
        localStorage.setItem('token', result.jwtToken)
        if(localStorage.getItem('enterprise') === undefined) {
          localStorage.setItem('enterprise', '0')
        }
        props.history.push('/');
        window.location.reload(false);
        setSubmit(false);
      }).catch(err => {
        setSubmit(false);
        if(err.response !== undefined) {
          setError(err.response.data.message);
        } else setError("Something went wrong!")
    })
}

  const onEmailChange = (e: any) => {setEmail(e);}
  const onPasswordChange = (e: any) => {setPassword(e);}


  const handleUserAdd = async () => {
    if ((title && firstName && lastName && emailForAdd && passwordForAdd && confirmPasswordForAdd && acceptTerms) !==undefined && passwordForAdd === confirmPasswordForAdd && acceptTerms === true && 
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailForAdd)) {
      setLoading(true);
      setSuccess(false);
      addUser({ title:title,firstName:firstName,lastName:lastName,email:emailForAdd,password:passwordForAdd,confirmPassword:confirmPasswordForAdd,acceptTerms:acceptTerms })
          .then((result) => {
              setLoading(false);
              setSuccess(true);
              handleClose();
              dispatch(SET_SUCCESS_ALERT({ status: true, message: "Kasutaja lisatud!" }));
          }).catch((err: any) => {
              setLoading(false);
              dispatch(SET_ERROR_ALERT({ status: true, message: err.response.data.message }));
          })
      }
      else if(title === "") setTitleError(true); 
      else if(firstName === "") setFirstNameError(true); 
      else if(lastName === "") setLastNameError(true); 
      else if(emailForAdd === "") {setEmailError(true); setEmailErrorText("Kohustuslik väli"); }
      else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailForAdd)) {setEmailError(true); setEmailErrorText("Email on vales formaadis."); }
      else if(passwordForAdd === "") setPasswordError(true); 
      else if(confirmPasswordForAdd === "") {setConfirmPasswordError(true); setConfirmPasswordErrorText("Kohustuslik väli!"); }
      else if(passwordForAdd !== confirmPasswordForAdd) {setConfirmPasswordError(true); setConfirmPasswordErrorText("Paroolid erinevad"); }
  }
  return (

    

    <Page {...props.children} className={classes.root} title="Login">


      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Registreeru</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kasutaja lisamisel suunatakse kasutaja järgmisena keskkonna seadistamise lehele, 
            kus määratakse asutuse tüüp ning listakse esmased kasutajad ja parkimiskohad.
          </DialogContentText>
          <TextField required  id="gender" select value={title} error={titleError? true : false} helperText={titleError? "Kohustuslik väli!":"Palun määra sugu."} onChange={(event)=> handleTitleChange(event.target.value)}>
            {genders.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
          </TextField>
          <TextField required onChange={(event)=> handleFirstNameChange(event.target.value)} autoFocus margin="dense" error={firstNameError? true : false} helperText={firstNameError? "Kohustuslik väli!":""} id="firstName" label="Eesnimi" type="textPrimary" fullWidth/>
          <TextField required onChange={(event)=> handleLastNameChange(event.target.value)} autoFocus margin="dense" error={lastNameError? true : false} helperText={lastNameError? "Kohustuslik väli!":""} id="lastName" label="Perekonnanimi" type="textPrimary" fullWidth/>
          <TextField required onChange={(event)=> handleEmailChange(event.target.value)} autoFocus margin="dense" error={emailError? true : false} helperText={emailError? emailErrorText:""} id="email" label="Email" type="email" fullWidth/>
          <TextField required onChange={(event)=> handlePasswordChange(event.target.value)} autoFocus margin="dense" error={passwordError? true : false} helperText={passwordError? "Kohustuslik väli!":""} id="password" label="Parool" type="Password" fullWidth/>
          <TextField required onChange={(event)=> handleConfirmPasswordChange(event.target.value)} autoFocus margin="dense" error={confirmPasswordError? true : false} helperText={confirmPasswordError? confirmPasswordErrorText:""} id="confirmPassword" label="Kinnita parool" type="password" fullWidth/>
          <FormHelperText error={!acceptTerms?true:false} ><FormControlLabel value="end" control={<Checkbox required checked={acceptTerms} onChange={()=>setAcceptTerms(!acceptTerms)} color="primary"/>} label="Nõustun kasutustingimustega" labelPlacement="end"/></FormHelperText> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Loobu
          </Button>
          <Button onClick={()=>handleUserAdd()} color="primary">
            Registreeru
          </Button>
        </DialogActions>
      </Dialog>


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
                .required('Email on nõutud'),
            })}
            //onSubmit={() => {navigate('/app/dashboard', { replace: true });}}>
            onSubmit={() => {handleLogin()}}>
            {({ errors, handleBlur, handleSubmit, touched
            }) => (
              <form onSubmit={handleSubmit}>
                  <Grid container>
                    <Grid item><Typography color="textPrimary" variant="h2">Logi sisse</Typography></Grid>
                  </Grid>
                  <Grid container justify="space-between">
                    <Grid item><Typography className={classes.margin} color="textSecondary" gutterBottom variant="body2" >Sisesta email ja parool</Typography></Grid>
                    <Grid item><Button onClick={handleClickOpen} title="Registreeri uus kasutaja"><PersonAddIcon color="primary" /></Button></Grid>
                  </Grid>
                <TextField error={Boolean(touched.email && errors.email)} fullWidth helperText={touched.email && errors.email} label="E-posti aadress" margin="normal"  name="email" onBlur={handleBlur} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {onEmailChange(e.target.value); }} type="email" value={email} variant="outlined" />
                <TextField error={Boolean(touched.password && errors.password)} fullWidth helperText={touched.password && errors.password} label="Parool" margin="normal" name="password" onBlur={handleBlur} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {onPasswordChange(e.target.value); }} type="password" value={password} variant="outlined"/>
                <Box my={1}>
                  <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" >
                    SISENE
                  </Button>
                </Box>
                <Box mb={1}>
                  {error ? <Typography color="textPrimary" gutterBottom variant="body2" >{error}</Typography> : null}
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
      minWidth: 120,
    },
    margin: {
      marginTop: theme.spacing(1)
    }
  }));


export default LoginPage;

