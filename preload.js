const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  detectVideo: (videoPath) => ipcRenderer.invoke('detect-video', videoPath)
});
