const { ipcRenderer, contextBridge } = require('electron');
const {v4: uuid} = require('uuid');

// whitelisted channels
const validChannels = ['database-operation', 'database-operation-reply', 'invoke-operation'];


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
    invoke: async (channel, data) => {
        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, data);
        }
    },
    uuid: uuid(),
});

