import React from "react";
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";

const MonthlyTotal = (props) => {

    const { month } = props;
    const [total, setTotal] = useState(0);

    const getMonthlyTotal = async (month) => {
        let regex = "%/" + month;
        await window.api.getMonthlyTotal(regex).then(data => {
            setTotal(data[0].monthly)
        })
    }

    useEffect(() => {
        getMonthlyTotal(month);
    }, [month])

    return (<div>
        <Typography >
            Total del mes: {total}
        </Typography>
    </div>);

}

export default MonthlyTotal;