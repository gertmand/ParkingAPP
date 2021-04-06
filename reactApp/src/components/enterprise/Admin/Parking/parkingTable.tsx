import { Box, Button, ButtonGroup, InputAdornment, makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import { DataGrid, GridColumns } from '@material-ui/data-grid';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { PlusCircle, Search as SearchIcon, XCircle } from 'react-feather';
import { ParkingSpot } from '../../../../store/types/enterpriseTypes';

type TableProps = {
    parkingSpots: ParkingSpot[];
  };

const ParkingTable:FC<TableProps>  = ({parkingSpots}) => {
    const classes = useStyles();
    const[searchTerm, setSearchTerm] = useState('')

    const columns: GridColumns = [
        { field: 'id', headerName : '', hide : true},
        { field: 'number', headerName: 'Parklakoha number', width: 190, align : 'center', headerAlign : 'center'},
        { field: 'mainUser', headerName: 'Peakasutaja(d)', width:200, headerAlign : 'center' },
        { field: 'carNumber', headerName: ' Auto reg. number', width: 200, headerAlign : 'center'},
        { field: "tegevused", headerName: "Tegevused", sortable: false, width: 150, disableClickEventBubbling: true, headerAlign : 'center',
            renderCell: () => {
              return <ButtonGroup>
                <Tooltip title="Lisa peakasutaja"><Button><PlusCircle color="#77d18f"/></Button></Tooltip>
                <Tooltip title="Kustuta parkimiskoht"><Button><XCircle color="#e08d8d"/></Button></Tooltip>
                    </ButtonGroup>;
            }
          },
      ];


    return (
      <>
        <div style={{ width: '100%'}}>
        
        </div>
        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" variant="contained">
            Lisa parklakoht
          </Button>
        </Box>
        <TextField
          variant="standard"
          onChange={event => {
            setSearchTerm(event.target.value);
          }}
          placeholder="otsi parkimiskohta..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
        />
        <DataGrid
            disableColumnMenu
            autoHeight
            rows={ parkingSpots.filter(ps => {
              if (searchTerm === '') {
                return ps;
              } else if (
                ps.number
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return ps;
              }
              return null;
            })}
            columns={columns}
            pageSize={10}
          />
        {/* <Table className={clsx(classes.table)}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Parkimiskoht</TableCell>
              <TableCell align="center">Peakasutaja</TableCell>
              <TableCell align="center">Auto registreerimisnumber</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parkingSpots !== undefined
              ? parkingSpots
                  .filter(ps => {
                    if (searchTerm === '') {
                      return ps;
                    } else if (
                      ps.number
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return ps;
                    }
                    return null;
                  })
                  .map((row: ParkingSpot) => (
                    <TableRow className={classes.tableRow} hover key={row.id}>
                      <TableCell
                        className={classes.tableCell}
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {' '}
                        {row.number}{' '}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        TODO{' '}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        TODO
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Tooltip title="Lisa peakasutaja">
                          <Button>
                            <PlusCircle color="green" />
                          </Button>
                        </Tooltip>
                        <Button>
                          <XCircle color="red" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              : null}
          </TableBody>
        </Table> */}
      </>
    );
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
