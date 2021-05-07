import { Card, Grid, InputAdornment, SvgIcon, TextField, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { Search as SearchIcon } from 'react-feather';
import { getEnterpriseLogs } from '../../store/queries/enterpriseQueries';
import { Log } from '../../store/types/enterpriseTypes';
import theme from '../../style/theme';
import LogsTable from './logsTable';

type Props = {
    enterpriseId: number
    enterpriseName: string
    enterpriseUsers: any[]
  };

const EnterpriseLogs: FC<Props> = ({enterpriseId, enterpriseName, enterpriseUsers}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [enterpriseLogs, setEnterpriseLogs] = useState<Log[]>();
    
    useEffect(() => {
        if (enterpriseId !== undefined)
        {
            getEnterpriseLogs(enterpriseId).then(result => {setEnterpriseLogs(result)})
            .catch(err => {
              console.log(err)
            })
        }
    }, [enterpriseId])
    
    return (
        <div>
            <Card>
            <Grid container style={{ padding: theme.spacing(2) }} >
                <Grid item xs={6}>
                    <Typography>{enterpriseName + ' logid'}</Typography>
                    <br></br>
                    <TextField
                    variant="standard"
                    onChange={event => {
                    setSearchTerm(event.target.value);
                    }}
                    placeholder="Otsi logi..."
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
                </Grid>
            </Grid>
            <Grid style={{ padding: theme.spacing(2) }}>
            {enterpriseLogs !== undefined ? <LogsTable enterpriseUsers={enterpriseUsers} logs={enterpriseLogs} searchTerm={searchTerm} userLogsBoolean={false}/> : ''}
            </Grid>
            </Card>
        </div>
    )
}

export default EnterpriseLogs
