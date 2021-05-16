import { Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cancelReservation, cancelSpotRelease } from '../../../store/queries/enterpriseQueries';
import { ParkingSpotListData, Reservation } from '../../../store/types/enterpriseTypes';
import { changeDate } from '../../../_helpers/changeDate';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../common/siteActions';

type Props = {
  spotData: ParkingSpotListData[],
  reservationData: Reservation[],
  updateSpotData(): void,
  isAdmin?: boolean
}

type TableData = {
  id: number,
  spotId?: number,
  reservationId?: number,
  type: string,
  startDate: Date,
  endDate: Date,
  user: string,
  number?: number,
  spotData?: ParkingSpotListData,
  reservation?: Reservation
}

const SpotTable:FC<Props> = ({spotData, reservationData, updateSpotData, isAdmin}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [tableData, setTableData] = useState<TableData[]>([])

    const handleDelete = (data: ParkingSpotListData) => {
      console.log(data)
      if(data.status === "Released") {
        cancelSpotRelease(data).then((request: any) => {
          dispatch(SET_SUCCESS_ALERT({status: true, message: "Vabastus on tühistatud!"}));
          updateSpotData();
        }).catch((err) => {
          dispatch(SET_ERROR_ALERT({status: true, message: err}));
        })
      }
      if(data.status === "Reserved") {
        dispatch(SET_ERROR_ALERT({status: true, message: "Reserveeritud kohta pole võimalik tühistada!"}));
      }
      if(data.status === "Assigned") {
        dispatch(SET_ERROR_ALERT({status: true, message: "Laenatud kohta pole võimalik tühistada!"}));
      }
    }

    const handleDeleteReservation = (data: Reservation) => {
      if(data === undefined) return

      cancelReservation(data).then((response) => {
        dispatch(SET_SUCCESS_ALERT({status: true, message: "Broneering on tühistatud!"}));
        updateSpotData();
      }).catch((err) => {
        dispatch(SET_ERROR_ALERT({status: true, message: err}));
      })
    }

    // useEffect(() => {
    //   if(tableData.length === 0) return

    //   console.table(tableData)
    // }, [tableData])

    useEffect(() => {
      setTableData([])
      let idCount = 1;
      if(spotData !== undefined && spotData.length > 0) {
        spotData.forEach(element => {
          var count = parseInt(JSON.parse(JSON.stringify(idCount)))
          setTableData(prevState => [...prevState, {id: count, spotId: element.id, type: element.status, startDate: element.startDate, endDate: element.endDate, user: element.reserverName, spotData: element}])
          idCount += 1;
        });
      }
      if(reservationData !== undefined && reservationData.length > 0) {
        reservationData.forEach(element => {
          var count = parseInt(JSON.parse(JSON.stringify(idCount)))
          setTableData(prevState => [...prevState, {id: count, reservationId: element.id, type: 'Booked', startDate: element.startDate, endDate: element.endDate, user: element.reserverName!, number: element.parkingSpotNumber!, reservation:element}])
          idCount += 1;
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
                {!isAdmin ? 
                  row.reservationId !== undefined ? 
                    <TableCell>
                      <Tooltip title="Tühista broneering">
                        <Button onClick={() => handleDeleteReservation(row.reservation!)}><Delete color='error' /></Button>
                      </Tooltip>
                    </TableCell> 
                  : row.spotId !== undefined ?
                    <TableCell>
                      <Tooltip title="Tühista toiming">
                        <Button onClick={() => handleDelete(row.spotData!)}><Delete color='error' /></Button>
                      </Tooltip>
                    </TableCell> 
                  : null
                : null}
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