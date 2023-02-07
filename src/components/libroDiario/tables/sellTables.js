import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";

const SellTables = (props) => {

    const { id_venta } = props;

    const [prodsPerSell, setProdsPerSell] = useState([]);
    const columns = [

        { field: 'producto', headerName: 'Producto', width: 500 },
        { field: 'prUnit', headerName: 'Precio unitario', width: 200 },
        { field: 'cantidad', headerName: 'Unidades', width: 200 },
        { field: 'total', headerName: 'Total', width: 200 }
    
    ];

    useEffect(() => {
        getItemsPerSale(id_venta);
    }, [id_venta])

    const getItemsPerSale = async (id_venta) => {
        await window.api.getVentasStock(id_venta).then(data =>{
            setProdsPerSell(data);
        })
    }
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={prodsPerSell}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
        
            />
        </div>);

}

export default SellTables;