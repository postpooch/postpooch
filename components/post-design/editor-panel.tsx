import type { FabricObject } from "fabric";
import { EditorIcon, type EditorIconName } from "./editor-icons";
import {
  BRAND_COLORS,
  CANVAS_PRESETS,
  type CanvasSize,
  type EditorObject,
  type ToolId,
} from "./editor-types";

type Shape = "square" | "circle" | "triangle" | "line";

type EditorPanelProps = {
  activeTool: ToolId;
  canvasSize: CanvasSize;
  layers: FabricObject[];
  onAddShape: (shape: Shape) => void;
  onAddText: (style: "heading" | "subheading" | "body") => void;
  onBackground: (color: string) => void;
  onClose: () => void;
  onImportJson: () => void;
  onOpenJson: () => void;
  onResize: (size: CanvasSize) => void;
  onSelectLayer: (object: FabricObject) => void;
  onUpload: () => void;
  onUploadFiles: (files: FileList) => void;
  onVisibility: (object: FabricObject) => void;
};

export function EditorPanel(props: EditorPanelProps) {
  const titles: Record<ToolId, string> = {
    design: "Design",
    uploads: "Uploads",
    text: "Text",
    elements: "Elements",
    brand: "Brand kit",
    layers: "Layers",
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-5 flex items-center">
        <h2 className="text-lg font-semibold tracking-tight">
          {titles[props.activeTool]}
        </h2>
        <button
          type="button"
          aria-label="Close panel"
          onClick={props.onClose}
          className="ml-auto flex size-8 items-center justify-center rounded-full text-pp-stone hover:bg-pp-mist hover:text-pp-ink"
        >
          <EditorIcon name="close" className="size-4" />
        </button>
      </div>

      {props.activeTool === "design" ? (
        <div className="space-y-7">
          <section>
            <PanelLabel>Post size</PanelLabel>
            <div className="space-y-2">
              {CANVAS_PRESETS.map((preset) => {
                const active =
                  preset.width === props.canvasSize.width &&
                  preset.height === props.canvasSize.height;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => props.onResize(preset)}
                    className={`flex w-full items-center rounded-xl border p-3 text-left transition-colors ${
                      active
                        ? "border-pp-teal bg-pp-teal/5"
                        : "border-pp-sand/80 hover:bg-pp-mist"
                    }`}
                  >
                    <span
                      className={`mr-3 block border-2 ${
                        active ? "border-pp-teal" : "border-pp-stone/50"
                      }`}
                      style={{
                        width: 28,
                        height: Math.max(
                          18,
                          Math.min(38, (28 * preset.height) / preset.width),
                        ),
                      }}
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        {preset.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-pp-stone">
                        {preset.width} × {preset.height}
                      </span>
                    </span>
                    {active ? (
                      <EditorIcon
                        name="check"
                        className="ml-auto size-4 text-pp-teal"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
          <section>
            <PanelLabel>Project file</PanelLabel>
            <div className="grid grid-cols-2 gap-2">
              <PanelButton
                icon="file"
                label="Edit JSON"
                onClick={props.onOpenJson}
              />
              <PanelButton
                icon="upload"
                label="Import"
                onClick={props.onImportJson}
              />
            </div>
          </section>
        </div>
      ) : null}

      {props.activeTool === "uploads" ? (
        <div className="space-y-5">
          <button
            type="button"
            onClick={props.onUpload}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              props.onUploadFiles(event.dataTransfer.files);
            }}
            className="flex w-full flex-col items-center rounded-card border border-dashed border-pp-sand bg-pp-cream/60 px-5 py-9 text-center transition-colors hover:border-pp-teal hover:bg-pp-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-pp-teal shadow-card-sm">
              <EditorIcon name="upload" />
            </span>
            <span className="mt-3 text-sm font-semibold">Upload an image</span>
            <span className="mt-1 text-xs leading-5 text-pp-stone">
              PNG, JPG, or WebP. You can also drop it on the canvas.
            </span>
          </button>
          <div className="rounded-card bg-pp-mist p-4">
            <p className="text-sm font-semibold">Keep listing photos clear</p>
            <p className="mt-1.5 text-xs leading-5 text-pp-stone">
              Use the property as visual evidence. Place copy where it won’t
              cover a home’s key details.
            </p>
          </div>
        </div>
      ) : null}

      {props.activeTool === "text" ? (
        <div className="space-y-3">
          <TextChoice
            sample="Add a heading"
            detail="Strong, clear hook"
            className="text-2xl font-bold tracking-tight"
            onClick={() => props.onAddText("heading")}
          />
          <TextChoice
            sample="Add a subheading"
            detail="One supporting thought"
            className="text-lg font-semibold"
            onClick={() => props.onAddText("subheading")}
          />
          <TextChoice
            sample="Add body text"
            detail="Useful detail or context"
            className="text-sm"
            onClick={() => props.onAddText("body")}
          />
        </div>
      ) : null}

      {props.activeTool === "elements" ? (
        <div className="space-y-6">
          <section>
            <PanelLabel>Shapes</PanelLabel>
            <div className="grid grid-cols-2 gap-2">
              {(["square", "circle", "triangle", "line"] as const).map(
                (shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => props.onAddShape(shape)}
                    className="flex aspect-[1.35] flex-col items-center justify-center gap-2 rounded-card border border-pp-sand/80 text-xs font-medium capitalize transition-[background-color,transform] hover:-translate-y-px hover:bg-pp-mist"
                  >
                    <EditorIcon
                      name={shape}
                      className="size-7 text-pp-teal"
                    />
                    {shape}
                  </button>
                ),
              )}
            </div>
          </section>
          <p className="text-xs leading-5 text-pp-stone">
            Tip: hold Shift while resizing to preserve an element’s
            proportions.
          </p>
        </div>
      ) : null}

      {props.activeTool === "brand" ? (
        <div className="space-y-7">
          <section>
            <PanelLabel>Postpooch palette</PanelLabel>
            <div className="grid grid-cols-4 gap-3">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => props.onBackground(color)}
                  aria-label={`Use ${color} as background`}
                  className="aspect-square rounded-xl ring-1 ring-inset ring-black/10 transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>
          <section>
            <PanelLabel>Type pairing</PanelLabel>
            <div className="rounded-card border border-pp-sand/80 p-4">
              <p className="font-display text-xl font-bold">Comfortaa</p>
              <p className="mt-1 text-xs text-pp-stone">
                Short, warm brand moments
              </p>
              <div className="my-4 h-px bg-pp-sand/70" />
              <p className="text-base font-semibold">Inter</p>
              <p className="mt-1 text-xs text-pp-stone">
                Everything that needs to work hard
              </p>
            </div>
          </section>
        </div>
      ) : null}

      {props.activeTool === "layers" ? (
        <div className="space-y-2">
          {props.layers.length ? (
            props.layers.map((object, index) => (
              <div
                key={`${object.type}-${index}`}
                className="group flex items-center gap-2 rounded-xl border border-transparent p-2 hover:border-pp-sand hover:bg-pp-mist"
              >
                <button
                  type="button"
                  onClick={() => props.onVisibility(object)}
                  aria-label={object.visible ? "Hide layer" : "Show layer"}
                  className={`flex size-8 items-center justify-center rounded-control ${
                    object.visible ? "text-pp-stone" : "text-pp-sand"
                  }`}
                >
                  <EditorIcon name="eye" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => props.onSelectLayer(object)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm font-medium capitalize">
                    {object.type === "textbox"
                      ? (object as EditorObject).text || "Text"
                      : `${object.type ?? "Object"} ${props.layers.length - index}`}
                  </span>
                  <span className="block text-xs text-pp-stone">
                    Layer {props.layers.length - index}
                  </span>
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-card bg-pp-mist p-5 text-center">
              <p className="text-sm font-semibold">No layers yet</p>
              <p className="mt-1 text-xs leading-5 text-pp-stone">
                Add text, an image, or a shape to get started.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-pp-stone">
      {children}
    </h3>
  );
}

function PanelButton({
  icon,
  label,
  onClick,
}: {
  icon: EditorIconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-card border border-pp-sand/80 text-xs font-semibold transition-colors hover:bg-pp-mist"
    >
      <EditorIcon name={icon} className="size-5 text-pp-teal" />
      {label}
    </button>
  );
}

function TextChoice({
  sample,
  detail,
  className,
  onClick,
}: {
  sample: string;
  detail: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-card border border-pp-sand/80 p-4 text-left transition-colors hover:bg-pp-mist"
    >
      <span className={`block ${className}`}>{sample}</span>
      <span className="mt-1 block text-xs text-pp-stone">{detail}</span>
    </button>
  );
}
