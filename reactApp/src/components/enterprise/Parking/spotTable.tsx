import { Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { cancelSpotRelease } from '../../../store/queries/enterpriseQueries';
import { ParkingSpotListData, Reservation } from '../../../store/types/enterpriseTypes';
import { changeDate } from '../../../_helpers/changeDate';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../common/siteActions';

type Props = {
  spotData: ParkingSpotListData[],
  reservationData: Reservation[],
  updateSpotData(): void,
  isAdmin?: boolean
}

const SpotTable:FC<Props> = ({spotData, reservationData, updateSpotData, isAdmin}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleDelete = (data: ParkingSpotListData) => {
      if(data.releasedId !== -1) {
        cancelSpotRelease(data).then((request: any) => {
          dispatch(SET_SUCCESS_ALERT({status: true, message: "Vabastus on tühistatud!"}));
          updateSpotData();
        })
      }
      if(data.reservationId !== -1) {
        dispatch(SET_ERROR_ALERT({status: true, message: "Aktiivset broneeringut pole võimalik tühistada!"}));
      }
    }

    const handleDeleteReservation = (data: Reservation) => {
      console.log("Reserveering eemaldatud")
    }

    const spotContent = (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          {(spotData === undefined || spotData.length === 0) ? <caption style={{textAlign: "center"}}>Andmed puuduvad</caption> : null}
          <TableHead>
            <TableRow>
              <TableCell>Tüüp</TableCell>
              <TableCell>Algus</TableCell>
              <TableCell>Lõpp</TableCell>
              <TableCell>Kasutaja</TableCell>
              {!isAdmin ? <TableCell>Tegevus</TableCell> : ''}
            </TableRow>
          </TableHead>
          <TableBody>
            {spotData !== undefined ? spotData.map((row: ParkingSpotListData) => (
              <TableRow key={row.id} className={classes.rowHeight}>
                <TableCell component="th" scope="row">
                  {row.status === "Assigned" && "Laenatud"}
                  {row.status === "Reserved" && "Reserveeritud"}
                  {row.status === "Released" && "Vabastatud"}
                  {row.status === "Booked" && "Broneering"}
                </TableCell>
                <TableCell>{changeDate(row.startDate)}</TableCell>
                <TableCell>{changeDate(row.endDate)}</TableCell>
                <TableCell>{row.reserverName}</TableCell>
                {!isAdmin ? <TableCell>
                  <Tooltip title="TÜHISTA">
                    <Button onClick={() => handleDelete(row)}><Delete color='error' /></Button>
                  </Tooltip>
                </TableCell> : ''}
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>
    )

    const reservationContent = (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          {(reservationData === undefined || reservationData.length === 0) ? <caption style={{textAlign: "center"}}>Andmed puuduvad</caption> : null}
          <TableHead>
            <TableRow>
              <TableCell>Tüüp</TableCell>
              <TableCell>Algus</TableCell>
              <TableCell>Lõpp</TableCell>
              <TableCell>Kasutaja</TableCell>
              {!isAdmin ? <TableCell>Tegevus</TableCell> : ''}
            </TableRow>
          </TableHead>
          <TableBody>
            {reservationData !== undefined ? reservationData.map((row: Reservation) => (
              <TableRow key={row.id} className={classes.rowHeight}>
                <TableCell>Broneering</TableCell>
                <TableCell>{changeDate(row.startDate)}</TableCell>
                <TableCell>{changeDate(row.endDate)}</TableCell>
                <TableCell>{row.reserverName}</TableCell>
                {!isAdmin ? <TableCell>
                  <Tooltip title="TÜHISTA">
                    <Button onClick={() => handleDeleteReservation(row)}><Delete color='error' /></Button>
                  </Tooltip>
                </TableCell> : ''}
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>
    )

    if(spotData !== undefined) {
      return spotContent
    } else {
      return reservationContent
    }
}

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    rowHeight: {
      height: 44,
    },
  });

export default SpotTable