import React from "react";
import styles from './libroDiario.module.css';
import { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DailyTotal from "./totalDaily/dailyTotal";
import SellTables from "./tables/sellTables";
import MonthlyTotal from "./totalMonthly/MonthlyTotal";
import PlanillaExport from "./planillaExport/planillaExport";

const LibroDiario = (props) => {


    const [listaHistorial, setListaHistorial] = useState([]);

    const [dates, setDates] = useState([]);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);


    const getFullSellList = async () => {
        await window.api.getVentas().then(data => {
            const datesArr = [...new Set(data.flatMap(({ date }) => date))];
            const monthsArr = [...new Set(datesArr.map(date => {
                return date.slice(3);
            }))];
            const yearsArr = [...new Set(monthsArr.map(date => {
                return date.slice(3);
            }))];
            console.log(data)
            setListaHistorial(data);
            setMonths(monthsArr);
            setDates(datesArr);
            setYears(yearsArr);

        })
    }



    const GetStringMonth = (month) => {
        switch (month.slice(0, 2)) {
            case '01':
                return "Enero";
            case '02':
                return "Febrero";
            case '03':
                return "Marzo";
            case '04':
                return "Abril";
            case '05':
                return "Mayo";
            case '06':
                return "Junio";
            case '07':
                return "Julio";
            case '08':
                return "Agosto";
            case '09':
                return "Septiembre";
            case '10':
                return "Octubre";
            case '11':
                return "Noviembre";
            case '12':
                return "Diciembre";
            default:
                return "Error";

        }
    }

    useEffect(() => {
        getFullSellList()

    }, [])



    return (
        <div className={styles.mainCointainer}>
            <div className={styles.acordionContainer}>
                {
                    years.map(year => {
                        return <Accordion key={year}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography sx={{ width: '80%', flexShrink: 0 }}>
                                    {year}
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                {
                                    months.map(month => {
                                        if (month.slice(3) === year) {
                                            return <Accordion key={month} TransitionProps={{ unmountOnExit: true }} >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                                >


                                                    <Typography sx={{ width: '50%', flexShrink: 0 }}>{GetStringMonth(month)}</Typography>
                                                    <MonthlyTotal month={month} />
                                                    <div className={styles.btnExport}>
                                                        <PlanillaExport month={month} GetStringMonth={GetStringMonth}/>

                                                    </div>



                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {
                                                        dates.map(date => {
                                                            if (date.includes(month)) {
                                                                return <Accordion key={date} TransitionProps={{ unmountOnExit: true }} >
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        aria-controls="panel1a-content"
                                                                        id="panel1a-header"
                                                                    >
                                                                        <Typography sx={{ width: '80%', flexShrink: 0 }}>Dia : {date}</Typography>
                                                                        <DailyTotal date={date} />

                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        {

                                                                            listaHistorial.map(element => {

                                                                                if (element.date === date) {


                                                                                    return <Accordion key={element.id_venta}>
                                                                                        <AccordionSummary
                                                                                            expandIcon={<ExpandMoreIcon />}
                                                                                            aria-controls="panel1a-content"
                                                                                            id="panel1a-header"
                                                                                        >
                                                                                            <Typography sx={{ width: '45%', flexShrink: 0 }}>
                                                                                                Venta nº : {element.id_venta}
                                                                                            </Typography>
                                                                                            <Typography sx={{ width: '45%', flexShrink: 0 }}>
                                                                                                Total: $ {element.total}
                                                                                            </Typography>
                                                                                            <Typography sx={{ color: 'text.secondary' }}>
                                                                                                Productos
                                                                                            </Typography>
                                                                                        </AccordionSummary>
                                                                                        <AccordionDetails>

                                                                                            <SellTables id_venta={element.id_venta} />

                                                                                        </AccordionDetails>
                                                                                    </Accordion>
                                                                                } else return null

                                                                            })
                                                                        }
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            } else return null
                                                        })
                                                    }
                                                </AccordionDetails>
                                            </Accordion>
                                        } else return null
                                    })
                                }
                            </AccordionDetails>
                        </Accordion>
                    })
                }
            </div>

        </div>
    );
}

export default LibroDiario;


