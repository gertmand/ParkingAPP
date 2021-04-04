import { Box, Button, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { PlusCircle, XCircle } from 'react-feather'

const ParkingTable = () => {
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
            {/* {parkingSpaceMainUsers.filter(parkingSpace => (parkingSpace.parkingSpaceNumber.toString()).includes(search.toLowerCase())).map((row) => (
                <TableRow hover key={row.id}>
                <TableCell component="th" scope="row" align='center'> 
                    {row.parkingSpaceNumber} 
                </TableCell>
                <TableCell align='center'>
                    {allUsers.filter((e) => e.id === row.userId).map(e=>e.firstName + " " + e.lastName)} 
                </TableCell>
                <TableCell align='left'><Tooltip title="Lisa peakasutaja"><Button onClick={() => handleClickOpen(row.parkingSpaceId)}><PlusCircle color="green"/></Button></Tooltip></TableCell>
                <TableCell align='center'>{row.userCars}</TableCell>
                <TableCell><Button onClick={()=> handleDelete(row.parkingSpaceMainUserId)}><XCircle color="red"/></Button></TableCell>
                </TableRow>
            ))} */}
                <TableRow hover key={1}>
                    <TableCell component="th" scope="row" align='center'>1</TableCell>
                    <TableCell align='center'>Gert Mänd</TableCell>
                    <TableCell align='center'>Autod</TableCell>
                    <TableCell align='left'>
                        <Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="green"/></Button></Tooltip>
                        <Button><XCircle color="red"/></Button>
                    </TableCell>
                </TableRow>
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
