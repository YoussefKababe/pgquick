import { AppBar } from './AppBar'
import { AppProvider } from './AppContext'
import { DatabaseList } from './DatabaseList'
import { StatusBar } from './StatusBar'
import { TitleBar } from './TitleBar'

export const App = () => {
  return (
    <AppProvider>
      <>
        <TitleBar />
        <AppBar />
        <DatabaseList />
        <StatusBar />
      </>
    </AppProvider>
  )
}
