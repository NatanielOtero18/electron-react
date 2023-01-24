import React from "react";
import styles from "./vender.module.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Ticket from "../ticket/ticket";

const DelButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(173, 34, 34)"),
    backgroundColor: "rgb(173, 34, 34)",
    '&:hover': {
        backgroundColor: "rgb(253, 73, 73)",
    },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(173, 34, 34)"),
    backgroundColor: "rgb(173, 34, 34)",
    '&:hover': {
        backgroundColor: "rgb(253, 73, 73)",
    },
}));

const Vender = (props) => {
    const [listaVenta, setListaVenta] = useState([]);
    const [barcode, setBarcode] = useState("");
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    const [ventaCerrada, setVentaCerrada] = useState(false);
    const [total, setTotal] = useState(0);
    const [vuelto, setVuelto] = useState("");
    const [clienteInput, setClienteInput] = useState("");
    const [dialogOpen, setdialogOpen] = useState(false);

    const openDialog = () => {
        setdialogOpen(true);
    }

    const closeDialog = () => {
        setdialogOpen(false)
    }


    const getTotal = () => {
        setTotal(0)
        let sub = 0
        listaVenta.forEach(element => {
            sub = sub + element.total;
        })
        setTotal(sub);
        if (vuelto !== "") {
            if (clienteInput < sub) {
                setOpen(true);
                setText("Error, el importe ingresado no alcanza a cubrir el total")
                setVuelto("")
            }
            else { setVuelto(clienteInput - sub) }

        }
    }

    useEffect(() => {
        getTotal();
    }, [listaVenta])

    const handleChange = (e) => {
        if (isNaN(e.target.value)) {
            setOpen(true);
            setText("Error, ingresar un codigo de barras valido")
            setBarcode("");
        }
        else {
            setBarcode(e.target.value);
        }
    }


    const handleClose = () => {
        setOpen(false);
    };
    const searchProdbyCode = async () => {
        if (barcode === "") {
            setOpen(true);
            setText("Por favor complete todos los campos")
        }
        else {
            let data = await window.api.selectId(barcode);
            let item = {
                id: data[0].id,
                nombre: data[0].producto,
                cantidad: 1,
                prUnit: data[0].precio,
                total: data[0].precio
            }
            if (listaVenta.filter(value => value.id === item.id).length > 0) {
                const newList = listaVenta.map(element => {
                    if (element.id === item.id) {
                        return { ...element, cantidad: parseInt(element.cantidad) + 1 , total: element.prUnit * ( parseInt(element.cantidad) + 1) }
                    }
                    return element;
                })
                setListaVenta(newList);
            }
            else {
                setListaVenta(listaVenta => [...listaVenta, item]);
            }
            setBarcode("");

        }



    }
    const updateItem = (e, id) => {
        const { value } = e.target;

        if (value === "0") {
            deleteFromList(id);
        } else {
            const newList = listaVenta.map(element => {
                if (element.id === id) {
                    return { ...element, cantidad: value, total: element.prUnit * value }
                }
                return element;
            })
            setListaVenta(newList);
        }


    }
    const deleteFromList = (id) => {
        let newList = listaVenta.filter(element => { return element.id !== id })
        setListaVenta(newList);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (barcode !== "") {
                searchProdbyCode()
            }
        }
    }
    const enterVuelto = (event) => {
        if (event.key === 'Enter') {
            confrimVuelto()
        }
    }
    const confrimVuelto = () => {
        if (clienteInput >= total) {
            setVuelto(clienteInput - total)
            setVentaCerrada(true);
        }
        else {
            setOpen(true);
            setText("Error, el importe ingresado no alcanza a cubrir el total")
        }

    }

    const newSell = () => {

        setListaVenta([]);
        setVentaCerrada(false);
        setClienteInput("");
        setVuelto("");
        setTotal(0);
    }

    const handleVuelto = (e) => {
        if (e.target.value === "") {
            setVuelto("")
            setVentaCerrada(false);
        }
        if (isNaN(e.target.value)) {
            setOpen(true);
            setText("Error, ingresar un valor numerico")
            setClienteInput("");
        }
        else {
            setClienteInput(e.target.value);
        }

    }



    return (
        <div className={styles.mainCointainer}>
            <div className={styles.inputContainer}>
                <Box
                    autoComplete="off"
                >
                    <div className={styles.seachContainer}>
                        <TextField fullWidth
                            id="outlined-basic"
                            label="Producto"
                            variant="outlined"
                            value={barcode}
                            onChange={(e) => { handleChange(e) }}
                            onKeyDown={(e) => handleKeyPress(e)}
                        />

                        <Button onClick={() => { searchProdbyCode() }} variant="contained" >
                            Agregar producto
                        </Button>
                    </div>

                </Box>
            </div>
            <div className={styles.ventaContainer} >
                {
                    listaVenta.length > 0 ?
                        <div className={styles.totalContainer}>
                            Total: {total}

                            <TextField fullWidth
                                id="outlined-basic"
                                label="El cliente paga con:"
                                variant="outlined"
                                value={clienteInput}
                                onChange={(e) => { handleVuelto(e) }}
                                onKeyDown={(e) => enterVuelto(e)}
                            />
                            <Button onClick={() => confrimVuelto()} variant="contained" >
                                Calcular vuelto
                            </Button>
                            Vuelto: {vuelto}

                            {
                                ventaCerrada ? <div className={styles.btnTicket}>
                                    <Button onClick={() => openDialog()} color="success" variant="contained" >
                                        Generar Ticket
                                    </Button>
                                    <Button onClick={() => newSell()} color="error" variant="contained" >
                                        Nueva Venta
                                    </Button>
                                </div> : null
                            }
                        </div> :
                        null
                }

                <div className={styles.itemListContainer}>
                    {
                        listaVenta.map(element => {

                            return <div className={styles.itemCard} key={element.id}>
                                <div className={styles.btnContainer}>
                                    <DelButton onClick={() => deleteFromList(element.id)} aria-label="delete">
                                        <DeleteIcon />
                                    </DelButton>
                                </div>
                                <div className={styles.nameContainer}>

                                    {element.nombre}
                                </div>
                                <div className={styles.dataContainer}>
                                    ${element.prUnit}
                                </div>
                                <div>
                                    X
                                </div>
                                <div className={styles.priceContainer}>

                                    <TextField
                                        id="outlined-basic"
                                        label="Cantidad"
                                        variant="outlined"
                                        type="number"
                                        value={element.cantidad}
                                        onChange={(e) => updateItem(e, element.id)}
                                    />
                                </div>
                                <div>
                                    :
                                </div>
                                <div className={styles.priceContainer}>
                                    $ {element.total}
                                </div>
                            </div>
                        })

                    }
                </div>

            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                id="ticket"
                fullScreen
                open={dialogOpen}
                onClose={closeDialog}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: "black" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "2em" }}>

                        Ticket de venta
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
                <Ticket
                    total={total}
                    vuelto={vuelto}
                    clienteInput={clienteInput}
                    listaVenta={listaVenta} />

            </Dialog>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}

export default Vender;