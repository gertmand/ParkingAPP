import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormHelperText, MenuItem, TextField } from '@material-ui/core';
import React, { FC, useState } from "react";
import { useDispatch } from 'react-redux';
import { addEnterprise } from '../../store/queries/enterpriseQueries';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../common/siteActions';

type Props = {
    enterpriseAddModal:boolean;
    setEnterpriseAddModal(e: boolean): any,
  };
  
export const EnterpriseAddModal: FC<Props> = ({enterpriseAddModal,setEnterpriseAddModal}: any) => {
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [, setSuccess] = React.useState(false);
  const handleClose = () => {
    setType('');
    setName('');
    setDescription('');
    setAcceptTerms(false);
    setEnterpriseAddModal(false);
  };
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [typeError, setTypeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const handleTypeChange = (type: string) => {
    setType(type);
    setTypeError(false);
  };
  const handleNameChange = (e: any) => {
    setName(e);
    setNameError(false);
  };
  const handleDescriptionChange = (e: any) => {
    setDescription(e);
    setDescriptionError(false);
  };

  const typeOptions = [
    { value: 'EV', label: 'Ettevõte' },
    { value: 'KÜ', label: 'Korteriühistu' },
    { value: 'Haridusasutus', label: 'Kool' },
  ]; 

  const handleUserAdd = async () => {

    if ((type && name && description && acceptTerms) !== undefined && acceptTerms === true ) {
        setLoading(true);
        setSuccess(false);
        //TODO: enterpriseType from enum
        addEnterprise({enterpriseType: type, name: name, description: description, acceptTerms: acceptTerms})
          .then(result => {
            setLoading(false);
            setSuccess(true);
            handleClose();
            dispatch(
              SET_SUCCESS_ALERT({ status: true, message: 'Asutus lisatud!' })
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
    } 
    else if (type === '') setTypeError(true);
    else if (name === '') setNameError(true);
    else if (description === '') setDescriptionError(true);
  };


  return (
    <>
      <Dialog
        open={enterpriseAddModal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Registreeri uus asutus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Peale registreerimist oled koheselt ka asutuse administraatori rollis ning saad administraatori alalehelt lisada kasutajaid ja parkimiskohti.
          </DialogContentText>
          <TextField
            required
            id="typeOptions"
            select
            value={type}
            error={typeError ? true : false}
            helperText={typeError ? 'Kohustuslik väli!' : 'Palun määra asutuse tüüp.'}
            onChange={event => handleTypeChange(event.target.value)}
          >
            {typeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            onChange={event => handleNameChange(event.target.value)}
            autoFocus
            margin="dense"
            error={nameError ? true : false}
            helperText={nameError ? 'Kohustuslik väli!' : ''}
            id="name"
            label="Nimi"
            type="textPrimary"
            fullWidth
          />
          <TextField
            required
            onChange={event => handleDescriptionChange(event.target.value)}
            autoFocus
            multiline
            rows={2}
            rowsMax={4}
            margin="dense"
            error={descriptionError ? true : false}
            helperText={descriptionError ? 'Kohustuslik väli!' : ''}
            id="description"
            label="Kirjeldus"
            type="textPrimary"
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
          <Button onClick={() => {handleUserAdd();}} color="primary">
            Registreeru
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnterpriseAddModal;