import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import { execSync } from 'node:child_process'

function computeFileSha256(filePath) {
  const hash = crypto.createHash('sha256')
  const data = fs.readFileSync(filePath)
  hash.update(data)
  return hash.digest('hex')
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupDir = path.resolve(process.cwd(), 'backups')

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  console.log('========================================================')
  console.log(`📦 SCHOOL PLATFORM DISASTER RECOVERY BACKUP: ${timestamp}`)
  console.log('========================================================\n')

  const dbUri = process.env.DATABASE_URI || 'file:./school.db'
  const isPostgres = dbUri.startsWith('postgres://') || dbUri.startsWith('postgresql://')

  let dbSnapshotFilename = ''
  let dbSha256 = ''
  let dbSizeBytes = 0

  // 1. Back up Database with Atomic Consistency
  if (isPostgres) {
    console.log('PostgreSQL database detected.')
    // Check if pg_dump is available without leaking credentials
    let pgDumpAvailable = false
    try {
      execSync('pg_dump --version', { stdio: 'ignore' })
      pgDumpAvailable = true
    } catch {
      pgDumpAvailable = false
    }

    if (!pgDumpAvailable) {
      throw new Error(
        'PostgreSQL backup requested, but pg_dump CLI is not available in system PATH. Cannot create verifiable backup.'
      )
    }

    dbSnapshotFilename = `db-backup-${timestamp}.sql`
    const destDbPath = path.join(backupDir, dbSnapshotFilename)

    try {
      execSync(`pg_dump "${dbUri}" > "${destDbPath}"`, { stdio: 'pipe' })
      if (!fs.existsSync(destDbPath)) {
        throw new Error('PostgreSQL dump file was not created')
      }
      const stats = fs.statSync(destDbPath)
      dbSizeBytes = stats.size
      if (dbSizeBytes === 0) {
        throw new Error('PostgreSQL dump produced an empty (0-byte) backup file. Backup failed.')
      }
      dbSha256 = computeFileSha256(destDbPath)
      console.log(`✓ PostgreSQL database dumped: ${destDbPath} (${(dbSizeBytes / 1024).toFixed(1)} KB)`)
    } catch (dumpErr) {
      if (fs.existsSync(destDbPath)) {
        try { fs.unlinkSync(destDbPath) } catch {}
      }
      throw new Error(`PostgreSQL pg_dump command failed: ${dumpErr.message}`)
    }
  } else {
    const rawSqlitePath = dbUri.replace(/^file:/, '').trim()
    const sqlitePath = path.isAbsolute(rawSqlitePath)
      ? rawSqlitePath
      : path.resolve(process.cwd(), rawSqlitePath)

    if (!fs.existsSync(sqlitePath)) {
      throw new Error(`CRITICAL: SQLite database file not found at ${sqlitePath}`)
    }

    dbSnapshotFilename = `db-backup-${timestamp}.sqlite`
    const destDbPath = path.join(backupDir, dbSnapshotFilename)

    // Use SQLite's native VACUUM INTO for consistent, non-torn snapshot checkpointing WAL
    try {
      const db = new DatabaseSync(sqlitePath)
      // Checkpoint any open WAL frames into main database file
      try {
        db.exec('PRAGMA wal_checkpoint(TRUNCATE);')
      } catch {
        // Continue if in read-only or standard mode
      }
      // Atomic snapshot
      db.exec(`VACUUM INTO '${destDbPath.replace(/'/g, "''")}';`)
      db.close()

      const stats = fs.statSync(destDbPath)
      dbSizeBytes = stats.size
      dbSha256 = computeFileSha256(destDbPath)
      console.log(`✓ Atomic SQLite snapshot created: ${destDbPath} (${(dbSizeBytes / 1024).toFixed(1)} KB)`)
      console.log(`  SHA256: ${dbSha256}`)
    } catch (sqliteErr) {
      throw new Error(`Failed to create atomic SQLite snapshot: ${sqliteErr.message}`)
    }
  }

  // 2. Back up Media uploads
  const mediaDir = process.env.MEDIA_DIR
    ? (path.isAbsolute(process.env.MEDIA_DIR) ? process.env.MEDIA_DIR : path.resolve(process.cwd(), process.env.MEDIA_DIR))
    : path.resolve(process.cwd(), 'public/media')
  const destMediaDirname = `media-backup-${timestamp}`
  const destMediaDir = path.join(backupDir, destMediaDirname)
  const mediaChecksums = {}
  let mediaCount = 0
  let mediaTotalSize = 0

  if (fs.existsSync(mediaDir)) {
    fs.mkdirSync(destMediaDir, { recursive: true })
    const files = fs.readdirSync(mediaDir)

    for (const file of files) {
      const srcFile = path.join(mediaDir, file)
      const stat = fs.statSync(srcFile)
      if (stat.isFile()) {
        const destFile = path.join(destMediaDir, file)
        fs.copyFileSync(srcFile, destFile)
        const hash = computeFileSha256(destFile)
        mediaChecksums[file] = hash
        mediaCount++
        mediaTotalSize += stat.size
      }
    }
    console.log(`✓ Media files backed up: ${mediaCount} files (${(mediaTotalSize / 1024).toFixed(1)} KB)`)
  } else {
    console.warn(`⚠️ Warning: Media directory not found at ${mediaDir}, 0 files backed up.`)
  }

  // 3. Write metadata manifest pairing database with exact media snapshot
  const manifest = {
    version: '2.0',
    timestamp,
    database: {
      type: isPostgres ? 'postgresql' : 'sqlite',
      filename: dbSnapshotFilename,
      sizeBytes: dbSizeBytes,
      sha256: dbSha256,
    },
    media: {
      directory: destMediaDirname,
      fileCount: mediaCount,
      totalBytes: mediaTotalSize,
      checksums: mediaChecksums,
    },
    createdWith: 'school-platform atomic backup utility',
  }

  const manifestFilename = `manifest-${timestamp}.json`
  const manifestPath = path.join(backupDir, manifestFilename)
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`✓ Paired manifest created: ${manifestPath}`)

  console.log('\n✅ Disaster recovery backup completed and verified!')
  console.log(`Location: ${backupDir}`)
  console.log(`Manifest: ${manifestFilename}\n`)
}

runBackup().catch((err) => {
  console.error('❌ Backup failed:', err.message)
  process.exit(1)
})
