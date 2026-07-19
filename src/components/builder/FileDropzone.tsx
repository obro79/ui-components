import { File, Trash2, UploadCloud } from "lucide-react"
import { useId, useRef, useState } from "react"

type FileRecord = {
  id: string
  file: File
  error?: string
}

export type FileDropzoneProps = {
  accept?: string
  multiple?: boolean
  maxSizeBytes?: number
  onFilesChange?: (files: File[]) => void
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileDropzone({ accept = "image/*,.pdf,.zip", multiple = true, maxSizeBytes = 10 * 1024 * 1024, onFilesChange }: FileDropzoneProps) {
  const [records, setRecords] = useState<FileRecord[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const helpId = useId()
  const statusId = useId()

  const commitFiles = (incoming: File[]) => {
    const chosen = multiple ? incoming : incoming.slice(0, 1)
    const next = chosen.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      file,
      error: file.size > maxSizeBytes ? `File is larger than ${formatBytes(maxSizeBytes)}.` : undefined,
    }))
    setRecords(next)
    onFilesChange?.(next.filter((record) => !record.error).map((record) => record.file))
  }

  const removeFile = (id: string) => {
    setRecords((current) => {
      const next = current.filter((record) => record.id !== id)
      onFilesChange?.(next.filter((record) => !record.error).map((record) => record.file))
      return next
    })
  }

  const validCount = records.filter((record) => !record.error).length
  const errorCount = records.length - validCount

  return <div className="builder-dropzone-demo">
    <input
      ref={inputRef}
      id={inputId}
      className="builder-file-input"
      type="file"
      accept={accept}
      multiple={multiple}
      tabIndex={-1}
      aria-label={multiple ? "Choose files" : "Choose a file"}
      aria-describedby={`${helpId} ${statusId}`}
      onChange={(event) => {
        commitFiles(Array.from(event.target.files ?? []))
        event.currentTarget.value = ""
      }}
    />
    <button
      type="button"
      className="builder-dropzone"
      data-dragging={dragging || undefined}
      aria-describedby={`${helpId} ${statusId}`}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
      onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy" }}
      onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }}
      onDrop={(event) => { event.preventDefault(); setDragging(false); commitFiles(Array.from(event.dataTransfer.files)) }}
    >
      <span className="builder-dropzone-icon"><UploadCloud aria-hidden="true" size={24} /></span>
      <strong>{dragging ? "Drop files here" : "Drop files or browse"}</strong>
      <span id={helpId}>Images, PDFs, or ZIP files up to {formatBytes(maxSizeBytes)}</span>
    </button>
    <p id={statusId} className="builder-status-line" role="status">{records.length ? `${validCount} ready${errorCount ? `, ${errorCount} needs attention` : ""}` : "No files selected"}</p>

    {records.length > 0 && <ul className="builder-file-list" aria-label="Selected files">
      {records.map((record) => <li key={record.id} data-error={Boolean(record.error) || undefined}>
        <span className="builder-file-icon"><File aria-hidden="true" size={17} /></span>
        <span><strong>{record.file.name}</strong><small>{record.error ?? formatBytes(record.file.size)}</small></span>
        <button type="button" className="builder-icon-button" aria-label={`Remove ${record.file.name}`} onClick={() => removeFile(record.id)}><Trash2 aria-hidden="true" size={15} /></button>
      </li>)}
    </ul>}
  </div>
}
