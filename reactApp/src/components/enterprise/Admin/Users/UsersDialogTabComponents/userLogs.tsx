import { Card, Grid, InputAdornment, SvgIcon, TextField, Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Search as SearchIcon } from 'react-feather';
import { Log } from '../../../../../store/types/enterpriseTypes';
import theme from '../../../../../style/theme';
import LogsTable from '../../../logsTable';

type Props = {
    userLogs: Log[]
    userName: string
    enterpriseId: number
  };

const UserLogs: FC<Props> = ({userLogs, userName, enterpriseId}) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div>
            <Card>
            <Grid container style={{ padding: theme.spacing(2) }} >
                <Grid item xs={6}>
                    <Typography>{'Kasutaja ' + userName + ' logid'}</Typography>
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
            <LogsTable enterpriseId={enterpriseId} logs={userLogs} searchTerm={searchTerm} userLogsBoolean={true}/>
            </Grid>
            </Card>
        </div>
    )
}

export default UserLogs
