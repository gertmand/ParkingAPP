import { Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, { FC, useEffect, useState } from 'react';
import { ParkingSpotListData, Reservation } from '../../../store/types/enterpriseTypes';
import { changeDate } from '../../../_helpers/changeDate';

type Props = {
  spotData: ParkingSpotListData[],
  reservationData: Reservation[],
  updateSpotData(): void,
  isAdmin?: boolean
}

type TableData = {
  spotId?: number,
  reservationId?: number,
  type: string,
  startDate: Date,
  endDate: Date,
  user: string,
  number?: number,
}

const SpotTable:FC<Props> = ({spotData, reservationData, updateSpotData, isAdmin}) => {
    const classes = useStyles();
    //const dispatch = useDispatch();

    const [tableData, setTableData] = useState<TableData[]>([])

    // const handleDelete = (data: ParkingSpotListData) => {
    //   if(data.releasedId !== -1) {
    //     cancelSpotRelease(data).then((request: any) => {
    //       dispatch(SET_SUCCESS_ALERT({status: true, message: "Vabastus on tühistatud!"}));
    //       updateSpotData();
    //     })
    //   }
    //   if(data.reservationId !== -1) {
    //     dispatch(SET_ERROR_ALERT({status: true, message: "Aktiivset broneeringut pole võimalik tühistada!"}));
    //   }
    // }

    const handleDeleteReservation = (data: number) => {
      console.log("Reserveering eemaldatud")
    }

    useEffect(() => {
      setTableData([])
      if(spotData !== undefined && spotData.length > 0) {
        spotData.forEach(element => {
          setTableData(prevState => [...prevState, {spotId: element.id, type: element.status, startDate: element.startDate, endDate: element.endDate, user: element.reserverName}])
        });
      }
      if(reservationData !== undefined && reservationData.length > 0) {
        reservationData.forEach(element => {
          setTableData(prevState => [...prevState, {reservationId: element.id, type: 'Booked', startDate: element.startDate, endDate: element.endDate, user: element.reserverName!, number: element.parkingSpotNumber!}])
        });
      }
    }, [spotData, reservationData])

    const tableContent = (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          {(tableData === undefined || tableData.length === 0) ? <caption style={{textAlign: "center"}}>Andmed puuduvad</caption> : null}
          <TableHead>
            <TableRow>
              <TableCell>Tüüp</TableCell>
              <TableCell>Algus</TableCell>
              <TableCell>Lõpp</TableCell>
              <TableCell>Kasutaja</TableCell>
              <TableCell>Parklakoht</TableCell>
              {!isAdmin ? <TableCell>Tegevus</TableCell> : ''}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData !== undefined ? tableData.map((row: TableData) => (
              <TableRow key={row.spotId !== undefined ? row.spotId : row.reservationId} className={classes.rowHeight}>
                <TableCell component="th" scope="row">
                  {row.type === "Assigned" && "Laenatud"}
                  {row.type === "Reserved" && "Reserveeritud"}
                  {row.type === "Released" && "Vabastatud"}
                  {row.type === "Booked" && "Broneering"}
                </TableCell>
                <TableCell>{changeDate(row.startDate, true)}</TableCell>
                <TableCell>{changeDate(row.endDate, true)}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.number === undefined ? "" : row.number}</TableCell>
                {!isAdmin ? <TableCell>
                  <Tooltip title="TÜHISTA">
                    <Button onClick={() => handleDeleteReservation(1)}><Delete color='error' /></Button>
                  </Tooltip>
                </TableCell> : ''}
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>
    )

    // if(spotData !== undefined) {
    //   return spotContent
    // } else {
    //   return reservationContent
    // }

    return tableContent;
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