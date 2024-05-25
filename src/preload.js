const { ipcRenderer, contextBridge } = require('electron');
const {v4: uuid} = require('uuid');

// whitelisted channels
<<<<<<< HEAD
const validChannels = ['database-operation', 'database-operation-reply', 'invoke-operation'];
=======
const validChannels = ['database-operation', 'database-operation-reply'];
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
<<<<<<< HEAD
    invoke: async (channel, data) => {
        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, data);
        }
    },
=======
>>>>>>> ca7ec1c2e5b79ea1013339f0d96f46bde52ce4f2
    uuid: uuid(),
});

