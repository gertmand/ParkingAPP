import { Input, Button } from "@material-ui/core";
import React from "react";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { SET_SUCCESS_ALERT } from "../components/common/siteActions";
import { addParkingSpotArray } from "../store/queries/enterpriseQueries";
import { ParkingSpotRequest } from "../store/types/enterpriseTypes";


//TODO: faili kontroll

type Props = {
    enterpriseId: number;
    updateParkingSpots(): any;
    setParkingSpotAddModal(e : any) : any;
  };
  
  export const ExcelReader: FC<Props> = ({enterpriseId,updateParkingSpots,setParkingSpotAddModal}) => {
  
    const dispatch = useDispatch();
    const [dataFromExcel, setDataFromExcel] = useState<any[]>([]);
    const [addButton, setAddButton] = useState(false);
    const [file, setFile] = useState<Blob>();
    let parkingSpotsArray: Array<ParkingSpotRequest> = [];
  
    const readExcel = (file: Blob) => {
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
  
      promise.then((d) => {
        return setDataFromExcel(d as any);
      });
    };
  
    const addParkingSpots = () => {
    
        if(file !== undefined){
            readExcel(file);
        }
      
      dataFromExcel.forEach(element => {
        parkingSpotsArray.push({number:element.Number, enterpriseId:enterpriseId})
      });
      addParkingSpotArray(parkingSpotsArray).then(() => {
        setParkingSpotAddModal(false);
        updateParkingSpots();
        dispatch(
          SET_SUCCESS_ALERT({
            status: true,
            message: 'Parkimiskohad lisatud!'
          })
        );
      });;
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
          setFile(e.target.files[0]);
          setAddButton(true);
        }}
        />
        {!addButton ? "" : <Button color="primary" variant="contained" onClick={() => addParkingSpots()}>Lisa parkimiskohad</Button>}
      </>
    );
  };
  
  export default ExcelReader;

















