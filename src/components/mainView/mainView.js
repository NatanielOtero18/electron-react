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
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from "react";
import { styled } from '@mui/material/styles';

const ModButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(44, 140, 153)"),
    backgroundColor: "rgb(34, 90, 173)",
    '&:hover': {
        backgroundColor: "rgb(102, 167, 221)",
    },
}));

const DelButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.getContrastText("rgb(173, 34, 34)"),
    backgroundColor: "rgb(173, 34, 34)",
    '&:hover': {
        backgroundColor: "rgb(253, 73, 73)",
    },
}));


const MainView = (props) => {

    const { response, searchActive } = props;      
    const [prodMod, setProdMod] = useState(0);
    const [prodDel, setProdDel] = useState(0);
    const [precioMod, setPrecioMod] = useState(0);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    
    const openDialog = () =>{
        setdialogOpen(true);        
    }

    const closeDialog = () =>{
        setdialogOpen(false)
    }

    const handleOpen = (id,precio) => {
        setProdMod(id)
        setPrecioMod(precio)
        setOpen(true);
    };

    const handleChangeMod = (e) =>{
        setPrecioMod(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };
  
   const handleDeleteConfirm = (id) =>{
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
                        />

                        <Button onClick={() => { props.handleSearch() }} variant="contained" endIcon={<SearchIcon />}>
                            Buscar producto
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
                            <div className={styles.dataContainer}>
                               barcode: {element.id}
                            </div>

                            <div className={styles.btnContainer}>
                                <DelButton onClick={() => { handleDeleteConfirm(element.id) }} aria-label="delete">
                                    <DeleteIcon />
                                </DelButton>
                                <ModButton onClick={() => { handleOpen(element.id,element.precio) }} endIcon={<EditIcon />}>
                                    Modificar
                                </ModButton>
                            </div>
                        </div>
                    })
                }
            </div>
           
            <Dialog id="form" open={open} onClose={handleClose}
           >
            <DialogTitle sx={{backgroundColor:"rgba(0, 0, 0, 0.644) ",color:"white",fontSize:"2em"}}>Modificar precio</DialogTitle>
            <DialogContent  sx={{backgroundColor:"rgb(209, 220, 255) "}}>                   
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Precio"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={precioMod}
                    onChange={(e)=>handleChangeMod(e)}                    
                />
            </DialogContent>
            <DialogActions sx={{backgroundColor:"rgb(209, 220, 255) ",display:"flex",justifyContent:"space-around",alignItems:"center"}}>
                <Button variant="contained" color="error" onClick={handleClose}>Cancelar</Button>
                <Button variant="contained" color="success" onClick={()=>{props.handleUpdate(prodMod,precioMod); handleClose()}}>Confirmar</Button>
            </DialogActions>
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
                <DialogActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <Button variant="contained"  onClick={closeDialog} autoFocus>
                        No
                    </Button>
                    <Button variant="contained" color="error" onClick={()=>{props.handleDelete(prodDel);closeDialog()}} autoFocus>
                        Si
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default MainView;