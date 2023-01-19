import React from "react";

import styles from "./Navbar.module.css"

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AddItem from "../addproducto/addproducto";
import Vender from "../vender/vender";
import { styled } from '@mui/material/styles';



const CloseButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(173, 34, 34)"),
    backgroundColor: "rgb(173, 34, 34)",
    '&:hover': {
        backgroundColor: "rgb(253, 73, 73)",
    },
}));







const Navbar = (props) => {


    const [openVenta, setOpenVenta] = React.useState(false);


    const handleOpenVenta = () => {
        setOpenVenta(true);
    };

    const handleCloseVenta = () => {
        setOpenVenta(false);
    };

    const [openAdd, setOpenAdd] = React.useState(false);


    const handleOpenAdd= () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    return (
        <div>
            <div className={styles.headerContainer}>
                <div>
                    <h2>Inventario</h2>
                </div>
                <div className={styles.btnGroup}>

                    <Button onClick={() => handleOpenAdd()} color="success" sx={{ width: "200px", fontSize: "1.2em", padding: "0.5em" }} variant="contained" startIcon={<AddIcon />}>
                        Producto
                    </Button>

                    <Button onClick={() => handleOpenVenta()} sx={{ width: "200px", fontSize: "1.2em", padding: "0.5em" }} variant="contained" endIcon={<ShoppingCartIcon />}>
                        Venta
                    </Button>


                </div>



            </div>

            <Dialog
                id="add"
                fullScreen
                open={openAdd}
                onClose={handleCloseAdd}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: "black" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",fontSize:"2em" }}>

                        Agregar producto
                        <CloseButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseAdd}
                            aria-label="close"
                            sx={{ color: "white" }}
                        >
                            <CloseIcon />
                        </CloseButton>
                    </Toolbar>
                </AppBar>
                <AddItem  setPath = {props.setPath}/>
            </Dialog>
            <Dialog
                id="sell"
                fullScreen
                open={openVenta}
                onClose={handleCloseVenta}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: "black" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",fontSize:"2em" }}>

                        Venta
                        <CloseButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseVenta}
                            aria-label="close"
                            sx={{ color: "white" }}
                        >
                            <CloseIcon />
                        </CloseButton>
                    </Toolbar>
                </AppBar>
                <Vender 
                searchProdbyCode={props.searchProdbyCode}                
 />
            </Dialog>

        </div>
    );
}

export default Navbar;