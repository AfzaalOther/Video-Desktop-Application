const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.webContents.openDevTools();

  const menu = Menu.buildFromTemplate([
    {
      label: 'Home',
      click() {
        win.loadFile('home.html');
      }
    },
    {
      label: 'Video',
      click() {
        win.loadFile('video.html');
      }
    }
  ]);
  Menu.setApplicationMenu(menu);

  win.loadFile('home.html');

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

 
 

// Handle the 'detect-video' event
ipcMain.handle('detect-video', async (event, videoPath) => {
  const command = `python ${path.join(__dirname, 'yoloBE', 'detect.py')} --source ${videoPath} --weights ${path.join(__dirname, 'yoloBE', 'yolov5s.pt')} --data ${path.join(__dirname, 'yoloBE', 'data', 'coco128.yaml')} --view-img 1 --device cpu`;

  return new Promise((resolve, reject) => {
    exec(command, { cwd: path.join(__dirname, 'yoloBE') }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        reject(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
      
      // Find the latest exp folder
      const detectDir = path.join(__dirname, 'yoloBE', 'runs', 'detect');
      fs.readdir(detectDir, (err, files) => {
        if (err) {
          console.error(`Error reading detect directory: ${err.message}`);
          reject(`Error reading detect directory: ${err.message}`);
          return;
        }
        // Filter for exp directories
        const expDirs = files.filter(file => file.startsWith('exp'));
        console.log('====================================');
        console.log(expDirs);
        console.log('====================================');
        // Sort by newest exp folder
        expDirs.sort((a, b) => {
          const aNum = parseInt(a.replace('exp', ''), 10);
          const bNum = parseInt(b.replace('exp', ''), 10);
          return bNum - aNum;
        });
        if (expDirs.length === 0) {
          reject('No exp directories found');
          return;
        }
        const latestExpDir = expDirs[0];
        const detectedVideoPath = path.join(detectDir, latestExpDir, path.basename(videoPath));
        console.log('====================================');
        console.log("detectedVideoPath",detectDir,latestExpDir, detectedVideoPath);
        console.log('====================================');
        resolve(detectedVideoPath);
      });
    });
  });
});