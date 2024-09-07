import { createContext, useContext, useEffect, useState } from 'react'

interface AppContextProps {
  ready: boolean
  search: string
  databases: string[]
}

interface AppUpdatedContextProps {
  setReady: (ready: boolean) => void
  setSearch: (value: string) => void
  setDatabases: (databases: string[]) => void
}

interface AppProviderProps {
  children: React.ReactNode
}

const AppContext = createContext<AppContextProps | null>(null)

const AppUpdateContext = createContext<AppUpdatedContextProps | null>(null)

export const AppProvider = ({ children }: AppProviderProps) => {
  const [ready, setReady] = useState(false)
  const [search, setSearch] = useState('')
  const [databases, setDatabases] = useState<string[]>([])

  useEffect(() => {
    window.electronAPI.startServer()
    window.electronAPI.getDatabases()
    window.electronAPI.onSetReady(setReady)
    window.electronAPI.onSetDatabases(setDatabases)
  }, [])

  return (
    <AppContext.Provider value={{ ready, search, databases }}>
      <AppUpdateContext.Provider value={{ setReady, setSearch, setDatabases }}>
        {children}
      </AppUpdateContext.Provider>
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('Context must be used within an AppProvider')

  return context
}

export const useAppUpdate = () => {
  const context = useContext(AppUpdateContext)
  if (!context) throw new Error('Context must be used within an AppProvider')

  return context
}
