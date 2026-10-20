"use client";

import type { Canvas as FabricCanvas, FabricObject } from "fabric";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  JsonDialog,
  PublishDialog,
  ScheduleDialog,
} from "./editor-dialogs";
import { EditorIcon, type EditorIconName } from "./editor-icons";
import { MediaPager } from "./media-pager";
import { EditorPanel } from "./editor-panel";
import {
  BRAND_COLORS,
  CANVAS_PRESETS,
  DEFAULT_SELECTION,
  type CanvasSize,
  type EditorObject,
  type QueueItem,
  type SelectionState,
  type ToolId,
} from "./editor-types";

const QUEUE_KEY = "postpooch:content-queue";
const AUTOSAVE_DELAY_MS = 900;
const AUTOSAVE_RETRY_MAX_MS = 30_000;
/** Keep in sync with MAX_PROJECT_MEDIA in lib/post-projects.ts */
const MAX_SLIDES = 10;
const TOOLS: { id: ToolId; label: string; icon: EditorIconName }[] = [
  { id: "design", label: "Design", icon: "design" },
  { id: "uploads", label: "Uploads", icon: "upload" },
  { id: "text", label: "Text", icon: "text" },
  { id: "elements", label: "Elements", icon: "elements" },
  { id: "brand", label: "Brand", icon: "brand" },
  { id: "layers", label: "Layers", icon: "layers" },
];

function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.download = filename;
  anchor.href = dataUrl;
  anchor.click();
}

function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  downloadDataUrl(url, filename);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function safeProjectName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "postpooch-design"
  );
}

type ProjectDocument = Record<string, unknown>;

export type EditorMediaSlide = {
  id: string;
  displayOrder: number;
  imageDesign: ProjectDocument | null;
};

type PendingSave = {
  mediaId: string;
  name: string;
  document: ProjectDocument;
  snapshot: string;
};

class AutosaveError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}

type PostEditorProps = {
  projectId: string;
  initialMedia: EditorMediaSlide[];
  initialName: string;
};

