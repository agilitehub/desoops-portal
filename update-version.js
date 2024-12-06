const fs = require('fs')
const path = require('path')

// Read package.json
const packageJson = require('./package.json')
const version = packageJson.version

// Update version.json
const versionJson = {
  version: version,
  buildDate: new Date().toISOString().split('T')[0]
}

// Write to version.json
fs.writeFileSync(
  path.join(__dirname, 'public', 'version.json'),
  JSON.stringify(versionJson, null, 2)
)

// Update package-lock.json
const packageLockPath = path.join(__dirname, 'package-lock.json')
const packageLock = require(packageLockPath)

packageLock.version = version
packageLock.packages[''].version = version

fs.writeFileSync(
  packageLockPath,
  JSON.stringify(packageLock, null, 2)
)

console.log('Updated version.json and package-lock.json with version:', version) 