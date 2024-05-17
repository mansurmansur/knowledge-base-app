// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const Database = require('./database.js');
const path = require('path')

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
         sandbox: false,
         allowRunningInsecureContent: false,
        }
    })
    
    // and load the index.html of the app.
    mainWindow.loadFile('src/view/index.html')
    
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}



app.whenReady().then(() => {
    createWindow()
    // Initialize the database
    const dbPath = path.resolve(__dirname, './modal/knowledgebase.db');
    database = new Database(dbPath);

    console.log(database)

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    // IPC communication for database operations with knowledgebase.js file
    // TODO: Implement complete search functionality & rest of the database operations
    ipcMain.on('database-operation', (event, args) => {
        const { operation, data } = args;
        switch (operation) {
            case 'insert':
                database.run('INSERT INTO knowledge (id, title, content) VALUES (?, ?, ?)', data)
                    .then((result) => {
                        event.reply('database-operation-reply', { operation, result });
                    })
                    .catch((err) => {
                        event.reply('database-operation-reply', { operation, error: err });
                    });
                break;
            case 'select':
                database.all('SELECT * FROM knowledge')
                    .then((result) => {
                        event.reply('database-operation-reply', { operation, result });
                    })
                    .catch((err) => {
                        event.reply('database-operation-reply', { operation, error: err });
                    });
                break;
            default:
                event.reply('database-operation-reply', { operation, error: 'Unknown operation' });
        }
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})