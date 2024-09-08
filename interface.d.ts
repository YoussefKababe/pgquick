export interface IElectronAPI {
  startServer: () => void
  stopServer: () => void
  restartServer: () => void
  getDatabases: () => void
  createDatabase: (name: string) => Promise<void>
  removeDatabase: (name: string) => Promise<void>
  onSetReady: (callback: (value: boolean) => void) => Electron.IpcRenderer
  onSetDatabases: (callback: (value: string[]) => void) => Electron.IpcRenderer
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
