import type { ComponentType } from "react"
import {
  CalendarDatePicker,
  CommandPalette,
  DataTableTools,
  FileDropzone,
  RangeSlider,
  SearchableCombobox,
  SheetDemo,
  ToastDemo,
} from "./components/builder"

export type ComponentSourceFileDefinition = {
  path: string
  mimeType: "text/tsx" | "text/typescript" | "text/css"
  load: () => Promise<string>
}

export type ComponentExportMetadata = {
  namedExport: string
  importPath: string
  maturity: "stable" | "preview"
}

export type ComponentDefinition = {
  id: string
  title: string
  description: string
  section: "Application patterns"
  preview: ComponentType
  exampleSource: string
  sourceFiles: readonly ComponentSourceFileDefinition[]
  dependencies: readonly string[]
  export: ComponentExportMetadata
}

const sourceFile = (
  path: string,
  load: () => Promise<{ default: string }>,
  mimeType: ComponentSourceFileDefinition["mimeType"] = "text/tsx",
): ComponentSourceFileDefinition => ({ path, mimeType, load: async () => (await load()).default })

const commandSource = sourceFile("src/components/builder/CommandPalette.tsx", () => import("./components/builder/CommandPalette.tsx?raw"))
const comboboxSource = sourceFile("src/components/builder/SearchableCombobox.tsx", () => import("./components/builder/SearchableCombobox.tsx?raw"))
const sheetSource = sourceFile("src/components/builder/Sheet.tsx", () => import("./components/builder/Sheet.tsx?raw"))
const toastSource = sourceFile("src/components/builder/ToastDemo.tsx", () => import("./components/builder/ToastDemo.tsx?raw"))
const calendarSource = sourceFile("src/components/builder/CalendarDatePicker.tsx", () => import("./components/builder/CalendarDatePicker.tsx?raw"))
const dataTableSource = sourceFile("src/components/builder/DataTableTools.tsx", () => import("./components/builder/DataTableTools.tsx?raw"))
const sliderSource = sourceFile("src/components/builder/RangeSlider.tsx", () => import("./components/builder/RangeSlider.tsx?raw"))
const dropzoneSource = sourceFile("src/components/builder/FileDropzone.tsx", () => import("./components/builder/FileDropzone.tsx?raw"))

