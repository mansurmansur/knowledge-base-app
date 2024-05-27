// Modules to control application life and create native browser window
const { app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron')
const {v4: uuid} = require('uuid');
const Database = require('./database.js');
const path = require('path')

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 650,
        minWidth: 600,
        minHeight: 600,
        icon: path.join(__dirname, './src/asset/icons/app.ico'),
        webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
         sandbox: false,
         allowRunningInsecureContent: false,
        }
    })
    
    // and load the index.html of the app.
    mainWindow.loadFile('src/view/index.html')

    // remove menu
    mainWindow.setMenu(null);
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

        const { operation, data, tags} = args;


        switch (operation) {
            case 'insert':
                database.run('INSERT INTO knowledge (id, title, content) VALUES (?, ?, ?)', data)
                    .then((result) => {
                        event.reply('database-operation-reply', { operation, result });
                        
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
            case 'update':
                database.run('UPDATE knowledge SET title = ?, content = ? WHERE id = ?',data)
                    .then((result) => {
                        event.reply('database-operation-reply', { operation, result });

                        // check if the tags exist
                        tags.forEach(tag => {
                            database.get('SELECT * FROM tags WHERE name = ?', [tag])
                                .then((result) => {
                                    if (result) {
                                        console.log('Tag exists', result);
                                        // tag exists
                                        database.run('INSERT INTO knowledge_tags (knowledge_id, tag_id) VALUES (?, ?)', [data[2], result.id])
                                            .then((result) => {
                                                console.log('Tag added to knowledge: ', result);
                                            })
                                            .catch((err) => {
                                                console.error('Error adding tag to knowledge:', err);
                                            });
                                    } else {
                                        // tag does not exist
                                        console.log('Tag does not exist');
                                        const id = uuid();
                                        database.run('INSERT INTO tags (id, name) VALUES (?, ?)', [id, tag])
                                            .then((result) => {
                                                console.log('Tag added');
                                                database.run('INSERT INTO knowledge_tags (knowledge_id, tag_id) VALUES (?, ?)', [data[2], id])
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
                    })
                    .catch((err) => {
                        event.reply('database-operation-reply', { operation, error: err });
                    });
                break;
            default:
                event.reply('database-operation-reply', { operation, error: 'Unknown operation' });
        }
    });

    // IPC communication for invoke operations for request-reply type of communication
    ipcMain.handle("invoke-operation", async (event, args) => {
      const { operation } = args;
      switch (operation) {
        case "selectAll":
          return database.all("SELECT * FROM knowledge");
        case "select":
          return database.get(
            `SELECT k.id, k.title, k.content, GROUP_CONCAT(t.name) as tags
                FROM knowledge k
                LEFT JOIN knowledge_tags kt ON k.id = kt.knowledge_id
                LEFT JOIN tags t ON kt.tag_id = t.id
                WHERE k.id = ?
                GROUP BY k.id
                `,
            [args.id]
          );
        case "delete":
            return database.run("DELETE FROM knowledge WHERE id = ?", [args.id]);
        default:
          return { operation, error: "Unknown operation" };
      }
    });

    // Close the database connection when the app is closed
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})