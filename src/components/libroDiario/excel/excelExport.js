import React from 'react';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


const ExportButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(33, 204, 10)"),
    backgroundColor: "rgb(33, 204, 10)",
    '&:hover': {
        backgroundColor: "rgb(23, 128, 9)",
    },

}));

const ExcelExport = ({month, fileName }) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
    const fileExtension = '.xlsx';   

    

    const getExportData = async () => {
        let regex = "%/" + month;
        window.api.getByMonth(regex).then(data => {
            const result = Object.values(
                data.reduce((acc, item) => {
                    acc[item.Fecha] = acc[item.Fecha]
                        ? { ...item, Total: item.Total + acc[item.Fecha].Total }
                        : item;
                    return acc;
                }, {})
            )            
           console.log(result);

          

        })

    }


    const exportToExcel = async (excelData) => {
       
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
       
    };


    return (
        <div>
            <ExportButton
                edge="start"
                color="inherit"
                aria-label="export csv"
                size="small"
                endIcon={<FileDownloadIcon />}
                onClick={(e) => getExportData()}
            >
                Exportar

            </ExportButton>

        </div>
    )
}

export default ExcelExport;