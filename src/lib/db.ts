import { PGlite } from '@electric-sql/pglite'
import { IpcMainEvent, app } from 'electron'
import { mkdir, readdir, rmdir } from 'node:fs/promises'

export let databases: string[] = []

export const getDatabases = async (event: IpcMainEvent) => {
  try {
    const files = await readdir(`${app.getPath('userData')}/dbs`, {
      withFileTypes: true,
    })

    databases = files.filter((f) => f.isDirectory()).map((f) => f.name)

    event.sender.send('set-databases', databases)
  } catch (error) {
    /* empty */
  }
}

export const createDatabase = async (event: IpcMainEvent, name: string) => {
  try {
    await mkdir(`${app.getPath('userData')}/dbs`)
  } catch (error) {
    /* empty */
  }

  const db = new PGlite(`${app.getPath('userData')}/dbs/${name}`)
  await db.waitReady

  await db.exec(`
    DO $$
    BEGIN
      IF NOT EXISTS (
          SELECT FROM pg_catalog.pg_roles WHERE rolname = 'pgquick'
      ) THEN
          CREATE ROLE pgquick WITH LOGIN;
      END IF;
    END $$;
  `)

  try {
    await db.exec(`CREATE DATABASE "${name}" OWNER pgquick;`)
  } catch (error) {
    /* empty */
  }

  db.close()
  getDatabases(event)
}

export const removeDatabase = async (event: IpcMainEvent, name: string) => {
  try {
    await rmdir(`${app.getPath('userData')}/dbs/${name}`)
  } catch (error) {
    /* empty */
  }

  getDatabases(event)
}
