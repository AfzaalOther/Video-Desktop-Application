const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendVideoToAPI: async (videoPath) => {
    return await ipcRenderer.invoke('send-video-to-api', videoPath);
  },
  detectVideo: async (videoPath) => {
    return await ipcRenderer.invoke('detect-video', videoPath);
  }
});