export const COMPONENT_REGISTRY = [
  {
    id: "command-palette",
    title: "Command palette",
    description: "Global Cmd/Ctrl+K launcher with grouped fuzzy search and keyboard navigation.",
    section: "Application patterns",
    preview: CommandPalette,
    exampleSource: `<CommandPalette onSelect={(item) => console.log(item.id)} />`,
    sourceFiles: [commandSource],
    dependencies: ["cmdk", "lucide-react"],
    export: { namedExport: "CommandPalette", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "searchable-combobox",
    title: "Searchable combobox",
    description: "Base UI selection with filtering, clear, empty, and selected states.",
    section: "Application patterns",
    preview: SearchableCombobox,
    exampleSource: `<SearchableCombobox label="Visual direction" />`,
    sourceFiles: [comboboxSource],
    dependencies: ["@base-ui/react", "lucide-react"],
    export: { namedExport: "SearchableCombobox", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "directional-sheet",
    title: "Directional sheet",
    description: "A focus-trapped layer that can enter from any viewport edge.",
    section: "Application patterns",
    preview: SheetDemo,
    exampleSource: `<Sheet side="right" title="Workspace settings">…</Sheet>`,
    sourceFiles: [sheetSource],
    dependencies: ["@base-ui/react", "lucide-react"],
    export: { namedExport: "Sheet", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "toast-feedback",
    title: "Toast feedback",
    description: "Success, recovery, error, action, and dismissal feedback powered by Sonner.",
    section: "Application patterns",
    preview: ToastDemo,
    exampleSource: `<BuilderToastProvider><ToastDemo /></BuilderToastProvider>`,
    sourceFiles: [toastSource],
    dependencies: ["sonner", "lucide-react"],
    export: { namedExport: "ToastDemo", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "calendar-date-picker",
    title: "Calendar date picker",
    description: "A compact keyboard-operable calendar with selected and clear states.",
    section: "Application patterns",
    preview: CalendarDatePicker,
    exampleSource: `<CalendarDatePicker label="Launch date" />`,
    sourceFiles: [calendarSource],
    dependencies: ["react-day-picker", "lucide-react"],
    export: { namedExport: "CalendarDatePicker", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "single-range-slider",
    title: "Single and range sliders",
    description: "Pointer and keyboard controls with meaningful values, steps, and labels.",
    section: "Application patterns",
    preview: RangeSlider,
    exampleSource: `<RangeSlider singleLabel="Volume" rangeLabel="Budget range" />`,
    sourceFiles: [sliderSource],
    dependencies: ["@base-ui/react"],
    export: { namedExport: "RangeSlider", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "file-dropzone",
    title: "File dropzone",
    description: "Browse or drop files with validation, status announcements, and removal controls.",
    section: "Application patterns",
    preview: FileDropzone,
    exampleSource: `<FileDropzone accept="image/*,.pdf,.zip" multiple />`,
    sourceFiles: [dropzoneSource],
    dependencies: ["lucide-react"],
    export: { namedExport: "FileDropzone", importPath: "@/components/builder", maturity: "stable" },
  },
  {
    id: "data-table-tools",
    title: "Data table tools",
    description: "TanStack-powered sorting, filtering, selection, page sizing, and pagination.",
    section: "Application patterns",
    preview: DataTableTools,
    exampleSource: `<DataTableTools data={projects} />`,
    sourceFiles: [dataTableSource],
    dependencies: ["@tanstack/react-table", "lucide-react"],
    export: { namedExport: "DataTableTools", importPath: "@/components/builder", maturity: "stable" },
  },
] as const satisfies readonly ComponentDefinition[]

export type ComponentDefinitionId = (typeof COMPONENT_REGISTRY)[number]["id"]

export const COMPONENT_SUPPORT_FILES = [
  sourceFile("src/component-registry.tsx", () => import("./component-registry.tsx?raw")),
  sourceFile("src/components/BuilderEssentialsGallery.tsx", () => import("./components/BuilderEssentialsGallery.tsx?raw")),
  sourceFile("src/components/builder/index.ts", () => import("./components/builder/index.ts?raw"), "text/typescript"),
  sourceFile("src/components/builder/useThemePortalContainer.tsx", () => import("./components/builder/useThemePortalContainer.tsx?raw")),
  sourceFile("src/components/ui/button.tsx", () => import("./components/ui/button.tsx?raw")),
  sourceFile("src/components/ui/badge.tsx", () => import("./components/ui/badge.tsx?raw")),
  sourceFile("src/components/ui/card.tsx", () => import("./components/ui/card.tsx?raw")),
  sourceFile("src/components/ui/popover.tsx", () => import("./components/ui/popover.tsx?raw")),
  sourceFile("src/lib/utils.ts", () => import("./lib/utils.ts?raw"), "text/typescript"),
] as const satisfies readonly ComponentSourceFileDefinition[]

export const COMPONENT_STYLE_FILE = sourceFile("src/builder-essentials.css", () => import("./builder-essentials.css?raw"), "text/css")

export function getComponentDefinition(id: string): ComponentDefinition | undefined {
  return COMPONENT_REGISTRY.find((definition) => definition.id === id)
}

export function registeredComponentDependencies(): string[] {
  return [...new Set(COMPONENT_REGISTRY.flatMap((definition) => definition.dependencies))].sort()
}

export async function loadRegisteredComponentFiles(): Promise<ComponentSourceFileDefinition[]> {
  const definitions = [...COMPONENT_REGISTRY.flatMap((definition) => definition.sourceFiles), ...COMPONENT_SUPPORT_FILES, COMPONENT_STYLE_FILE]
  const unique = new Map(definitions.map((definition) => [definition.path, definition]))
  return [...unique.values()]
}
