import {
  Button,
  ButtonGroup,



  Grid,



  Tooltip
} from '@material-ui/core';
import {
  DataGrid,
  GridColumns,
  GridValueGetterParams
} from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { User } from '../../store/types/userType';
import theme from '../../style/theme';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
  
const useStyles = makeStyles((theme: Theme) =>
createStyles({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: 15
  },
}),
);
  
type Props = {
  handleOpenDeleteConfirmationModal(): any;
};

  export const UserCarsTableComponent: FC<Props> = ({handleOpenDeleteConfirmationModal}) => {
    const classes = useStyles();
    const [carId, setCarId] = useState(0);
    const userData = useSelector<AppState, User>(state => state.user.userData);
    function getCarId(params: GridValueGetterParams) {
      return `${params.getValue('id')}`;
    }
      const handleDeleteButtonClick = (params: GridValueGetterParams) => {
        setCarId(+getCarId(params));
        handleOpenDeleteConfirmationModal();
      };
  
    const columns: GridColumns = [
      { field: 'id', headerName: '', hide: true },
      {
        field: 'regNr',
        headerName: 'Reg Nr',
        width: 190,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'temporary',
        headerName: 'Ajutine?',
        width: 190,
        align: 'center',
        flex: 75,
        headerAlign: 'center',
      },
      {
        field: 'tegevused',
        headerName: 'Tegevused',
        sortable: false,
        width: 150,
        disableClickEventBubbling: true,
        headerAlign: 'center',
        flex: 75,
        valueGetter: getCarId,
        renderCell: (params: GridValueGetterParams) => {
          return (
            <ButtonGroup style={{ margin: 'auto' }}>
              <Tooltip title="Kustuta">
                <Button>
                  <DeleteIcon/>
                </Button>
              </Tooltip>
              {/* <Tooltip title="Kustuta parkimiskoht">
                <Button onClick={() => handleDeleteButtonClick(params)}>
                  <XCircle color="#e08d8d" />
                </Button>
              </Tooltip> */}
            </ButtonGroup>
          );
        }
      }
    ];
  
    return (
      <>
      <Grid container justify="space-between" spacing={3} style={{ padding: theme.spacing(2) }}>
        <Grid item xs={6}>
        <div className={classes.root}>{"SÕIDUKID"}</div>
        </Grid>
        <Grid item xs={6}>
          <Button color="primary" variant="contained" style={{float: "right"}}>
            Lisa sõiduk
          </Button>
        </Grid>
      </Grid>
        <DataGrid
          disableColumnMenu
          localeText={{
            noRowsLabel: 'Andmed puuduvad!',
            footerRowSelected: count => `${count.toLocaleString()} rida valitud`
          }}
          autoHeight
          rows={userData.accountCars === undefined ? [] : userData.accountCars}
          columns={columns}
          pageSize={10}
        />
      </>
    );
  };
  
  export default UserCarsTableComponent;
  