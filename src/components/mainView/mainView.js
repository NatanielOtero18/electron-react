import React from "react";
import Button from '@mui/material/Button';
import styles from "./mainView.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import PercentIcon from '@mui/icons-material/Percent';
import DialogContentText from '@mui/material/DialogContentText';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { styled } from '@mui/material/styles';

const ModButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(44, 140, 153)"),
    backgroundColor: "rgb(34, 90, 173)",
    '&:hover': {
        backgroundColor: "rgb(102, 167, 221)",
    },
    padding:"0.5em",
}));

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


const MainView = (props) => {

    const { response, searchActive } = props;
    console.log(response)
    const [prodMod, setProdMod] = useState(0);
    const [prodDel, setProdDel] = useState(0);
    const [prodModName, setProdModName] = useState("");
    const [precioMod, setPrecioMod] = useState(0);
    const [descMod, setdescMod] = useState(0);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [alert, setAlert] = useState(false);
    const [textAlert, settextAlert] = useState("");

    const openDialog = () => {
        setdialogOpen(true);
    }

    const closeDialog = () => {
        setdialogOpen(false)
    }
    const closeAlert = () => {
        setAlert(false);
    }

    const handleOpen = (id, precio, desc,name) => {
        setProdModName(name)
        setProdMod(id)
        setPrecioMod(precio)
        setdescMod(desc)
        setOpen(true);
    };

    const handleChangeMod = (e) => {
        setPrecioMod(e.target.value);
    }

    const handleDescMod = (e) => {
        if(e.target.value > 100){
            setAlert(true);
            settextAlert("Error, no se puede agregar mas de un 100% de descuento");
        }else
        setdescMod(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteConfirm = (id) => {
        openDialog()
        setProdDel(id)
    };



    return (
        <div>
            {
                searchActive ? <div className={styles.btnDown}>
                    <Button color="error" onClick={() => { props.handleFullList() }} variant="contained" startIcon={<ArrowBackIcon />}>
                        Volver al listado
                    </Button>
                </div> :
                    null
            }
            <div className={styles.inputContainer}>
                <Box
                    autoComplete="off"
                >
                    <div className={styles.seachContainer}>
                        <TextField fullWidth
                            id="outlined-basic"
                            label="Buscar producto"
                            variant="outlined"
                            value={props.search}
                            onChange={(e) => { props.handleChange(e) }}
                            onKeyDown={(e) => { props.handleKeyPress(e) }}
                        />

                        <Button onClick={() => { props.handleSearch() }} sx={{paddingRight:"1em"}}   variant="contained" endIcon={<SearchIcon />}>
                            Buscar producto
                        </Button>
                        <Button onClick={() => { props.getDescList() }} sx={{paddingRight:"1em",paddingLeft:"1.5em"}}  color="secondary" variant="contained" endIcon={<PercentIcon sx={{padding:"0.2em"}}  />}>
                            Ver descuentos
                        </Button>
                    </div>

                </Box>
            </div>
            <div className={styles.mainContainer}>
                {

                    response.map((element) => {
                        return <div className={styles.itemCard} key={element.id}>

                            <div className={styles.nameContainer}>
                                {element.producto}
                            </div>
                            <div className={styles.priceContainer}>
                                $ {element.precio}

                            </div>
                            <div className={styles.saleContainer}>
                                {
                                    element.desc > 0 ? <div> Oferta: $ {props.calculateDesc(element.precio, element.desc)} </div> : null
                                }
                            </div>
                            <div className={styles.descContainer}>
                                Descuento:

                                {element.desc}

                                %
                            </div>
                            <div className={styles.dataContainer}>
                                barcode: {element.id}
                            </div>

                            <div className={styles.btnContainer}>
                                <DelButton onClick={() => { handleDeleteConfirm(element.id) }} aria-label="delete">
                                    <DeleteIcon />
                                </DelButton>
                                <ModButton onClick={() => { handleOpen(element.id, element.precio , element.desc, element.producto) }} endIcon={<EditIcon />}>
                                    Administrar
                                </ModButton>
                            </div>
                        </div>
                    })
                }
            </div>

            <Dialog id="form" open={open} onClose={handleClose} xs={'md'} fullWidth={true}
            
            >
            <Toolbar sx={{ color: "white", display: "flex", justifyContent: "space-between", alignItems: "center",fontSize:"1.5em" , backgroundColor: "rgb(34, 90, 173) "}}>

            Administrar : {prodModName}
            <CloseButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                sx={{color: "white" }}
            >
                <CloseIcon />
            </CloseButton>
        </Toolbar>
                <DialogContent sx={{ backgroundColor: "rgb(209, 220, 255) ", display:"flex",flexDirection:"column" }}>
                    <div className={styles.modContainer}>
                      <div className={styles.textinputContainer}>
                      
                      <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Precio"
                      type="number"                      
                      variant="standard"
                      fullWidth
                      value={precioMod}                     
                      onChange={(e) => handleChangeMod(e)}
                  />
                      </div>
                        <Button variant="contained" color="error" onClick={() => { props.handleUpdate(prodMod, precioMod) }}>Cambiar precio</Button>
                    </div>
                    <div  className={styles.modContainer}>
                       <div>
                       <TextField
                       autoFocus
                       margin="dense"
                       id="name"
                       label="Descuento ( % )"
                       type="number"
                       fullWidth
                       variant="standard"
                       value={descMod}                       
                       onChange={(e) => handleDescMod(e)}
                   />
                  
                       </div>
                        <Button variant="contained" color="error" onClick={() => { props.handleDesc(prodMod, descMod) }}>Aplicar descuento</Button>
                    </div>
                </DialogContent>                
            </Dialog>
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Esta seguro que desea eliminar este producto?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button variant="contained" onClick={closeDialog} autoFocus>
                        No
                    </Button>
                    <Button variant="contained" color="error" onClick={() => { props.handleDelete(prodDel); closeDialog() }} autoFocus>
                        Si
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
            open={alert}
            onClose={closeAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {textAlert}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAlert} autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    );

}

export default MainView;