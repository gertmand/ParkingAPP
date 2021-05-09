import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  Tooltip,
  TableContainer,
  TableHead
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, {useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../../Logo';
import {getUserInvitations, setInvitationApprovedStatus}  from '../../../store/queries/enterpriseQueries';
import { PlusCircle, XCircle } from 'react-feather';
import { SET_SUCCESS_ALERT } from '../../../components/common/siteActions';


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  appBar: {
    color: "#fff",
    height:64,
    backgroundColor: "#1b262c"
  },
  link: {
    margin: theme.spacing(1, 1.5),
    color: "white",
    '&:hover': {
      cursor: "pointer",
      textDecoration: "underline"
   },
  }
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const enterprise = useSelector(state => state.user.enterpriseData);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  };



  const [enterpriseInvitations, setEnterpriseInvitations] = useState([]);
  const email = useSelector(state => state.user.userData.email);
  const userId = useSelector(state => state.user.userData.id);
  const dispatch = useDispatch();
  const [openEnterpriseApproveDialog, setOpenEnterpriseApproveDialog] = React.useState(false);
  const handleOpenEnterpriseApproveDialog = () => {setOpenEnterpriseApproveDialog(true);};
  const handleCloseEnterpriseApproveDialog = () => {setOpenEnterpriseApproveDialog(false);};
  const[check,setCheck] = useState(false);
  useEffect(() => {
    if (enterpriseInvitations !== undefined && enterpriseInvitations.length === 0 && check === false)
    {
      getUserInvitations(email).then(result => {
        setEnterpriseInvitations(result);
        setCheck(true);
        })
    }
    return () => {setCheck([]);}
  }, [])

//TODO:Enterprises tuleb viia store alla. 
const handleInvitationApproval = (approved, enterpriseId) => {
  setInvitationApprovedStatus({enterpriseId:enterpriseId, userId : userId, email:email, approved:approved}).then(()=>{
    getUserInvitations(email).then(result => {
      setEnterpriseInvitations(result);
      })
    dispatch(
      SET_SUCCESS_ALERT({ status: true, message: 'Valik kinnitatud!' })
    );
  });
}

  return (
    
    <AppBar className={clsx(classes.root, classes.appBar, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/home">
          <Logo />
        </RouterLink> 
        <Button onClick={handleOpen} style={{backgroundColor: "white"}}>Vajuta siia, et anda tagasisidet!</Button>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <RouterLink to="/enterprise" onClick={() => localStorage.setItem('enterprise', "0")}>
            {Object.entries(enterprise).length !== 0 ? <Typography variant="button" display="block" className={classes.link}>{enterprise.name}</Typography>  : <Typography variant="button" display="block" className={classes.link}>ENTERPRISE</Typography> }
          </RouterLink>
          <IconButton onClick={handleOpenEnterpriseApproveDialog} color="inherit">
            <Badge
              badgeContent={enterpriseInvitations.length}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => handleLogout()}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>


      <Dialog maxWidth={'lg'} onClose={handleCloseEnterpriseApproveDialog} aria-labelledby="simple-dialog-title" open={openEnterpriseApproveDialog}>
      <DialogTitle id="alert-dialog-title">Kinnita kutsed</DialogTitle>
        <DialogContent >
          <DialogContentText  id="alert-dialog-description">
                <Typography component={'a'}>
                  Allpool on asutused, kes soovivad Teid lisada oma gruppi.<br/>  
                  Kinnitamiseks vajutage rohelisel nupul.
                </Typography>
          </DialogContentText>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asutus</TableCell>
                  <TableCell>Asutuse liik</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enterpriseInvitations && enterpriseInvitations
                  .map(row => (
                    <TableRow key={row.enterpriseId}>
                      <TableCell component="th" scope="row">
                        {row.enterpriseName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.type}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Tooltip title="Kinnita kutse">
                          <Button onClick={()=>handleInvitationApproval(true, row.enterpriseId)}>
                          <PlusCircle color="#77d18f" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Tühista kutse">
                          <Button onClick={()=>handleInvitationApproval(false, row.enterpriseId)}>
                            <XCircle color="#e08d8d" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
                  </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnterpriseApproveDialog} color="primary">Sulge</Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth={'lg'} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <iframe title="tagasiside" src="https://docs.google.com/forms/d/e/1FAIpQLScjWpLyGbnAWYspOVIsLkcCAp3B-r7ttWR3JSKTEF6kQiUNOQ/viewform?embedded=true" width="640" height="1172" frameborder="0" marginHeight="0" marginWidth="0">Laadimine…</iframe>
        <Button onClick={handleClose} color="primary" variant="contained">Sulge</Button>
      </Dialog>

    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
