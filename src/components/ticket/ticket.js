import React, { useRef } from "react";
import styles from "./ticket.module.css"
import ReactToPrint from 'react-to-print';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';

const Ticket = (props) => {
    const { listaVenta, total } = props;
    const componentRef = useRef();

    return (
        <div className={styles.page}>
            <div className={styles.btn}>
                <ReactToPrint
                    removeAfterPrint={true}
                    trigger={() => <IconButton size="large" aria-label="imprimir">
                        <PrintIcon sx={{ fontSize: "50px" }} />
                    </IconButton>
                    }
                    content={() => componentRef.current}
                />
            </div>

            <div className={styles.mainContainer} ref={componentRef}>
                <div className={styles.ticketContainer}>
                    <div>
                    <h1>Gracias por su compra !</h1>
                    </div>
                    {
                        listaVenta.map(item => {
                            return <div className={styles.itemCard} key={item.id}>
                                <div>
                                    {item.nombre}
                                </div>
                                <div>
                                    $ {item.prUnit}
                                </div>
                                <div>
                                    X
                                </div>
                                <div>
                                    {item.cantidad}
                                </div>
                                <div>
                                    =
                                </div>
                                <div>
                                    $  {item.total}
                                </div>
                            </div>
                        })
                    }
                    <div className={styles.total}>
                        Total $ {total}
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Ticket;