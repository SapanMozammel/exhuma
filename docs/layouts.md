# Layout Engines Deep Dive (@exhuma/layouts)

`@exhuma/layouts` provides high-performance masonry and responsive auto-grid primitives.

---

## `<CssMasonry>`

Zero-dependency CSS column-count masonry layout. Automatically handles `break-inside: avoid` so cards never tear across columns.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `number \| { sm?: number; md?: number; lg?: number; xl?: number }` | `3` | Number of columns or responsive column map. |
| `gap` | `string \| number` | `'1.5rem'` | Column and row gap. |

---

## `<AutoGrid>`

Smart CSS grid wrapper utilizing `repeat(auto-fit, minmax(minItemWidth, 1fr))`.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `minItemWidth` | `number \| string` | `280` | Minimum column width before wrapping to the next line. |
| `gap` | `string \| number` | `'1.5rem'` | CSS gap token between cells. |

---

## `<MacyMasonry>`

Balanced masonry layout that distributes children across columns using balanced height calculations with zero visual flicker.
