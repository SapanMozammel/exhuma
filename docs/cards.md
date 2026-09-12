# Cards Deep Dive (@exhuma/cards)

`@exhuma/cards` delivers tactile, scroll-reactive card components.

---

## `<StackingCards>`

Renders stacked cards that pin at sticky thresholds and decrease in scale as more cards layer above them.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `topStart` | `number` | `80` | Initial sticky offset from top of viewport in px. |
| `topIncrement` | `number` | `20` | Additional offset added per card level. |
| `minScale` | `number` | `0.9` | Smallest scale factor reached by underlying cards. |
| `scaleThreshold` | `number` | `400` | Scroll distance in px over which scaling occurs. |
| `className` | `string` | `''` | Wrapper class name. |

---

## `<HorizontalScroller>`

Translates natural window vertical scroll into a smooth horizontal rail motion.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `speed` | `number` | `0.8` | Speed factor for horizontal translation. |
| `className` | `string` | `''` | Outer section class name. |
| `trackClassName` | `string` | `''` | Inner horizontal rail track class name. |
