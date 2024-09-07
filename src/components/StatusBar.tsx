import { PGLITE_VERSION, PG_VERSION } from '../constants'
import { clsxMerge } from '../utils/clsxMerge'
import { useApp } from './AppContext'

export const StatusBar = () => {
  const app = useApp()

  return (
    <div className="flex items-center justify-between bg-blue-700 p-3 py-1 text-xs text-white/80">
      <div>{`PostgreSQL ${PG_VERSION} (PGlite ${PGLITE_VERSION})`}</div>
      <div className="flex items-center gap-2">
        <span>{app.ready ? 'Online' : 'Offline'}</span>
        <span
          className={clsxMerge(
            'block h-2 w-2 rounded-full bg-red-500',
            app.ready && 'bg-green-500',
          )}
        />
      </div>
    </div>
  )
}
