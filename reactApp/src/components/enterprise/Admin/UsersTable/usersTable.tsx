import { TableHead, TableRow, TableCell, TableBody, Table, Tooltip, Button, makeStyles, Box } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { PlusCircle, XCircle } from 'react-feather'
import { User } from '../../../../store/types/userType';

type TableProps = {
    users: User[];
  };

const UsersTable: React.FC<TableProps> = ({users}) => {
    const classes = useStyles();
    console.log(users)
    return (
        <>
        <Box display="flex" justifyContent="flex-end" >
            <Button color="primary" variant="contained">
                Lisa liige
            </Button>
        </Box>
        <Table className={clsx(classes.table)}>
            <TableHead>
            <TableRow>
                <TableCell align='center'>Nimi</TableCell>
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
            {users !== undefined ? users.map((user : User) => (
                <TableRow hover key={1}>
                <TableCell component="th" scope="row" align='center'>{user.firstName + ' ' + user.lastName}</TableCell>
                <TableCell align='left'>
                    <Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="green"/></Button></Tooltip>
                    <Button><XCircle color="red"/></Button>
                </TableCell>
            </TableRow>
            )) : null}
                
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
export default UsersTable
