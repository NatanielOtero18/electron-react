const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getAll: async () => {
        try {
            const resp = await ipcRenderer.invoke("getProductos");
            return resp;
        } catch (error) {
            console.log(error)
        }
    },
    getDesc: async () => {
        try {
            const resp = await ipcRenderer.invoke("getProductosDesc");
            return resp;
        } catch (error) {
            console.log(error)
        }
    },
    selectId: async (code) => {
        try {
            const resp = await ipcRenderer.invoke("selectId", code);
            return resp
        } catch (error) {
            console.log(error);
        }
    },
    selectName: async (name) => {
        try {
            const resp = await ipcRenderer.invoke("selectName", name);
            return resp
        } catch (error) {
            console.log(error);
        }
    },
    updatePrice: async (id, precio) => {
        try {
            const resp = await ipcRenderer.invoke("update", id, precio);
            return resp
        } catch (error) {
            console.log(error);
        }
    },
    updateDesc: async (id, desc) => {
        try {
            const resp = await ipcRenderer.invoke("updateDesc", id, desc);
            return resp
        } catch (error) {
            console.log(error);
        }
    },
    addItem: async (id, producto, precio) => {

        const resp = await ipcRenderer.invoke("insert", id, producto, precio);
        return resp

    },
    addSale: async (date, total) => {

        const resp = await ipcRenderer.invoke("newVenta", date, total);
        return resp

    },
    addRel: async (id_venta , id_stock,cantidad,prUnit,total) => {

        const resp = await ipcRenderer.invoke("newVentaStock", id_venta , id_stock,cantidad,prUnit,total);
        return resp

    },
    deteleProd: async (id) => {
        const resp = await ipcRenderer.invoke("delete", id);
        return resp
    },
    getVentas: async () => {
        try {
            const resp = await ipcRenderer.invoke("getVentas");
            return resp;
        } catch (error) {
            console.log(error)
        }
    },
    getVentasStock: async (id_venta) => {
        try {
            const resp = await ipcRenderer.invoke("getVentasStock", id_venta);
            return resp;
        } catch (error) {
            console.log(error)
        }
    },
    getDailyTotal: async (date) => {
        const resp = await ipcRenderer.invoke("getDailyTotal", date);
        return resp
    },
    getMonthlyTotal: async (month) => {
        const resp = await ipcRenderer.invoke("getMonthlyTotal", month);
        return resp
    },
    getByMonth: async (month) => {
        const resp = await ipcRenderer.invoke("getByMonth", month);
        return resp
    },



    // Invoke Methods
    //testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
    // Send Methods
    //testSend: (args) => ipcRenderer.send('test-send', args),
    // Receive Methods
    //testReceive: (callback) => ipcRenderer.on('test-receive', (event, data) => { callback(data) })
});