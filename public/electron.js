
const { app, BrowserWindow, ipcMain } = require('electron'); // electron
const isDev = require('electron-is-dev'); // To check if electron is in development mode
const path = require('path');

const sqlite3 = require('sqlite3');

// Initializing a new database
const db = new sqlite3.Database(
    isDev
        ? path.join(__dirname, '../db/kioscoDT.db') // my root folder if in dev mode
        : path.join(process.resourcesPath, 'db/kioscoDT.db'), // the resources path if in production build
    (err) => {
        if (err) {
            console.log(`Database Error: ${err}`);
        } else {
            console.log('Database Loaded');
        }
    }
);

let mainWindow;

// Initializing the Electron Window
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200, // width of window
        height: 800, // height of window
        autoHideMenuBar: true,
        show:false,
        webPreferences: {
            // The preload file where we will perform our app communication
            preload: isDev
                ? path.join(app.getAppPath(), './public/preload.js') // Loading it from the public folder for dev
                : path.join(app.getAppPath(), './build/preload.js'), // Loading it from the build folder for production
            worldSafeExecuteJavaScript: true, // If you're using Electron 12+, this should be enabled by default and does not need to be added here.
            contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
        },
    })
    mainWindow.maximize();
    mainWindow.show();
    db.query = function (sql, params = []) {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.all(sql, params, function (error, result) {
                if (error) {
                    console.log(error)
                    reject(error);
                } else {
                    console.log(result)
                    resolve(result);
                }
            });
        });
    };
    ipcMain.handle("getProductos", async (event) => {
        const sql = `SELECT * FROM stock ; `;
        return await db.query(sql, [])
    })
    ipcMain.handle("selectId", async (event, args) => {
        const sql = `
                        SELECT *
                        FROM stock WHERE id = ? ;       
                    `;
        return await db.query(sql, [args]);

    })
    ipcMain.handle("selectName", async (event, args) => {
        try {
            const sql = `
            SELECT *
            FROM stock WHERE producto = ?;       
        `;
            return await db.query(sql, [args]);
        } catch (error) {
            console.log(error)
        }


    })
    ipcMain.handle("update", async (event,id, precio) => {
        try {
            const sql = `
            UPDATE stock
            SET precio = ? WHERE id = ?;       
        `;
            return await db.query(sql, [precio,id]);
        } catch (error) {
            console.log(error)
        }


    })
    ipcMain.handle("updateDesc", async (event,id, desc) => {
        try {
            const sql = `
            UPDATE stock
            SET desc = ? WHERE id = ?;       
        `;
            return await db.query(sql, [desc,id]);
        } catch (error) {
            console.log(error)
        }


    })
    ipcMain.handle("insert", async (event,id, producto ,precio) => {
        try {
            const sql = `
            INSERT INTO stock (id,producto,precio)
            VALUES (?,?,?);
           ;       
        `;
            return await db.query(sql, [id,producto,precio]);
        } catch (error) {
            return error.message;
        }


    })
    ipcMain.handle("delete", async (event,id) => {
        try {
            const sql = `
            DELETE FROM stock
            WHERE id = ?;       
        `;
            return await db.query(sql, [id]);
        } catch (error) {
            console.log(error)
        }


    })
    




    // Loading a webpage inside the electron window we just created
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000' // Loading localhost if dev mode
            : `file://${path.join(__dirname, '../build/index.html')}` // Loading build file if in production
    );



    // In development mode, if the window has loaded, then load the dev tools.
    if (isDev) {
        mainWindow.webContents.on('did-frame-finish-load', () => {
            mainWindow.webContents.openDevTools({ mode: 'detach' });
        });
    }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
    'userData',
    isDev
        ? path.join(app.getAppPath(), 'userdata/') // In development it creates the userdata folder where package.json is
        : path.join(process.resourcesPath, 'userdata/') // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
    await createWindow(); // Create the mainWindow


});

// Exiting the app
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Activating the app
app.on('activate', () => {
    if (mainWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {
    console.log(`Exception: ${error}`);
    if (process.platform !== 'darwin') {
        app.quit();
    }
});