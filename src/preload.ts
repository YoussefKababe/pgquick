// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  startServer: () => ipcRenderer.send('start-server'),
  stopServer: () => ipcRenderer.send('stop-server'),
  restartServer: () => ipcRenderer.send('restart-server'),
  getDatabases: () => ipcRenderer.send('get-databases'),
  createDatabase: (name: string) => ipcRenderer.invoke('create-database', name),
  removeDatabase: (name: string) => ipcRenderer.invoke('remove-database', name),
  onSetReady: (callback: (value: boolean) => void) =>
    ipcRenderer.on('set-ready', (_event, value: boolean) => callback(value)),
  onSetDatabases: (callback: (value: string[]) => void) =>
    ipcRenderer.on('set-databases', (_event, value: string[]) =>
      callback(value),
    ),
})
