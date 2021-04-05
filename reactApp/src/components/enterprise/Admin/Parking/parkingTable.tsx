import { Box, Button, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC } from 'react'
import { PlusCircle, XCircle } from 'react-feather'
import { ParkingSpot } from '../../../../store/types/enterpriseTypes';

type TableProps = {
    parkingSpots: ParkingSpot[];
  };

const ParkingTable:FC<TableProps>  = ({parkingSpots}) => {
    const classes = useStyles();

    return (
        <>
        <Box display="flex" justifyContent="flex-end" >
            <Button color="primary" variant="contained">
                Lisa parklakoht
            </Button>
        </Box>
        <Table className={clsx(classes.table)}>
            <TableHead>
            <TableRow>
                <TableCell align='center'>Parkimiskoht</TableCell>
                <TableCell align='center'>Peakasutaja</TableCell>
                <TableCell align='center'>Auto registreerimisnumber</TableCell>
                <TableCell align='center'></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {parkingSpots !== undefined ?  parkingSpots.map((row : ParkingSpot) => (
                <TableRow hover key={row.id}>
                <TableCell component="th" scope="row" align='center'> 
                    {row.number} 
                </TableCell>
                <TableCell align='center'>
                    TODO 
                </TableCell>
                <TableCell align='left'><Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="green"/></Button></Tooltip></TableCell>
                <TableCell align='center'>TODO</TableCell>
                <TableCell><Button><XCircle color="red"/></Button></TableCell>
                </TableRow>
            )): null}
            </TableBody>
        </Table>
        </>
    )
}

const useStyles = makeStyles({
    root: {
      marginTop: "15px"
    },
    table: {
      minWidth: 650,
    }
  });

export default ParkingTable
