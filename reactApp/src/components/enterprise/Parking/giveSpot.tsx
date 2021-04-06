import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store';
import { addReservation } from '../../../store/queries/enterpriseQueries';
import { ParkingSpot } from '../../../store/types/enterpriseTypes';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../common/siteActions';
import GiveModal from './giveModal';

type Props = {
    giveSpotModal: boolean,
    setGiveSpotModal(e: any): any,
    updateSpotData(): any,
    regularUsers: any[]
}

const GiveSpot:FC<Props> = ({giveSpotModal, setGiveSpotModal, updateSpotData, regularUsers}) => {
    const dispatch = useDispatch();
    const parkingSpot = useSelector<AppState, ParkingSpot>(state => state.user.enterpriseUserData.parkingSpot);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [regularUserId, setRegularUserId] = useState<number>(0);
    const [targetUser, setTargetUser] = useState(false);
    const [, setLoading] = useState(false);
    const [, setSuccess] = React.useState(false);

    const changeSelectedUser = (event: any, values: any) => {
        if (values) {
            setRegularUserId(values.id);
            setTargetUser(true);
        }
    }

    const handleGiveSpotModal = (e: any) => {
        setGiveSpotModal(e);
        setStartDate(null);
        setEndDate(null);
    }

    const handleStartDate = (e: any) => {
        setStartDate(e);
    }

    const handleEndDate = (e: any) => {
        setEndDate(e);
    }

    const giveSpot = () => {
        if (startDate && endDate && startDate <= endDate && parkingSpot.id !== undefined && regularUserId !== 0 && targetUser !== false) {
            setLoading(true);
            setSuccess(false);
            addReservation({ startDate: startDate, endDate: endDate, reserverAccountId: regularUserId, parkingSpotId: parkingSpot.id })
                .then((result: any) => {
                    setLoading(false);
                    setSuccess(true);
                    setStartDate(null);
                    setEndDate(null);
                    setGiveSpotModal(!giveSpotModal);
                    dispatch(SET_SUCCESS_ALERT({ status: true, message: "Sinu broneering on lisatud!" }));
                    //getUserData();
                    updateSpotData();
                }).catch((err: any) => {
                    setLoading(false);
                    dispatch(SET_ERROR_ALERT({ status: true, message: err.response.data.message }));
                })
        }
        else if(startDate != null && endDate != null) {
            if(startDate > endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Alguskuupäev ei tohi olla suurem lõppkuupäevast"}))
        }
        else if(!startDate && !endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra periood!"}))
        else if(!startDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra alguskuupäev!"}))
        else if(!endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra lõppkuupäev!"}))
        else if(!targetUser) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra töötaja, kellele koht loovutatakse!"}))
    }

    return (
        <div>
            {giveSpotModal ? <GiveModal open={giveSpotModal} setModal={handleGiveSpotModal} startDate={startDate} endDate={endDate} setStartDate={handleStartDate} setEndDate={handleEndDate} submit={giveSpot} regularUsers={regularUsers} changeSelectedUser={changeSelectedUser}/> : null}
        </div>
    )
}

export default GiveSpot
