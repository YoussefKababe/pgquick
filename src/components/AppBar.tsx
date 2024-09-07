import { useEffect, useState } from 'react'

import { useAppUpdate } from './AppContext'

export const AppBar = () => {
  const { setSearch } = useAppUpdate()
  const [loading, setLoading] = useState(false)
  const [dbName, setDbName] = useState('')

  useEffect(() => {
    setSearch(dbName)
  }, [dbName])

  return (
    <div className="flex h-[70px] bg-blue-700 px-3 py-3">
      <form
        className="flex flex-1 rounded border border-blue-600 bg-blue-900 p-2"
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          await window.electronAPI.createDatabase(dbName)
          setTimeout(() => {
            setLoading(false)
            setDbName('')
          }, 1000)
        }}
      >
        <input
          className="flex-1 bg-transparent outline-none"
          placeholder="Search / Name your new database"
          value={dbName}
          disabled={loading}
          onChange={(e) => {
            if (loading) return
            setDbName(e.target.value)
          }}
        />
        <button
          type="submit"
          className="rounded bg-green-600 px-2 text-sm font-semibold transition-opacity disabled:opacity-60"
          disabled={!dbName || loading}
        >
          Create
        </button>
      </form>
    </div>
  )
}
