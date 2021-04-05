import { Box, Button, InputAdornment, makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import { PlusCircle, XCircle, Search as SearchIcon } from 'react-feather'
import { ParkingSpot } from '../../../../store/types/enterpriseTypes';

type TableProps = {
    parkingSpots: ParkingSpot[];
  };

const ParkingTable:FC<TableProps>  = ({parkingSpots}) => {
    const classes = useStyles();
    const[searchTerm, setSearchTerm] = useState('')

    return (
        <>
        <Box display="flex" justifyContent="flex-end" >
            <Button color="primary" variant="contained">
                Lisa parklakoht
            </Button>
        </Box>
        <TextField variant="standard" onChange={event => {setSearchTerm(event.target.value)}}  placeholder="otsi parkimiskohta..." InputProps={{startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small"color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>)}}/>
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
            {parkingSpots !== undefined ?  parkingSpots.filter((ps)=>{if(searchTerm == ""){return ps} 
            else if(ps.number.toString().toLowerCase().includes(searchTerm.toLowerCase())){
                return ps
            }}
            ).map((row : ParkingSpot) => (
                <TableRow className={classes.tableRow} hover key={row.id}>
                    <TableCell className={classes.tableCell} component="th" scope="row" align='center'> {row.number} </TableCell>
                    <TableCell className={classes.tableCell} align='center'>TODO </TableCell>
                    <TableCell className={classes.tableCell} align='center'>TODO</TableCell>
                    <TableCell className={classes.tableCell}><Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="green"/></Button></Tooltip><Button><XCircle color="red"/></Button></TableCell>
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
    },
    tableRow: {
        height: 40
      },
      tableCell: {
        padding: "0px 16px"
      }
  });

export default ParkingTable
