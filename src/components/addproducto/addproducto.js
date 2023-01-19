import React from "react";
import styles from "./addproducto.module.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AddIcon from '@mui/icons-material/Add';

const AddItem = (props) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");



    const handleClose = () => {
        setOpen(false);
    };

    const handleCode = (e) => {
        if (isNaN(e.target.value)) {
            setText("Error: el código de barra debe ser un valor numérico")
            setOpen(true)
            setCode("")
        }
        else
            setCode(e.target.value);
    }
    const handleName = (e) => {
        setName(e.target.value);
    }
    const handlePrice = (e) => {
        if (isNaN(e.target.value)) {
            setText("Error: el precio debe ser un valor numérico")
            setOpen(true)
            setPrice("")
        }
        else
            setPrice(e.target.value);
    }
    const AgregarProducto = async () => {

        const response = await window.api.addItem(code, name, price);
        if (response === "SQLITE_CONSTRAINT: UNIQUE constraint failed: stock.id") {
            setText("Error: Código de barra repetido");
            setOpen(true);
        }
        else {
            if (response === "SQLITE_CONSTRAINT: UNIQUE constraint failed: stock.producto") {
                setText("Error: Producto ya agregado");
                setOpen(true);
            }
            else{
                setText("Producto agregado correctamente ");
                setOpen(true);
            }
        }

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(code === "" || name === "" || price === "")
        {
            setText("Error, por favor complete todos los campos ");
            setOpen(true);
        }else{
            AgregarProducto().then(() => {
                props.setPath();
            });
            setCode("");
            setName("");
            setPrice("");
        }
        
    }

    return (
        <div className={styles.mainCointainer}>
            <Box
                autoComplete="off"
                component="form"
            >
                <div className={styles.seachContainer}>                   
                    <TextField fullWidth
                        id="outlined-basic"
                        label="Nombre de producto"

                        variant="outlined"
                        required
                        helperText="Completa el campo con el nombre del producto incluyendo el peso."
                        value={name}
                        onChange={(e) => handleName(e)}
                    />
                    <TextField fullWidth
                        id="outlined-basic"
                        label="Precio"
                        variant="outlined"
                        required
                        helperText="Completa el campo con el precio del producto"
                        value={price}
                        onChange={(e) => handlePrice(e)}





                    />
                    <TextField fullWidth
                    id="outlined-basic"
                    label="Código de barra"
                    variant="outlined"
                    required
                    helperText="Completa el campo con el código de barra del producto"
                    value={code}
                    onChange={(e) => handleCode(e)}

                />
                    <Button onClick={(e) => handleSubmit(e)} type="sumbit" variant="contained" startIcon={<AddIcon />} >
                        Agregar producto
                    </Button>

                </div>


            </Box>
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

export default AddItem;