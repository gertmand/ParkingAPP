import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormHelperText, MenuItem, TextField} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../common/siteActions';
import { addUser, checkExistingEmail} from '../../store/queries/userQueries';

type Props = {
    userAddModal:boolean;
    setUserAddModal(e: boolean): any,
  };
  
export const RegisterModal: FC<Props> = ({userAddModal,setUserAddModal}: any) => {
  const dispatch = useDispatch();
  const [buttonLoading, setLoading] = useState(false);
  const [, setSuccess] = React.useState(false);
  const handleClose = () => {
    setTitle('');
    setFirstName('');
    setLastName('');
    setEmailForAdd('');
    setPasswordForAdd('');
    setConfirmPasswordForAdd('');
    setAcceptTerms(false);
    setUserAddModal(false);
  };
  const [emailForAdd, setEmailForAdd] = useState('');
  function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);

    return debouncedValue;
  }
  const debouncedValue = useDebounce<string>(emailForAdd, 500);

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordForAdd, setPasswordForAdd] = useState('');
  const [confirmPasswordForAdd, setConfirmPasswordForAdd] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [emailErrorText, setEmailErrorText] = useState('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');

  const handleTitleChange = (titleName: string) => {
    setTitle(titleName);
    setTitleError(false);
  };
  const handleFirstNameChange = (e: any) => {
    setFirstName(e);
    setFirstNameError(false);
  };
  const handleLastNameChange = (e: any) => {
    setLastName(e);
    setLastNameError(false);
  };
  const handleEmailChange = (e: any) => {
    setEmailForAdd(e);
    setEmailError(false);
  };
  const handlePasswordChange = (e: any) => {
    setPasswordForAdd(e);
    setPasswordError(false);
  };
  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPasswordForAdd(e);
    setConfirmPasswordError(false);
  };

  //TODO: useEffect efektiivsemaks. Hetkel timeriga paus sisse jäetud, et liialt palju päringuid ei tuleks.
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  useEffect(() => {
    const fetchResult = async () => { checkExistingEmail(debouncedValue).then(result => setEmailCheck(result)); };
    fetchResult();
  }, [debouncedValue]);

  const genders = [
    { value: 'mees', label: 'mees' },
    { value: 'naine', label: 'naine' }
  ];

  const handleUserAdd = async () => {

    if ((title && firstName && lastName && emailForAdd && passwordForAdd && confirmPasswordForAdd && acceptTerms) !== undefined && 
        passwordForAdd === confirmPasswordForAdd &&
        acceptTerms === true &&
        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailForAdd)
    ) {
      if (emailCheck) {
        setLoading(true);
        setSuccess(false);
        addUser({title: title, firstName: firstName, lastName: lastName, email: emailForAdd, password: passwordForAdd, confirmPassword: confirmPasswordForAdd, acceptTerms: acceptTerms})
          .then(result => {
            setLoading(false);
            setSuccess(true);
            handleClose();
            dispatch(
              SET_SUCCESS_ALERT({ status: true, message: 'Kasutaja lisatud!' })
            );
          })
          .catch((err: any) => {
            setLoading(false);
            dispatch(
              SET_ERROR_ALERT({
                status: true,
                message: err.response.data.message
              })
            );
          });
      } else {
        dispatch(
          SET_ERROR_ALERT({
            status: true,
            message: 'Selline email on juba registreeritud'
          })
        );
        setEmailErrorText('Selline email on juba olemas');
        setEmailError(true);
      }
    } 
    else if (title === '') setTitleError(true);
    else if (firstName === '') setFirstNameError(true);
    else if (lastName === '') setLastNameError(true);
    else if (emailForAdd === '') {
      setEmailError(true);
      setEmailErrorText('Kohustuslik väli');
    } 
    else if (!/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailForAdd)){
      setEmailError(true);
      setEmailErrorText('Email on vales formaadis.');
    } 
    else if (passwordForAdd === '') setPasswordError(true);
    else if (confirmPasswordForAdd === '') {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorText('Kohustuslik väli!');
    } 
    else if (passwordForAdd !== confirmPasswordForAdd) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorText('Paroolid erinevad');
    }
  };


  return (
    <>
      <Dialog
        open={userAddModal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Registreeru</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Peale registreerimist on võimalik koheselt sisse logida.
          </DialogContentText>
          <TextField
            required
            id="gender"
            select
            value={title}
            error={titleError ? true : false}
            helperText={titleError ? 'Kohustuslik väli!' : 'Palun määra sugu.'}
            onChange={event => handleTitleChange(event.target.value)}
          >
            {genders.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            onChange={event => handleFirstNameChange(event.target.value)}
            autoFocus
            margin="dense"
            error={firstNameError ? true : false}
            helperText={firstNameError ? 'Kohustuslik väli!' : ''}
            id="firstName"
            label="Eesnimi"
            type="textPrimary"
            fullWidth
          />
          <TextField
            required
            onChange={event => handleLastNameChange(event.target.value)}
            autoFocus
            margin="dense"
            error={lastNameError ? true : false}
            helperText={lastNameError ? 'Kohustuslik väli!' : ''}
            id="lastName"
            label="Perekonnanimi"
            type="textPrimary"
            fullWidth
          />
          <TextField
            required
            onChange={event => handleEmailChange(event.target.value)}
            autoFocus
            margin="dense"
            error={emailError ? true : false}
            helperText={emailError ? emailErrorText : ''}
            id="email"
            label="Email"
            type="email"
            fullWidth
          />
          <TextField
            required
            onChange={event => handlePasswordChange(event.target.value)}
            autoFocus
            margin="dense"
            error={passwordError ? true : false}
            helperText={passwordError ? 'Kohustuslik väli!' : ''}
            id="password"
            label="Parool"
            type="Password"
            fullWidth
          />
          <TextField
            required
            onChange={event => handleConfirmPasswordChange(event.target.value)}
            autoFocus
            margin="dense"
            error={confirmPasswordError ? true : false}
            helperText={confirmPasswordError ? confirmPasswordErrorText : ''}
            id="confirmPassword"
            label="Kinnita parool"
            type="password"
            fullWidth
          />
          <FormHelperText error={!acceptTerms ? true : false}>
            <FormControlLabel
              value="end"
              control={<Checkbox required checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} color="primary"/>}
              label="Nõustun kasutustingimustega"
              labelPlacement="end"
            />
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Loobu
          </Button>
          <Button disabled={buttonLoading} onClick={() => {handleUserAdd();}} color="primary">
            Registreeru
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterModal;