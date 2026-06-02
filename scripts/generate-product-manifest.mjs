import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public', 'products')
const outFile = path.join(root, 'src', 'generated', 'product-images.json')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.jfif', '.avif'])
/** Préférer vraies photos avant les placeholders .png générés */
const EXT_RANK = ['jpg', 'jpeg', 'jfif', 'webp', 'avif', 'gif', 'png']

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
}

function normalizeForMatch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]/g, '')
}

/** Placeholders créés par upload_images.py : slug-minuscule.png (~5–10 Ko) */
function isGeneratedPlaceholder(filename, sizeBytes) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)+\.png$/i.test(filename)) return false
  return sizeBytes < 20_000
}

function rankFile(filename) {
  const ext = path.extname(filename).slice(1).toLowerCase()
  const idx = EXT_RANK.indexOf(ext)
  return idx === -1 ? EXT_RANK.length : idx
}

function pickBestFile(candidates) {
  return [...candidates].sort((a, b) => rankFile(a.name) - rankFile(b.name))[0].name
}

function buildManifest(filesWithSize) {
  const groups = new Map()

  for (const { name, size } of filesWithSize) {
    const key = normalizeForMatch(name)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({ name, size })
  }

  const manifest = []

  for (const group of groups.values()) {
    const realPhotos = group.filter((f) => !isGeneratedPlaceholder(f.name, f.size))
    const pool = realPhotos.length > 0 ? realPhotos : group
    manifest.push(pickBestFile(pool))
  }

  return manifest.sort((a, b) => a.localeCompare(b))
}

function removePlaceholderDuplicates(filesWithSize) {
  const groups = new Map()
  for (const file of filesWithSize) {
    const key = normalizeForMatch(file.name)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(file)
  }

  let removed = 0
  for (const group of groups.values()) {
    const hasReal = group.some((f) => !isGeneratedPlaceholder(f.name, f.size))
    if (!hasReal) continue

    for (const f of group) {
      if (isGeneratedPlaceholder(f.name, f.size)) {
        fs.unlinkSync(path.join(publicDir, f.name))
        removed++
      }
    }
  }
  return removed
}

ensureDir(publicDir)

let filesWithSize = listImages(publicDir).map((name) => {
  const full = path.join(publicDir, name)
  return { name, size: fs.statSync(full).size }
})

const removed = removePlaceholderDuplicates(filesWithSize)
if (removed > 0) {
  console.log(`Removed ${removed} placeholder .png (real photos kept).`)
  filesWithSize = listImages(publicDir).map((name) => ({
    name,
    size: fs.statSync(path.join(publicDir, name)).size,
  }))
}

const manifest = buildManifest(filesWithSize)

ensureDir(path.dirname(outFile))
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2) + '\n', 'utf8')

console.log(`Product manifest: ${manifest.length} image(s) → ${path.relative(root, outFile)}`)
