import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

function computeFileSha256(filePath) {
  const hash = crypto.createHash('sha256')
  const data = fs.readFileSync(filePath)
  hash.update(data)
  return hash.digest('hex')
}

async function runRestore() {
  const args = process.argv.slice(2)
  const backupDir = path.resolve(process.cwd(), 'backups')

  console.log('========================================================')
  console.log('🔄 SCHOOL PLATFORM DISASTER RECOVERY RESTORATION DRILL')
  console.log('========================================================\n')

  if (!fs.existsSync(backupDir)) {
    throw new Error(`CRITICAL: Backup directory not found at ${backupDir}`)
  }

  const allFiles = fs.readdirSync(backupDir)

  // 1. Identify Target Manifest
  let targetManifestFile = ''
  if (args[0]) {
    const inputArg = args[0]
    if (inputArg.endsWith('.json')) {
      targetManifestFile = inputArg
    } else if (inputArg.startsWith('db-backup-')) {
      const ts = inputArg.replace('db-backup-', '').replace('.sqlite', '').replace('.sql', '')
      targetManifestFile = `manifest-${ts}.json`
    } else {
      targetManifestFile = `manifest-${inputArg}.json`
    }
  } else {
    // Pick latest valid manifest
    const manifests = allFiles
      .filter((f) => f.startsWith('manifest-') && f.endsWith('.json'))
      .sort()
      .reverse()

    if (manifests.length === 0) {
      throw new Error('No paired backup manifests found in backups/ directory.')
    }
    targetManifestFile = manifests[0]
  }

  const manifestPath = path.join(backupDir, targetManifestFile)
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Specified manifest file not found: ${manifestPath}`)
  }

  console.log(`Reading paired manifest: ${targetManifestFile}`)
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8')
  const manifest = JSON.parse(manifestRaw)

  // 2. Validate Database Snapshot against Manifest
  const dbSnapshotName = manifest.database?.filename || `db-backup-${manifest.timestamp}.sqlite`
  const sourceDbPath = path.join(backupDir, dbSnapshotName)

  if (!fs.existsSync(sourceDbPath)) {
    throw new Error(`CRITICAL: Database snapshot ${sourceDbPath} specified in manifest does not exist!`)
  }

  if (manifest.database?.sha256) {
    const actualDbSha = computeFileSha256(sourceDbPath)
    if (actualDbSha !== manifest.database.sha256) {
      throw new Error(
        `INTEGRITY FAILURE: Database snapshot SHA256 checksum mismatch!\nExpected: ${manifest.database.sha256}\nFound:    ${actualDbSha}`
      )
    }
    console.log(`✓ Database snapshot checksum verified: ${actualDbSha}`)
  }

  // 3. Validate Paired Media Snapshot
  const pairedMediaDirname = manifest.media?.directory || `media-backup-${manifest.timestamp}`
  const sourceMediaDir = path.join(backupDir, pairedMediaDirname)

  if (!fs.existsSync(sourceMediaDir)) {
    console.warn(`⚠️ Warning: Paired media directory not found at ${sourceMediaDir}`)
  } else {
    console.log(`✓ Paired media backup verified: ${pairedMediaDirname}`)
  }

  // 4. Create Pre-Restore Rollback Copy of Current Database
  const dbUri = process.env.DATABASE_URI || 'file:./school.db'
  const rawSqlitePath = dbUri.replace(/^file:/, '').trim()
  const targetDbPath = path.isAbsolute(rawSqlitePath)
    ? rawSqlitePath
    : path.resolve(process.cwd(), rawSqlitePath)

  if (fs.existsSync(targetDbPath)) {
    const preRestoreCopy = `${targetDbPath}.prerestore-${Date.now()}`
    fs.copyFileSync(targetDbPath, preRestoreCopy)
    console.log(`✓ Pre-restore safety copy created: ${preRestoreCopy}`)
  }

  // 5. Restore Database Snapshot
  fs.copyFileSync(sourceDbPath, targetDbPath)
  const dbStat = fs.statSync(targetDbPath)
  console.log(`✓ Database successfully restored to ${targetDbPath} (${(dbStat.size / 1024).toFixed(1)} KB)`)

  // 6. Restore Paired Media
  if (fs.existsSync(sourceMediaDir)) {
    const destMediaDir = process.env.MEDIA_DIR
      ? (path.isAbsolute(process.env.MEDIA_DIR) ? process.env.MEDIA_DIR : path.resolve(process.cwd(), process.env.MEDIA_DIR))
      : path.resolve(process.cwd(), 'public/media')
    if (!fs.existsSync(destMediaDir)) {
      fs.mkdirSync(destMediaDir, { recursive: true })
    }

    const mediaFiles = fs.readdirSync(sourceMediaDir)
    let mediaRestoredCount = 0
    for (const f of mediaFiles) {
      const src = path.join(sourceMediaDir, f)
      const dst = path.join(destMediaDir, f)
      fs.copyFileSync(src, dst)
      mediaRestoredCount++
    }
    console.log(`✓ Restored ${mediaRestoredCount} media files from ${pairedMediaDirname} into ${destMediaDir}`)
  }

  console.log('\n✅ Restoration drill completed successfully!')
  console.log(`Restored state timestamp: ${manifest.timestamp}`)
  console.log('Run `npm run verify` to validate data integrity against the restored snapshot.\n')
}

runRestore().catch((err) => {
  console.error('❌ Restore failed:', err.message)
  process.exit(1)
})
