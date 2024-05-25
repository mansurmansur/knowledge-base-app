// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
<<<<<<< HEAD
const {v4: uuid} = require('uuid');
=======
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2
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
<<<<<<< HEAD

    // remove menu
    mainWindow.setMenu(null);
=======
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2
    
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
<<<<<<< HEAD
        const { operation, data, tags} = args;
=======
        const { operation, data } = args;
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2
        switch (operation) {
            case 'insert':
                database.run('INSERT INTO knowledge (id, title, content) VALUES (?, ?, ?)', data)
                    .then((result) => {
                        event.reply('database-operation-reply', { operation, result });
<<<<<<< HEAD
                        
                        // check if the tags exist
                        tags.forEach(tag => {
                            database.get('SELECT * FROM tags WHERE name = ?', [tag])
                                .then((result) => {
                                    if (result) {
                                        // tag exists
                                        database.run('INSERT INTO knowledge_tags (knowledge_id, tag_id) VALUES (?, ?)', [data[0], result.id])
                                            .then((result) => {
                                                console.log('Tag added to knowledge: '+result);
                                            })
                                            .catch((err) => {
                                                console.error('Error adding tag to knowledge:', err);
                                            });
                                    } else {
                                        // tag does not exist
                                        const id = uuid();
                                        database.run('INSERT INTO tags (id, name) VALUES (?, ?)', [id, tag])
                                            .then((result) => {
                                                console.log('Tag added');
                                                database.run('INSERT INTO knowledge_tags (knowledge_id, tag_id) VALUES (?, ?)', [data[0], id])
                                                    .then((result) => {
                                                        console.log('Tag added to knowledge', result);
                                                    })
                                                    .catch((err) => {
                                                        console.error('Error adding tag to knowledge:', err);
                                                    });
                                            })
                                            .catch((err) => {
                                                console.error('Error adding tag:', err);
                                            });
                                    }
                                })
                                .catch((err) => {
                                    console.error('Error getting tag:', err);
                                });
                        });
=======
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2
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

<<<<<<< HEAD
    // IPC communication for invoke operations for request-reply type of communication
    ipcMain.handle('invoke-operation', async (event, args) => {
        const { operation} = args;
        switch (operation) {
            case 'select':
                return database.all('SELECT * FROM knowledge')
            default:
                return { operation, error: 'Unknown operation' };
        }
    });

=======
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})