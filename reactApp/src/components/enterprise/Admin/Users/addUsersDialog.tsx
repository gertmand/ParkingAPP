import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import React, { FC, useState } from 'react';
import { PlusCircle } from 'react-feather';

type Props = {
    open: boolean;
    inputFieldNumberBoolean?: boolean;
    inputFieldFileBoolean?: boolean;
    selectWorker? : boolean,
    existingUsers?: boolean,
    handleClose(): any;
    onSubmit?(): any;
    inputOnChange?: any,
    dialogTitle: string,
    dialogContextText?: string,
    confirmButton?: string,
    onFileChange?(event: any, values: any) : any,
    selectedUserChange?(event: any, values: any) : any,
  };

const AddUsersDialog: FC<Props> = ({open,inputFieldNumberBoolean,selectWorker,inputFieldFileBoolean,onFileChange, selectedUserChange,parkingSpotIdForUserAdd, existingUsers, handleClose,onSubmit,inputOnChange, dialogTitle, dialogContextText, confirmButton, parkingSpotMainUsers, regularUsers}: any) => {
    const classes = useStyles();
    const [maxWidth,] = React.useState<DialogProps['maxWidth']>('md');
    const [email, setEmail] = useState<string>('');
    const [emails, setEmails] = useState<string[]>([]);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setEmail(event.target.value as string);
      };
    const handleSubmit = (e: React.FormEvent) => {
        if (email)
        {
            email.split(' ').forEach(element => {
               emails.push(element);
            });
            setEmails(emails)
        }
        setEmail('');
        e.preventDefault();
    }
    const confirm = () => {

        // API'le meililisti saatmiseks kasutada 'emails'
        
        setEmails([]);
        setEmail('');
        handleClose()
    }
    return (
        <>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" classes={{ paper: classes.dialogPaper }} fullWidth={true} maxWidth={maxWidth} >
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent >
            <DialogContentText id="alert-dialog-description" >
                {'Mitme emaili korraga lisamiseks eraldage meilid tühikuga!'}
                <br/>
                {'Ladusamaks sisestamiseks kasutage klahvi "ENTER"'}
            </DialogContentText>

            <Container maxWidth={maxWidth} >
            <Grid container spacing={1} >
                <Grid item xs={12}>
                <Paper component="form" className={classes.root} onSubmit={(e) => handleSubmit(e)}>
                <InputBase
                    className={classes.input}
                    placeholder="Sisesta email"
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'search google maps' }}
                    value={email}
                />
                <IconButton onClick={handleSubmit}
                    className={classes.iconButton} aria-label="search">
                    <PlusCircle color="#77d18f" />
                </IconButton>
                </Paper>
                </Grid>
                {emails.length > 0 ? <Grid item xs={12}>
                <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                    <TableCell>Emailid</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {emails !== undefined ? emails.map((row) => (
                    <TableRow key={emails.indexOf(row)} className={classes.rowHeight}>
                        <TableCell component="th" scope="row">
                        {row}
                        </TableCell>
                    </TableRow>
                    )) : null}
                </TableBody>
                </Table>
            </TableContainer>
                </Grid> : ''}
                
            </Grid>
            </Container>

        
            
            </DialogContent>
            <DialogActions>
            <Button onClick={confirm} color="primary">
                Loobu
            </Button>
            {confirmButton === undefined ? "" : 
            <Button onClick={confirm} color="primary" variant="contained">
            {confirmButton}
            </Button>
            }
            
            </DialogActions>
        </Dialog>
    
      
    </>
    )
    
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      //width: 400,
      flexGrow: 1,
      width: '100%',
      
      minHeight: '100%',
    // paddingBottom: theme.spacing(3),
    // paddingTop: theme.spacing(3)
    },
    height: {
        maxHeight: '25%',
        marginLeft: -12,
        margin: 0
    },
    card: {
        margin: 0,
        marginLeft: 7,
        color: theme.palette.text.secondary,
    },
    dialogPaper: {
    //   minHeight: "75vh",
    //   maxHeight: "75vh"
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    rowHeight: {
      height: 44,
    },
  }));

export default AddUsersDialog
