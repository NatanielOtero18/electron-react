import React from "react";
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";

const DailyTotal = (props) => {

    const { date } = props;
    const [total, setTotal] = useState(0);

    const getDailyTotal = async (date) => {
        await window.api.getDailyTotal(date).then(data => {
            setTotal(data[0].daily)
        })
    }

    useEffect(() => {
        getDailyTotal(date);
    }, [date])

    return (<div>
        <Typography sx={{ color: 'text.secondary' }}>
            Total del dia: {total}
        </Typography>
    </div>);

}

export default DailyTotal;