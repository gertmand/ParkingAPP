import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store';
import { releaseParkingSpot } from '../../../store/queries/enterpriseQueries';
import { ParkingSpot } from '../../../store/types/enterpriseTypes';
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from '../../common/siteActions';
import ReleaseModal from './releaseModal';

type Props = {
    releaseModal: boolean,
    setReleaseModal(e: any): any,
    updateSpotData(): any
}

const ReleaseSpot:FC<Props> = ({releaseModal, setReleaseModal, updateSpotData} : any) => {
    const dispatch = useDispatch();
    const parkingSpot = useSelector<AppState, ParkingSpot>(state => state.user.enterpriseUserData.parkingSpot);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleReleaseModal = (e: any) => {
        setReleaseModal(e);
        setStartDate(null);
        setEndDate(null);
    }

    const handleStartDate = (e: any) => {
        setStartDate(e);
    }

    const handleEndDate = (e: any) => {
        setEndDate(e);
    }

    const submitRelease = () => {
        if(startDate != null && endDate != null && startDate <= endDate) {
            releaseParkingSpot({parkingSpaceId: parkingSpot.id, startDate: startDate, endDate: endDate, enterpriseId: 1}).then((data: any) => { //TODO: enterpriseId
                //getSpotStatus(parkingSpot.id, dispatch);
                setReleaseModal(!releaseModal);
                setStartDate(null);
                setEndDate(null);
                updateSpotData();
                dispatch(SET_SUCCESS_ALERT({status: true, message: "Parkimiskoht on vabastatud teistele broneerimiseks!"}));
            }).catch((err: any) => {
                console.log(err);
                dispatch(SET_ERROR_ALERT({status: true, message: err}));
            })
        }
        else if(startDate != null && endDate != null) {
            if(startDate > endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Alguskuupäev ei tohi olla suurem lõppkuupäevast"}))
        }
        else if(!startDate && !endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra periood!"}))
        else if(!startDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra alguskuupäev!"}))
        else if(!endDate) dispatch(SET_ERROR_ALERT({ status: true, message: "Palun määra lõppkuupäev!"}))
    }

    return (
        <div>
            {releaseModal ? <ReleaseModal open={releaseModal} setModal={handleReleaseModal} startDate={startDate} endDate={endDate} setStartDate={handleStartDate} setEndDate={handleEndDate} submit={submitRelease}/> : ""}
        </div>
    )
}

export default ReleaseSpot
