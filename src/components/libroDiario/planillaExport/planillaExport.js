import React from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect, useRef } from "react";
import styles from './planillaExport.module.css'
import DialogContent from '@mui/material/DialogContent';
import MonthlyTotal from "../totalMonthly/MonthlyTotal";

import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';




const ExportButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(33, 204, 10)"),
    backgroundColor: "rgb(33, 204, 10)",
    '&:hover': {
        backgroundColor: "rgb(23, 128, 9)",
    },

}));

const PrintButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(33, 204, 10)"),
    backgroundColor: "rgb(33, 204, 10)",
    '&:hover': {
        backgroundColor: "rgb(23, 128, 9)",
    },

}));


const CloseButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(173, 34, 34)"),
    backgroundColor: "rgb(173, 34, 34)",
    '&:hover': {
        backgroundColor: "rgb(253, 73, 73)",
    },
}));



const PlanillaExport = (props) => {

    const { month } = props;
    const componentRef = useRef();

    const [dataList, setDataList] = useState([])
    const [dialogOpen, setdialogOpen] = useState(false);

    const openDialog = () => {
        setdialogOpen(true);
    }

    const closeDialog = () => {
        setdialogOpen(false)
    }

    useEffect(() => {
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
                setDataList(result);
            })

        }
        getExportData();
    }, [month]);


    return (

        <div>
            <ExportButton
                edge="start"
                color="inherit"
                aria-label="export csv"
                size="small"
                endIcon={<FileDownloadIcon />}
                onClick={openDialog}
            >
                Exportar

            </ExportButton>
            <Dialog
                id="ticket"
                fullScreen
                open={dialogOpen}
                onClose={closeDialog}

            >
                <AppBar sx={{ position: 'relative', backgroundColor: "black" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "2em" }}>

                        Vista previa
                        <ReactToPrint
                        removeAfterPrint={true}
                        trigger={() => <PrintButton  aria-label="imprimir">
                            <PrintIcon  />
                        </PrintButton>
                        }
                        content={() => componentRef.current}
                    />
                        <CloseButton
                            edge="start"
                            color="inherit"
                            onClick={closeDialog}
                            aria-label="close"
                            sx={{ color: "white" }}
                        >
                            <CloseIcon />
                        </CloseButton>
                       
                    </Toolbar>
                </AppBar>

                <DialogContent ref={componentRef} sx={{ backgroundColor: "rgb(209, 220, 255) ", display: "flex", flexDirection: "column" }}>

                    <div className={styles.tableContainer} >
                        <div className={styles.header}>
                            <h3>Mes : {props.GetStringMonth(month)}</h3>
                            <h3><MonthlyTotal month={month} /></h3>
                        </div>

                        <div className={styles.gridTable}>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>

                                            <TableCell align="right">Fecha</TableCell>
                                            <TableCell align="right">Total</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataList.map((row) => {
                                            if (row.Fecha.split(0, 3) < "16") {
                                                return <TableRow
                                                    key={row.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >

                                                    <TableCell align="right">{row.Fecha}</TableCell>
                                                    <TableCell align="right">{row.Total}</TableCell>

                                                </TableRow>
                                            } 
                                        } 
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>

                                            <TableCell align="right">Fecha</TableCell>
                                            <TableCell align="right">Total</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataList.map((row) => {
                                            if (row.Fecha.split(0, 3) >= "16") {
                                                return <TableRow
                                                    key={row.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >

                                                    <TableCell align="right">{row.Fecha}</TableCell>
                                                    <TableCell align="right">{row.Total}</TableCell>

                                                </TableRow>
                                            } 
                                        }
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );

}


export default PlanillaExport;