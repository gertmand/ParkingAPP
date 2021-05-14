import {
  DataGrid, GridColumns,
  GridSortDirection,
  GridValueGetterParams
} from '@material-ui/data-grid';
import React, { FC } from 'react';
import { Log } from '../../store/types/enterpriseTypes';
import { User } from '../../store/types/userType';

type Props = {
  searchTerm: string,
  logs: Log[],
  userLogsBoolean: boolean,
  enterpriseUsers?: User[]
  enterpriseId?: number
};

const LogsTable: FC<Props> = ({searchTerm, logs, userLogsBoolean, enterpriseUsers, enterpriseId}) => {

  function getDate(params: GridValueGetterParams) {
    return `${params.getValue('createdAt')}`;
  }
  function getAdmin(params: GridValueGetterParams) {
    return `${params.getValue('adminId')}`;
  }

  const formatDate = (formattedDate: string) => 
  { 
    //var formattedDate = date.toString();
    formattedDate = formattedDate.replace('T', ' ');
    formattedDate = formattedDate.replace('-', '/');
    formattedDate = formattedDate.replace('-', '/');
    formattedDate = formattedDate.slice(0, 16);
    return formattedDate;
  }

  const columns: GridColumns = [
    { field: 'id', headerName: '', hide: true },
    {
      field: 'createdAt',
      headerName: 'Aeg',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridValueGetterParams) => {
        return (
          <div style={{ margin: 'auto' }}>
            {formatDate(getDate(params))}
          </div>
        );
      }
    },
    {
      field: 'description',
      headerName: 'Kirjeldus',
      //width: 450,
      flex: 75,
      align: 'center',
      headerAlign: 'center',
    },
    {
      hide: userLogsBoolean,
      field: 'adminId',
      headerName: 'Admin',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridValueGetterParams) => {
        return (
          <div style={{ margin: 'auto' }}>
            {enterpriseUsers?.filter(x => x.id.toString() === getAdmin(params)).map(x => x.firstName + ' ' + x.lastName)}
            {getAdmin(params).toString() === 'undefined' ? 'Admin puudub' : ''}
          </div>
        );
      }
    }
  ];

    return (
        <div>
            <DataGrid
        disableColumnMenu
        disableSelectionOnClick
        
        sortModel={[
          {
            field: 'createdAt',
            sort: 'desc' as GridSortDirection,
          },
        ]}
        localeText={{
          noRowsLabel: 'Andmed puuduvad!',
          footerRowSelected: count => `${count.toLocaleString()} rida valitud`
        }}
        autoHeight
        rows={logs.filter((log) => {
          if (searchTerm === '') 
          {
            if (enterpriseId === undefined)
            {
              return log;
            }
            else if (enterpriseId !== undefined && enterpriseId === log.enterpriseId)
            {
              return log;
            }
            else if (log.enterpriseId === undefined)
            {
              return log
            }
          } 
          else if (log.description.toString().toLowerCase().includes(searchTerm.toLowerCase()) || formatDate(log.createdAt.toString()).includes(searchTerm.toLowerCase())) 
          { 
            if (enterpriseId === undefined)
            {
              return log;
            }
            else if (enterpriseId !== undefined && enterpriseId === log.enterpriseId)
            {
              return log;
            }
            else if (log.enterpriseId === undefined)
            {
              return log
            }
          }
          
          return null;
        })}
        columns={columns}
        pageSize={10}
      />
        </div>
    )
}

export default LogsTable