export function PostEditor({
  projectId,
  initialMedia,
  initialName,
}: PostEditorProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const fabricRef = useRef<typeof import("fabric") | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<PendingSave | null>(null);
  const lastSavedSnapshotRef = useRef("");
  const saveInFlightRef = useRef(false);
  const flushAfterFlightRef = useRef(false);
  const retryAttemptRef = useRef(0);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);
  const persistPendingRef = useRef<() => void>(() => undefined);
  const restoringRef = useRef(false);
  const projectNameRef = useRef(initialName);
  const slidesRef = useRef(initialMedia);
  const activeMediaIdRef = useRef(initialMedia[0]?.id ?? "");
  const slideBusyRef = useRef(false);
  const stepSlideRef = useRef<(direction: -1 | 1) => void>(() => undefined);
  const historyRef = useRef<{ entries: string[]; index: number }>({
    entries: [],
    index: -1,
  });

  const [activeTool, setActiveTool] = useState<ToolId>("design");
  const [panelOpen, setPanelOpen] = useState(true);
  const [projectName, setProjectName] = useState(initialName);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(CANVAS_PRESETS[0]);
  const [fitScale, setFitScale] = useState(0.5);
  const [zoom, setZoom] = useState(100);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Preparing canvas…");
  const [selection, setSelection] =
    useState<SelectionState>(DEFAULT_SELECTION);
  const [hasSelection, setHasSelection] = useState(false);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });
  const [layers, setLayers] = useState<FabricObject[]>([]);
  const [toast, setToast] = useState("");
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [slides, setSlides] = useState(initialMedia);
  const [activeMediaId, setActiveMediaId] = useState(
    initialMedia[0]?.id ?? "",
  );
  const [slideBusy, setSlideBusy] = useState(false);

  useEffect(() => {
    projectNameRef.current = projectName;
  }, [projectName]);

  const serializedCanvas = useCallback((canvas: FabricCanvas) => {
    return JSON.stringify({
      ...canvas.toJSON(),
      width: canvas.width,
      height: canvas.height,
    });
  }, []);

  const buildProjectSave = useCallback(
    (canvas: FabricCanvas): PendingSave => {
      const document = JSON.parse(serializedCanvas(canvas)) as ProjectDocument;
      const name = projectNameRef.current;
      const mediaId = activeMediaIdRef.current;

      return {
        document,
        name,
        mediaId,
        snapshot: JSON.stringify({ name, mediaId, document }),
      };
    },
    [serializedCanvas],
  );

  const syncHistoryButtons = useCallback(() => {
    const history = historyRef.current;
    setHistoryState({
      canUndo: history.index > 0,
      canRedo:
        history.index >= 0 && history.index < history.entries.length - 1,
    });
  }, []);

  const persistPending = useCallback(async () => {
    if (saveInFlightRef.current) {
      flushAfterFlightRef.current = true;
      return;
    }

    const pending = pendingSaveRef.current;
    if (!pending || !pending.mediaId) return;
    if (pending.snapshot === lastSavedSnapshotRef.current) {
      pendingSaveRef.current = null;
      if (mountedRef.current) setSaveStatus("Saved");
      return;
    }

    pendingSaveRef.current = null;
    saveInFlightRef.current = true;

    try {
      const response = await fetch(
        "/api/post_projects/update_post_project",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: projectId,
            mediaId: pending.mediaId,
            name: pending.name,
            imageDesign: pending.document,
          }),
          keepalive:
            !mountedRef.current ||
            (typeof document !== "undefined" &&
              document.visibilityState === "hidden"),
        },
      );

      if (!response.ok) {
        throw new AutosaveError(
          response.status === 401
            ? "Your session ended. Sign in again to save."
            : "Changes could not be saved.",
          response.status >= 500 ||
            response.status === 408 ||
            response.status === 429,
        );
      }

      lastSavedSnapshotRef.current = pending.snapshot;
      retryAttemptRef.current = 0;
      slidesRef.current = slidesRef.current.map((slide) =>
        slide.id === pending.mediaId
          ? { ...slide, imageDesign: pending.document }
          : slide,
      );
      if (mountedRef.current) {
        setSlides(slidesRef.current);
        setSaveStatus(pendingSaveRef.current ? "Saving…" : "Saved");
      }
    } catch (error) {
      // A newer snapshot supersedes a failed write; otherwise retain this one.
      if (!pendingSaveRef.current) pendingSaveRef.current = pending;
      const retryable =
        !(error instanceof AutosaveError) || error.retryable;

      if (mountedRef.current) {
        setSaveStatus(
          error instanceof AutosaveError
            ? error.message
            : "Offline. Changes will retry automatically.",
        );
      }

      if (retryable && mountedRef.current) {
        const retryDelay = Math.min(
          2_000 * 2 ** retryAttemptRef.current,
          AUTOSAVE_RETRY_MAX_MS,
        );
        retryAttemptRef.current += 1;
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(
          () => persistPendingRef.current(),
          retryDelay,
        );
      }
    } finally {
      saveInFlightRef.current = false;
      if (flushAfterFlightRef.current) {
        flushAfterFlightRef.current = false;
        persistPendingRef.current();
      }
    }
  }, [projectId]);

  useEffect(() => {
    persistPendingRef.current = () => void persistPending();
  }, [persistPending]);

  const flushCanvas = useCallback(
    async (canvas: FabricCanvas) => {
      const pending = buildProjectSave(canvas);
      if (!pending.mediaId) return;

      pendingSaveRef.current = pending;
      const started = Date.now();
      while (
        saveInFlightRef.current ||
        (pendingSaveRef.current &&
          pendingSaveRef.current.snapshot !== lastSavedSnapshotRef.current)
      ) {
        if (Date.now() - started > 20_000) {
          throw new AutosaveError("Changes could not be saved.", true);
        }
        if (saveInFlightRef.current) {
          await new Promise((resolve) => window.setTimeout(resolve, 40));
          continue;
        }
        await persistPending();
      }

      try {
        const saved = JSON.parse(lastSavedSnapshotRef.current || "{}") as {
          mediaId?: unknown;
        };
        if (saved.mediaId !== pending.mediaId) {
          throw new AutosaveError("Changes could not be saved.", true);
        }
      } catch (error) {
        if (error instanceof AutosaveError) throw error;
        throw new AutosaveError("Changes could not be saved.", true);
      }
    },
    [buildProjectSave, persistPending],
  );

  const scheduleAutosave = useCallback(
    (canvas: FabricCanvas, immediate = false) => {
      if (restoringRef.current || !initializedRef.current) return;

      const pending = buildProjectSave(canvas);
      if (
        pending.snapshot === lastSavedSnapshotRef.current &&
        !pendingSaveRef.current
      ) {
        setSaveStatus("Saved");
        return;
      }

      pendingSaveRef.current = pending;
      setSaveStatus("Saving…");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

      if (immediate) {
        persistPendingRef.current();
        return;
      }

      saveTimerRef.current = setTimeout(
        () => persistPendingRef.current(),
        AUTOSAVE_DELAY_MS,
      );
    },
    [buildProjectSave],
  );

  const commitHistory = useCallback(
    (canvas: FabricCanvas) => {
      if (restoringRef.current) return;
      const snapshot = serializedCanvas(canvas);
      const history = historyRef.current;
      if (history.entries[history.index] === snapshot) return;
      history.entries = history.entries.slice(0, history.index + 1);
      history.entries.push(snapshot);
      if (history.entries.length > 40) history.entries.shift();
      history.index = history.entries.length - 1;
      syncHistoryButtons();
      scheduleAutosave(canvas);
      setLayers([...canvas.getObjects()].reverse());
    },
    [scheduleAutosave, serializedCanvas, syncHistoryButtons],
  );

  const readSelection = useCallback((canvas: FabricCanvas) => {
    const object = canvas.getActiveObject() as EditorObject | undefined;
    if (!object) {
      setHasSelection(false);
      setSelection(DEFAULT_SELECTION);
      return;
    }
    setHasSelection(true);
    setSelection({
      fill: typeof object.fill === "string" ? object.fill : "#241914",
      fontFamily: object.fontFamily ?? "Inter",
      fontSize: Math.round(object.fontSize ?? 32),
      fontWeight: String(object.fontWeight ?? "400"),
      kind: object.type ?? "object",
      opacity: object.opacity ?? 1,
      textAlign: object.textAlign ?? "left",
    });
  }, []);

  useEffect(() => {
    let disposed = false;
    let instance: FabricCanvas | null = null;
    mountedRef.current = true;
    initializedRef.current = false;

    async function initialize() {
      if (!canvasElementRef.current) return;
      const fabric = await import("fabric");
      if (disposed || !canvasElementRef.current) return;
      fabricRef.current = fabric;
      instance = new fabric.Canvas(canvasElementRef.current, {
        width: CANVAS_PRESETS[0].width,
        height: CANVAS_PRESETS[0].height,
        backgroundColor: "#FFFFFF",
        preserveObjectStacking: true,
        selection: true,
      });
      canvasRef.current = instance;

      const sync = () => readSelection(instance!);
      const changed = () => {
        sync();
        commitHistory(instance!);
      };
      instance.on("selection:created", sync);
      instance.on("selection:updated", sync);
      instance.on("selection:cleared", sync);
      instance.on("object:modified", changed);
      instance.on("object:added", changed);
      instance.on("object:removed", changed);
      instance.on("text:changed", () => scheduleAutosave(instance!));

      if (initialMedia[0]?.imageDesign) {
        try {
          restoringRef.current = true;
          await instance.loadFromJSON(initialMedia[0].imageDesign);
          const width = Number(initialMedia[0].imageDesign.width) || 1080;
          const height = Number(initialMedia[0].imageDesign.height) || 1080;
          instance.setDimensions({ width, height });
          setCanvasSize({ width, height, label: "Custom size" });
        } catch {
          // Keep the usable blank canvas if a stored document cannot be loaded.
        } finally {
          restoringRef.current = false;
        }
      }

      instance.requestRenderAll();
      historyRef.current = {
        entries: [serializedCanvas(instance)],
        index: 0,
      };
      lastSavedSnapshotRef.current = buildProjectSave(instance).snapshot;
      initializedRef.current = true;
      setLayers([...instance.getObjects()].reverse());
      syncHistoryButtons();
      setSaveStatus("Saved");
      setReady(true);
    }

    void initialize();
    return () => {
      disposed = true;
      mountedRef.current = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (instance && initializedRef.current) {
        pendingSaveRef.current = buildProjectSave(instance);
        persistPendingRef.current();
      }
      canvasRef.current = null;
      if (instance) void instance.dispose();
    };
  }, [
    buildProjectSave,
    commitHistory,
    initialMedia,
    readSelection,
    scheduleAutosave,
    serializedCanvas,
    syncHistoryButtons,
  ]);

  useEffect(() => {
    const flush = () => {
      const canvas = canvasRef.current;
      if (canvas) scheduleAutosave(canvas, true);
    };
    const flushWhenHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("visibilitychange", flushWhenHidden);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", flushWhenHidden);
      window.removeEventListener("pagehide", flush);
    };
  }, [scheduleAutosave]);

  useEffect(() => {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (!stored) return;
    try {
      const storedQueue = JSON.parse(stored) as QueueItem[];
      queueMicrotask(() => setQueue(storedQueue));
    } catch {
      localStorage.removeItem(QUEUE_KEY);
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const bounds = stage.getBoundingClientRect();
      const horizontalRoom = Math.max(220, bounds.width - 96);
      const verticalRoom = Math.max(220, bounds.height - 96);
      setFitScale(
        Math.min(
          horizontalRoom / canvasSize.width,
          verticalRoom / canvasSize.height,
          0.82,
        ),
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [canvasSize]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timeout);
  }, [toast]);

  const decorateObject = useCallback((object: FabricObject) => {
    object.set({
      borderColor: "#256F68",
      cornerColor: "#FFFFFF",
      cornerSize: 14,
      cornerStrokeColor: "#256F68",
      cornerStyle: "circle",
      padding: 6,
      transparentCorners: false,
    });
    return object;
  }, []);

  const addText = useCallback(
    (style: "heading" | "subheading" | "body") => {
      const canvas = canvasRef.current;
      const fabric = fabricRef.current;
      if (!canvas || !fabric) return;
      const options = {
        heading: { text: "Your headline", size: 72, weight: 700, width: 720 },
        subheading: {
          text: "Add a useful supporting point",
          size: 42,
          weight: 600,
          width: 700,
        },
        body: {
          text: "Share a detail your clients can use.",
          size: 30,
          weight: 400,
          width: 660,
        },
      }[style];
      const object = decorateObject(
        new fabric.Textbox(options.text, {
          fill: "#241914",
          fontFamily: "Inter",
          fontSize: options.size,
          fontWeight: options.weight,
          left: 180,
          lineHeight: 1.12,
          top: 180 + canvas.getObjects().length * 28,
          width: options.width,
        }),
      );
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.requestRenderAll();
      readSelection(canvas);
    },
    [decorateObject, readSelection],
  );

  const addShape = useCallback(
    (shape: "square" | "circle" | "triangle" | "line") => {
      const canvas = canvasRef.current;
      const fabric = fabricRef.current;
      if (!canvas || !fabric) return;
      const common = {
        fill: "#F6B177",
        left: 390,
        top: 390,
        strokeWidth: 0,
      };
      let object: FabricObject;
      if (shape === "circle") {
        object = new fabric.Circle({ ...common, radius: 130 });
      } else if (shape === "triangle") {
        object = new fabric.Triangle({ ...common, width: 260, height: 240 });
      } else if (shape === "line") {
        object = new fabric.Line([300, 540, 780, 540], {
          stroke: "#241914",
          strokeWidth: 8,
        });
      } else {
        object = new fabric.Rect({
          ...common,
          width: 260,
          height: 260,
          rx: 24,
          ry: 24,
        });
      }
      decorateObject(object);
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.requestRenderAll();
      readSelection(canvas);
    },
    [decorateObject, readSelection],
  );

  const handleImageFiles = useCallback(
    async (files: FileList | File[]) => {
      const canvas = canvasRef.current;
      const fabric = fabricRef.current;
      if (!canvas || !fabric) return;
      const file = Array.from(files).find((item) =>
        item.type.startsWith("image/"),
      );
      if (!file) {
        setToast("Choose a PNG, JPG, or WebP image.");
        return;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const image = await fabric.FabricImage.fromURL(dataUrl);
      const maxWidth = canvas.width * 0.72;
      const maxHeight = canvas.height * 0.72;
      image.scale(
        Math.min(maxWidth / image.width, maxHeight / image.height, 1),
      );
      decorateObject(image);
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
      canvas.requestRenderAll();
      readSelection(canvas);
      setToast(`${file.name} added to your design.`);
    },
    [decorateObject, readSelection],
  );

  const updateActiveObject = useCallback(
    (values: Partial<EditorObject>) => {
      const canvas = canvasRef.current;
      const object = canvas?.getActiveObject() as EditorObject | undefined;
      if (!canvas || !object) return;
      object.set(values);
      object.setCoords();
      canvas.requestRenderAll();
      readSelection(canvas);
      commitHistory(canvas);
    },
    [commitHistory, readSelection],
  );

  const removeSelection = useCallback(() => {
    const canvas = canvasRef.current;
    const active = canvas?.getActiveObjects();
    if (!canvas || !active?.length) return;
    canvas.discardActiveObject();
    active.forEach((object) => canvas.remove(object));
    canvas.requestRenderAll();
    readSelection(canvas);
  }, [readSelection]);

  const duplicateSelection = useCallback(async () => {
    const canvas = canvasRef.current;
    const object = canvas?.getActiveObject();
    if (!canvas || !object) return;
    const clone = await object.clone();
    clone.set({
      left: (object.left ?? 0) + 24,
      top: (object.top ?? 0) + 24,
    });
    decorateObject(clone);
    canvas.add(clone);
    canvas.setActiveObject(clone);
    canvas.requestRenderAll();
  }, [decorateObject]);

  const changeStack = useCallback(
    (direction: "forward" | "backward") => {
      const canvas = canvasRef.current;
      const object = canvas?.getActiveObject();
      if (!canvas || !object) return;
      if (direction === "forward") canvas.bringObjectForward(object);
      else canvas.sendObjectBackwards(object);
      canvas.requestRenderAll();
      commitHistory(canvas);
    },
    [commitHistory],
  );

  const restoreHistory = useCallback(
    async (nextIndex: number) => {
      const canvas = canvasRef.current;
      const snapshot = historyRef.current.entries[nextIndex];
      if (!canvas || !snapshot) return;
      restoringRef.current = true;
      canvas.discardActiveObject();
      await canvas.loadFromJSON(snapshot);
      const parsed = JSON.parse(snapshot) as {
        width?: number;
        height?: number;
      };
      const width = parsed.width ?? canvas.width;
      const height = parsed.height ?? canvas.height;
      canvas.setDimensions({ width, height });
      setCanvasSize({ width, height, label: "Custom size" });
      canvas.getObjects().forEach(decorateObject);
      canvas.requestRenderAll();
      historyRef.current.index = nextIndex;
      restoringRef.current = false;
      syncHistoryButtons();
      readSelection(canvas);
      scheduleAutosave(canvas);
      setLayers([...canvas.getObjects()].reverse());
    },
    [decorateObject, readSelection, scheduleAutosave, syncHistoryButtons],
  );

  const undo = useCallback(() => {
    if (historyRef.current.index > 0) {
      void restoreHistory(historyRef.current.index - 1);
    }
  }, [restoreHistory]);

  const redo = useCallback(() => {
    if (historyRef.current.index < historyRef.current.entries.length - 1) {
      void restoreHistory(historyRef.current.index + 1);
    }
  }, [restoreHistory]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable='true']")) return;
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (modifier && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      } else if (modifier && event.key.toLowerCase() === "d") {
        event.preventDefault();
        void duplicateSelection();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        removeSelection();
      } else if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.key,
        )
      ) {
        const canvas = canvasRef.current;
        const object = canvas?.getActiveObject();
        if (object && canvas) {
          event.preventDefault();
          const step = event.shiftKey ? 10 : 1;
          if (event.key === "ArrowUp") {
            object.set("top", (object.top ?? 0) - step);
          }
          if (event.key === "ArrowDown") {
            object.set("top", (object.top ?? 0) + step);
          }
          if (event.key === "ArrowLeft") {
            object.set("left", (object.left ?? 0) - step);
          }
          if (event.key === "ArrowRight") {
            object.set("left", (object.left ?? 0) + step);
          }
          object.setCoords();
          canvas.requestRenderAll();
          commitHistory(canvas);
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          stepSlideRef.current(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          stepSlideRef.current(1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commitHistory, duplicateSelection, redo, removeSelection, undo]);

  const resizeCanvas = useCallback(
    (preset: CanvasSize) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setDimensions({ width: preset.width, height: preset.height });
      canvas.backgroundColor = "#FFFFFF";
      canvas.requestRenderAll();
      setCanvasSize(preset);
      setZoom(100);
      commitHistory(canvas);
    },
    [commitHistory],
  );

  const setBackground = useCallback(
    (color: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.backgroundColor = color;
      canvas.requestRenderAll();
      commitHistory(canvas);
    },
    [commitHistory],
  );

  const openJson = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setJsonText(JSON.stringify(JSON.parse(serializedCanvas(canvas)), null, 2));
    setJsonError("");
    setJsonOpen(true);
  }, [serializedCanvas]);

  const applyJson = useCallback(
    async (raw: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown> & {
          width?: number;
          height?: number;
        };
        restoringRef.current = true;
        canvas.discardActiveObject();
        await canvas.loadFromJSON(parsed);
        const width = Number(parsed.width) || 1080;
        const height = Number(parsed.height) || 1080;
        canvas.setDimensions({ width, height });
        canvas.getObjects().forEach(decorateObject);
        canvas.requestRenderAll();
        setCanvasSize({ width, height, label: "Imported design" });
        restoringRef.current = false;
        commitHistory(canvas);
        setJsonOpen(false);
        setToast("Fabric JSON applied to the canvas.");
      } catch {
        restoringRef.current = false;
        setJsonError(
          "That file is not valid Fabric.js JSON. Check the syntax and try again.",
        );
      }
    },
    [commitHistory, decorateObject],
  );

  const importJsonFile = useCallback(async (file: File) => {
    setJsonText(await file.text());
    setJsonError("");
    setJsonOpen(true);
  }, []);

  const exportImage = useCallback(
    (format: "png" | "jpeg") => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      const dataUrl = canvas.toDataURL({
        format,
        quality: 0.92,
        multiplier: 1,
      });
      downloadDataUrl(
        dataUrl,
        `${safeProjectName(projectName)}.${format === "jpeg" ? "jpg" : "png"}`,
      );
      setToast(`${format === "jpeg" ? "JPG" : "PNG"} downloaded.`);
    },
    [projectName],
  );

  const persistQueue = useCallback((items: QueueItem[]) => {
    setQueue(items);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  }, []);

  const loadSlideDesign = useCallback(
    async (canvas: FabricCanvas, design: ProjectDocument | null) => {
      restoringRef.current = true;
      try {
        canvas.discardActiveObject();
        if (design) {
          await canvas.loadFromJSON(design);
          const width = Number(design.width) || 1080;
          const height = Number(design.height) || 1080;
          canvas.setDimensions({ width, height });
          setCanvasSize({ width, height, label: "Custom size" });
        } else {
          const width = canvas.width || 1080;
          const height = canvas.height || 1080;
          canvas.clear();
          canvas.backgroundColor = "#FFFFFF";
          canvas.setDimensions({ width, height });
        }
        canvas.getObjects().forEach(decorateObject);
        canvas.requestRenderAll();
        historyRef.current = {
          entries: [serializedCanvas(canvas)],
          index: 0,
        };
        lastSavedSnapshotRef.current = buildProjectSave(canvas).snapshot;
        pendingSaveRef.current = null;
        setLayers([...canvas.getObjects()].reverse());
        syncHistoryButtons();
        readSelection(canvas);
      } finally {
        restoringRef.current = false;
      }
    },
    [
      buildProjectSave,
      decorateObject,
      readSelection,
      serializedCanvas,
      syncHistoryButtons,
    ],
  );

  const switchSlide = useCallback(
    async (nextId: string) => {
      if (slideBusyRef.current || nextId === activeMediaIdRef.current) return;
      const canvas = canvasRef.current;
      const next = slidesRef.current.find((slide) => slide.id === nextId);
      if (!canvas || !next) return;

      slideBusyRef.current = true;
      setSlideBusy(true);
      try {
        await flushCanvas(canvas);
        activeMediaIdRef.current = next.id;
        setActiveMediaId(next.id);
        await loadSlideDesign(canvas, next.imageDesign);
        setSaveStatus("Saved");
      } catch (error) {
        setSaveStatus(
          error instanceof AutosaveError
            ? error.message
            : "Unable to switch slides right now.",
        );
      } finally {
        setSlideBusy(false);
        slideBusyRef.current = false;
      }
    },
    [flushCanvas, loadSlideDesign],
  );

  const stepSlide = useCallback(
    (direction: -1 | 1) => {
      const index = slidesRef.current.findIndex(
        (slide) => slide.id === activeMediaIdRef.current,
      );
      const next = slidesRef.current[index + direction];
      if (!next) return;
      void switchSlide(next.id);
    },
    [switchSlide],
  );
  stepSlideRef.current = stepSlide;

  const addSlide = useCallback(async () => {
    if (slideBusyRef.current || slidesRef.current.length >= MAX_SLIDES) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    slideBusyRef.current = true;
    setSlideBusy(true);
    try {
      await flushCanvas(canvas);
      const response = await fetch(
        "/api/post_projects/add_post_project_media",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        },
      );
      const result = (await response.json()) as {
        media?: EditorMediaSlide;
        error?: string;
      };
      if (!response.ok || !result.media) {
        throw new Error(result.error ?? "Unable to add a slide.");
      }

      const nextSlides = [...slidesRef.current, result.media];
      slidesRef.current = nextSlides;
      setSlides(nextSlides);
      activeMediaIdRef.current = result.media.id;
      setActiveMediaId(result.media.id);
      await loadSlideDesign(canvas, null);
      setSaveStatus("Saved");
      setToast("Added a slide.");
    } catch (error) {
      setSaveStatus(
        error instanceof Error
          ? error.message
          : "Unable to add a slide right now.",
      );
    } finally {
      setSlideBusy(false);
      slideBusyRef.current = false;
    }
  }, [flushCanvas, loadSlideDesign, projectId]);

  const deleteSlide = useCallback(async () => {
    if (slideBusyRef.current || slidesRef.current.length <= 1) return;
    const canvas = canvasRef.current;
    const mediaId = activeMediaIdRef.current;
    if (!canvas || !mediaId) return;

    slideBusyRef.current = true;
    setSlideBusy(true);
    try {
      await flushCanvas(canvas);
      const response = await fetch(
        "/api/post_projects/delete_post_project_media",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, mediaId }),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Unable to delete that slide.");
      }

      const remaining = slidesRef.current.filter(
        (slide) => slide.id !== mediaId,
      );
      const next =
        remaining.at(
          Math.max(
            0,
            slidesRef.current.findIndex((slide) => slide.id === mediaId) - 1,
          ),
        ) ?? remaining[0];
      if (!next) return;

      slidesRef.current = remaining;
      setSlides(remaining);
      activeMediaIdRef.current = next.id;
      setActiveMediaId(next.id);
      await loadSlideDesign(canvas, next.imageDesign);
      setSaveStatus("Saved");
      setToast("Slide deleted.");
    } catch (error) {
      setSaveStatus(
        error instanceof Error
          ? error.message
          : "Unable to delete that slide right now.",
      );
    } finally {
      setSlideBusy(false);
      slideBusyRef.current = false;
    }
  }, [flushCanvas, loadSlideDesign, projectId]);

  const addQueueItem = useCallback(
    (
      status: QueueItem["status"],
      scheduledAt: string,
      platforms: string[],
    ) => {
      const item: QueueItem = {
        id: crypto.randomUUID(),
        name: projectName,
        platforms,
        scheduledAt,
        status,
      };
      persistQueue([...queue, item]);
      setScheduleOpen(false);
      setToast(
        status === "next"
          ? "Added as the next post in your schedule."
          : status === "scheduled"
            ? "Post scheduled."
            : "Added to your content queue.",
      );
    },
    [persistQueue, projectName, queue],
  );

  const scaled = fitScale * (zoom / 100);
  const canvasDisplayWidth = canvasSize.width * scaled;
  const canvasDisplayHeight = canvasSize.height * scaled;
  const activeSlideIndex = Math.max(
    0,
    slides.findIndex((slide) => slide.id === activeMediaId),
  );

  function chooseTool(tool: ToolId) {
    if (activeTool === tool && panelOpen) setPanelOpen(false);
    else {
      setActiveTool(tool);
      setPanelOpen(true);
    }
  }

  return (
    <main className="flex h-dvh min-h-[620px] flex-col overflow-hidden bg-pp-mist text-pp-ink">
      <header className="z-30 flex h-16 shrink-0 items-center gap-2 border-b border-pp-sand/70 bg-pp-white px-3 sm:gap-3 sm:px-4">
        <Link
          href="/dashboard/social-media/social-editor"
          aria-label="Back to templates"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-pp-ink transition-colors hover:bg-pp-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
        >
          <EditorIcon name="arrow-left" />
        </Link>
        <div className="hidden items-center gap-2 border-r border-pp-sand/70 pr-4 sm:flex">
          <Image
            src="/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full"
          />
          <span className="font-display text-sm font-bold tracking-tight">
            postpooch
          </span>
        </div>
        <div className="min-w-0 flex-1 sm:max-w-[19rem]">
          <label htmlFor="project-name" className="sr-only">
            Project name
          </label>
          <input
            id="project-name"
            value={projectName}
            onChange={(event) => {
              const nextName = event.target.value;
              projectNameRef.current = nextName;
              setProjectName(nextName);
              if (canvasRef.current) scheduleAutosave(canvasRef.current);
            }}
            onBlur={() =>
              canvasRef.current && scheduleAutosave(canvasRef.current, true)
            }
            className="w-full truncate rounded-control bg-transparent px-2 py-1 text-sm font-semibold outline-none transition-colors hover:bg-pp-mist focus:bg-pp-mist focus:ring-2 focus:ring-pp-teal/30"
          />
          <p className="hidden px-2 text-[11px] leading-4 text-pp-stone sm:block">
            {saveStatus}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-0.5 md:flex">
            <IconButton
              label="Undo"
              icon="undo"
              disabled={!historyState.canUndo}
              onClick={undo}
            />
            <IconButton
              label="Redo"
              icon="redo"
              disabled={!historyState.canRedo}
              onClick={redo}
            />
          </div>
          <button
            type="button"
            onClick={openJson}
            className="hidden h-10 items-center gap-2 rounded-pill px-3 text-sm font-medium text-pp-stone transition-colors hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal lg:flex"
          >
            <EditorIcon name="file" className="size-[18px]" />
            Project JSON
          </button>
          <button
            type="button"
            onClick={() => setScheduleOpen(true)}
            className="flex h-10 items-center gap-2 rounded-pill border border-pp-sand bg-pp-white px-3 text-sm font-semibold shadow-sm transition-[background-color,transform] hover:bg-pp-cream active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal sm:px-4"
          >
            <EditorIcon name="calendar" className="size-[18px]" />
            <span className="hidden sm:inline">Schedule</span>
            {queue.length ? (
              <span className="rounded-full bg-pp-mist px-1.5 text-xs text-pp-stone">
                {queue.length}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            className="flex h-10 items-center gap-2 rounded-pill bg-pp-teal px-3.5 text-sm font-semibold text-white shadow-sm transition-[background-color,transform] hover:bg-pp-teal-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal sm:px-5"
          >
            <EditorIcon name="publish" className="size-[18px]" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <nav
          className="z-20 flex w-[68px] shrink-0 flex-col items-center gap-1 border-r border-pp-sand/70 bg-pp-white px-1.5 py-3"
          aria-label="Editor tools"
        >
          {TOOLS.map((tool) => {
            const active = activeTool === tool.id && panelOpen;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => chooseTool(tool.id)}
                aria-pressed={active}
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pp-teal ${
                  active
                    ? "bg-pp-cream text-pp-teal-dark"
                    : "text-pp-stone hover:bg-pp-mist hover:text-pp-ink"
                }`}
              >
                <EditorIcon name={tool.icon} className="size-5" />
                {tool.label}
              </button>
            );
          })}
          <div className="mt-auto hidden flex-col gap-1 md:flex">
            <IconButton
              label="Undo"
              icon="undo"
              disabled={!historyState.canUndo}
              onClick={undo}
            />
            <IconButton
              label="Redo"
              icon="redo"
              disabled={!historyState.canRedo}
              onClick={redo}
            />
          </div>
        </nav>

        {panelOpen ? (
          <aside className="absolute inset-y-0 left-[68px] z-20 w-[min(292px,calc(100vw-68px))] shrink-0 overflow-y-auto border-r border-pp-sand/70 bg-pp-white p-5 shadow-[8px_0_24px_rgba(36,25,20,0.08)] md:static md:z-10 md:w-[292px] md:shadow-[8px_0_24px_rgba(36,25,20,0.035)]">
            <EditorPanel
              activeTool={activeTool}
              canvasSize={canvasSize}
              layers={layers}
              onAddShape={addShape}
              onAddText={addText}
              onBackground={setBackground}
              onClose={() => setPanelOpen(false)}
              onImportJson={() => jsonInputRef.current?.click()}
              onOpenJson={openJson}
              onResize={resizeCanvas}
              onSelectLayer={(object) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                canvas.setActiveObject(object);
                canvas.requestRenderAll();
                readSelection(canvas);
              }}
              onUpload={() => uploadInputRef.current?.click()}
              onUploadFiles={(files) => void handleImageFiles(files)}
              onVisibility={(object) => {
                object.set("visible", !object.visible);
                canvasRef.current?.requestRenderAll();
                if (canvasRef.current) commitHistory(canvasRef.current);
              }}
            />
          </aside>
        ) : null}

        <section className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex h-[52px] shrink-0 items-center gap-1 overflow-x-auto border-b border-pp-sand/60 bg-pp-white px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4">
            {hasSelection ? (
              <>
                <label className="flex h-9 shrink-0 items-center gap-2 rounded-control px-2 text-xs font-medium text-pp-stone hover:bg-pp-mist">
                  <span className="relative size-5 overflow-hidden rounded-full ring-1 ring-pp-sand">
                    <input
                      type="color"
                      value={selection.fill}
                      onChange={(event) =>
                        updateActiveObject({ fill: event.target.value })
                      }
                      className="absolute -inset-2 size-10 cursor-pointer border-0"
                      aria-label="Object color"
                    />
                  </span>
                  Color
                </label>
                {selection.kind.includes("text") ? (
                  <>
                    <select
                      value={selection.fontFamily}
                      onChange={(event) =>
                        updateActiveObject({ fontFamily: event.target.value })
                      }
                      aria-label="Font family"
                      className="h-9 shrink-0 rounded-control border-0 bg-pp-mist px-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-pp-teal/30"
                    >
                      <option>Inter</option>
                      <option>Comfortaa</option>
                      <option>Georgia</option>
                    </select>
                    <label className="flex h-9 shrink-0 items-center rounded-control bg-pp-mist px-2">
                      <span className="sr-only">Font size</span>
                      <input
                        type="number"
                        min="8"
                        max="300"
                        value={selection.fontSize}
                        onChange={(event) =>
                          updateActiveObject({
                            fontSize: Number(event.target.value),
                          })
                        }
                        className="w-12 bg-transparent text-center text-xs font-medium outline-none"
                      />
                    </label>
                    <button
                      type="button"
                      aria-label="Toggle bold"
                      onClick={() =>
                        updateActiveObject({
                          fontWeight:
                            selection.fontWeight === "700" ? "400" : "700",
                        })
                      }
                      className={`flex size-9 shrink-0 items-center justify-center rounded-control text-sm font-bold ${
                        selection.fontWeight === "700"
                          ? "bg-pp-ink text-white"
                          : "hover:bg-pp-mist"
                      }`}
                    >
                      B
                    </button>
                  </>
                ) : null}
                <span className="mx-1 h-5 w-px shrink-0 bg-pp-sand" />
                <ToolbarButton
                  label="Duplicate"
                  icon="duplicate"
                  onClick={() => void duplicateSelection()}
                />
                <ToolbarButton
                  label="Forward"
                  icon="layers"
                  onClick={() => changeStack("forward")}
                />
                <ToolbarButton
                  label="Delete"
                  icon="trash"
                  onClick={removeSelection}
                  danger
                />
                <label className="ml-auto hidden shrink-0 items-center gap-2 text-xs text-pp-stone xl:flex">
                  Opacity
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round(selection.opacity * 100)}
                    onChange={(event) =>
                      updateActiveObject({
                        opacity: Number(event.target.value) / 100,
                      })
                    }
                    className="pp-range w-24"
                  />
                </label>
              </>
            ) : (
              <>
                <span className="shrink-0 text-xs font-medium text-pp-stone">
                  Canvas
                </span>
                <div className="flex items-center gap-1.5 pl-1">
                  {BRAND_COLORS.slice(1, 7).map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Set canvas background to ${color}`}
                      onClick={() => setBackground(color)}
                      className="size-6 shrink-0 rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="ml-auto hidden text-xs text-pp-stone sm:block">
                  Select an object to edit it
                </span>
              </>
            )}
          </div>

          <div className="relative flex min-h-0 min-w-0 flex-1">
            <MediaPager
              index={activeSlideIndex}
              count={slides.length}
              disabled={slideBusy || !ready}
              onPrev={() => stepSlide(-1)}
              onNext={() => stepSlide(1)}
            />
            <div
              ref={stageRef}
              className="pp-editor-stage relative flex min-h-0 flex-1 items-start justify-center overflow-auto bg-[#e9e7e4] p-12"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void handleImageFiles(event.dataTransfer.files);
              }}
            >
              {!ready ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#e9e7e4]">
                  <div className="flex items-center gap-3 rounded-pill bg-white px-4 py-2.5 text-sm font-medium text-pp-stone shadow-card-sm">
                    <span className="size-2 animate-pulse rounded-full bg-pp-teal" />
                    Preparing your canvas
                  </div>
                </div>
              ) : null}
              <div
                className="relative shrink-0 shadow-[0_20px_55px_rgba(36,25,20,0.18)]"
                style={{
                  width: canvasDisplayWidth,
                  height: canvasDisplayHeight,
                }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ transform: `scale(${scaled})` }}
                >
                  <canvas ref={canvasElementRef} />
                </div>
              </div>
            </div>
          </div>

          <footer className="flex h-12 shrink-0 items-center gap-2 border-t border-pp-sand/70 bg-pp-white px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-1">
              <p
                className="shrink-0 px-1 text-xs font-medium tabular-nums text-pp-stone"
                aria-live="polite"
              >
                {slides.length === 1
                  ? "1 slide"
                  : `${activeSlideIndex + 1} of ${slides.length}`}
              </p>
              <IconButton
                label="Add slide"
                icon="plus"
                disabled={slideBusy || slides.length >= MAX_SLIDES}
                onClick={() => void addSlide()}
              />
              {slides.length > 1 ? (
                <IconButton
                  label="Delete slide"
                  icon="trash"
                  disabled={slideBusy}
                  onClick={() => void deleteSlide()}
                />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="hidden rounded-control px-2 py-1 text-xs font-medium text-pp-stone hover:bg-pp-mist hover:text-pp-ink sm:block"
            >
              {canvasSize.width} × {canvasSize.height}
            </button>
            <div className="ml-auto flex items-center gap-1.5">
              <IconButton
                label="Zoom out"
                icon="minus"
                onClick={() =>
                  setZoom((value) => Math.max(35, value - 10))
                }
              />
              <input
                aria-label="Canvas zoom"
                type="range"
                min="35"
                max="180"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="pp-range hidden w-24 sm:block"
              />
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="w-12 rounded-control py-1 text-xs font-medium tabular-nums text-pp-stone hover:bg-pp-mist hover:text-pp-ink"
              >
                {zoom}%
              </button>
              <IconButton
                label="Zoom in"
                icon="plus"
                onClick={() =>
                  setZoom((value) => Math.min(180, value + 10))
                }
              />
            </div>
          </footer>
        </section>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) =>
          event.target.files && void handleImageFiles(event.target.files)
        }
      />
      <input
        ref={jsonInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) =>
          event.target.files?.[0] &&
          void importJsonFile(event.target.files[0])
        }
      />

      {jsonOpen ? (
        <JsonDialog
          value={jsonText}
          error={jsonError}
          onChange={setJsonText}
          onClose={() => setJsonOpen(false)}
          onApply={() => void applyJson(jsonText)}
          onDownload={() =>
            downloadText(jsonText, `${safeProjectName(projectName)}.json`)
          }
        />
      ) : null}
      {publishOpen ? (
        <PublishDialog
          onClose={() => setPublishOpen(false)}
          onDownload={exportImage}
          onPublish={(platforms) => {
            setPublishOpen(false);
            setToast(`Ready to publish to ${platforms.join(", ")}.`);
          }}
        />
      ) : null}
      {scheduleOpen ? (
        <ScheduleDialog
          queue={queue}
          onAdd={addQueueItem}
          onClose={() => setScheduleOpen(false)}
          onRemove={(id) =>
            persistQueue(queue.filter((item) => item.id !== id))
          }
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-16 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-pill bg-pp-ink px-4 py-2.5 text-sm font-medium text-white shadow-card-lg"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-pp-teal">
            <EditorIcon name="check" className="size-3.5" />
          </span>
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: EditorIconName;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 shrink-0 items-center justify-center rounded-control text-pp-stone transition-colors hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pp-teal disabled:cursor-not-allowed disabled:opacity-30"
    >
      <EditorIcon name={icon} className="size-[18px]" />
    </button>
  );
}

function ToolbarButton({
  label,
  icon,
  onClick,
  danger = false,
}: {
  label: string;
  icon: EditorIconName;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-control px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pp-teal ${
        danger
          ? "text-pp-coral hover:bg-pp-coral/10"
          : "text-pp-stone hover:bg-pp-mist hover:text-pp-ink"
      }`}
    >
      <EditorIcon name={icon} className="size-4" />
      <span className="hidden 2xl:inline">{label}</span>
    </button>
  );
}
