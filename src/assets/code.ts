export type Layer = "datasource" | "repository" | "viewmodel" | "ui";

export interface LayerInfo {
  id: Layer;
  label: string;
  description: string;
  className: string;
  colorVar: string;
  onColorVar: string;
}

export const LAYER_METADATA: Record<Layer, LayerInfo> = {
  ui: {
    id: "ui",
    label: "Composable UI",
    description: "Menampilkan state & mengirim event",
    className: "DetailScreen",
    colorVar: "var(--c-ui)",
    onColorVar: "var(--on-ui)",
  },
  viewmodel: {
    id: "viewmodel",
    label: "ViewModel",
    description: "State holder tingkat layar",
    className: "DetailViewModel",
    colorVar: "var(--c-vm)",
    onColorVar: "var(--on-vm)",
  },
  repository: {
    id: "repository",
    label: "Repository",
    description: "Satu pintu akses data",
    className: "StudentRepository",
    colorVar: "var(--c-repo)",
    onColorVar: "var(--on-repo)",
  },
  datasource: {
    id: "datasource",
    label: "Data Source",
    description: "Sumber data (in-memory list)",
    className: "StudentLocalDataSource",
    colorVar: "var(--c-ds)",
    onColorVar: "var(--on-ds)",
  },
};

export const RAW_CODE = `@Composable
fun DetailScreen(studentId: Int) {
    // @layer:datasource-start
    val students = listOf(
        Student(2026, "Alya Putri", "TI", 2026),
        Student(2027, "Bima Pratama", "TI", 2026)
    )
    // @layer:datasource-end

    // @layer:repository-start
    fun getStudentById(id: Int): Student? =
        students.find { it.id == id }
    // @layer:repository-end

    // @layer:viewmodel-start
    var student by remember { mutableStateOf<Student?>(null) }
    LaunchedEffect(studentId) {
        student = getStudentById(studentId)
    }
    // @layer:viewmodel-end

    // @layer:ui-start
    Column {
        Text(student?.name ?: "Mencari data...")
    }
    // @layer:ui-end
}`;

export interface ParsedLayers {
  lines: string[];
  layerOf: (Layer | null)[];
}

export function parseLayers(raw: string): ParsedLayers {
  const rawLines = raw.split(/\r?\n/);
  const lines: string[] = [];
  const layerOf: (Layer | null)[] = [];
  let currentLayer: Layer | null = null;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("// @layer:") && trimmed.endsWith("-start")) {
      currentLayer = trimmed.slice(10, -6) as Layer;
    } else if (trimmed.startsWith("// @layer:") && trimmed.endsWith("-end")) {
      currentLayer = null;
    } else {
      lines.push(line);
      // Baris kosong di antara blok tidak milik lapisan mana pun
      layerOf.push(trimmed === "" ? null : currentLayer);
    }
  }

  return { lines, layerOf };
}

export function dedentLines(lines: string[], spaces = 4): string[] {
  const prefix = " ".repeat(spaces);
  return lines.map((line) => {
    if (line.startsWith(prefix)) {
      return line.slice(spaces);
    }
    return line;
  });
}
