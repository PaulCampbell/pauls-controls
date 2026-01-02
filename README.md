# pauls-controls

Simple web components for when you&apos;re bored of wrangling frameworks.

## Components

- `<auto-suggest>`: Text input with a suggestions dropdown.
- `<bounding-boxes>`: Renders an image with YOLO-format bounding boxes (and optional label editing).
- `<upload-input>`: Image upload input with drag-and-drop support and a square preview.

## Example

Run a static server and open `example.html` to see all components in action.

```
npm run dev
```

and go to http://127.0.0.1:8080/example.html

## Getting Started

```bash
npm install
npm run build
npm run dev
```

1. Install dependencies (only needed for building/minifying).
2. Build the components into `dist/`.
3. Run a static server and open `example.html` to see the components in action.


## Usage

Build outputs are ES modules in `dist/`. Import only the component(s) you need.

### `<auto-suggest>`

```html
<script type="module" src="./dist/auto-suggest.js"></script>

<auto-suggest
  items='["Apple", "Banana", "Cherry"]'
></auto-suggest>

<script type="module">
  const autosuggest = document.querySelector('auto-suggest');
  autosuggest?.addEventListener('selectionchange', (event) => {
    console.log('Selection changed:', event.detail.selection);
  });
</script>
```

### `<bounding-boxes>`

```html
<script type="module" src="./dist/bounding-boxes.js"></script>

<bounding-boxes
  src="/images/sample.jpg"
  boxes='[
    { "xPosition": 0.5, "yPosition": 0.5, "width": 0.3, "height": 0.2, "label": "bee" }
  ]'
  autosuggestItems='["Bee", "Cat", "Dog"]'
></bounding-boxes>
```

- `src`: Path to the image that should be rendered.
- `boxes`: JSON array of YOLO-format boxes. Each box supports:
  - `xPosition`, `yPosition`: Box centre (0–1).
  - `width`, `height`: Size (0–1).
  - `label`: Optional string rendered above the box.
- `autosuggestItems`: Optional JSON array of strings used to power the type-ahead dropdown when editing labels.

### Events

- `boxeschange`: Fired whenever the internal box collection changes. The event’s `detail.boxes` array reflects the latest component state.

```js
const viewer = document.querySelector('bounding-boxes');
viewer.addEventListener('boxeschange', (event) => {
  console.log('Updated boxes:', event.detail.boxes);
});
```

### `<upload-input>`

```html
<script type="module" src="./dist/upload-input.js"></script>

<upload-input></upload-input>

<script type="module">
  const uploader = document.querySelector('upload-input');
  uploader?.addEventListener('image-loaded', (event) => {
    console.log('Image loaded:', event.detail.file.name);
    // event.detail.dataUrl is a data: URL for previewing
  });
</script>
```
