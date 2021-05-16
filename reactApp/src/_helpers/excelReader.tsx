import { Input, Button } from "@material-ui/core";
import React from "react";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { SET_ERROR_ALERT, SET_SUCCESS_ALERT } from "../components/common/siteActions";
import { AppState } from "../store";
import { addParkingSpotArray } from "../store/queries/enterpriseQueries";
import { ParkingSpotRequest } from "../store/types/enterpriseTypes";



type Props = {
    updateParkingSpots(): any;
    setParkingSpotAddModal(e : any) : any;
  };
  
  export const ExcelReader: FC<Props> = ({updateParkingSpots,setParkingSpotAddModal}) => {
  
    const dispatch = useDispatch();
    const [addButton, setAddButton] = useState(false);
    const enterpriseId = useSelector<AppState, number>(state => state.user.enterpriseData.id);
  
    const [parkingSpotsArray, setParkingSpotsArray] = useState<ParkingSpotRequest[]>([]);

    const readExcel = async (file: Blob) => {
      
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          const bufferArray = e.target?.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          resolve(data);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      promise.then((d : any) => {
        d.forEach((element: { Number: any; }) => {
          setParkingSpotsArray(prevState => [...prevState, {number:element.Number}])
        });
      })
    };
  
    const addParkingSpots = () => {

      if(parkingSpotsArray.length > 0){
        addParkingSpotArray(parkingSpotsArray, enterpriseId).then(() => {
          setParkingSpotAddModal(false);
          updateParkingSpots();
          dispatch(
            SET_SUCCESS_ALERT({
              status: true,
              message: 'Parkimiskohad lisatud!'
            })
          );
        });
      }
    }
  
    return (
      <>
        
        <Input
        disableUnderline
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

          if (e.target.files == null || e.target.files === undefined) {
            throw new Error('Error finding e.target.files');
          }
          if(e.target.files[0].name.split('.')[1] === "xlsx"){
            readExcel(e.target.files[0]);
            setAddButton(true);
          } else {
            dispatch(
              SET_ERROR_ALERT({
                status: true,
                message: 'Kontrolli faili, ainult ".xlsx" on lubatud!'
              })
            );
          }
        }}
        />
        {!addButton ? "" : <Button color="primary" variant="contained" onClick={() => addParkingSpots()}>Lisa parkimiskohad</Button>}
      </>
    );
  };
  
  export default ExcelReader;

















