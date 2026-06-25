
## Unit Converter

This project is a simple **Unit Converter** built with plain HTML, CSS, and JavaScript. It provides three separate pages for converting:

- Length
- Weight
- Temperature

The UI is minimal and focuses on practicing DOM manipulation, basic layout, and conversion logic in JavaScript.

---

### Features

- Separate pages for each type of conversion:
  - `length.html`
  - `weight.html`
  - `temperature.html`
- Shared navigation bar to switch between pages.
- Responsive-ish centered layout using simple CSS.
- Conversions are done client-side with JavaScript (no backend).

---

### Project Structure

```text
node/unit-converter/
  ├── html/
  │   ├── length.html
  │   ├── weight.html
  │   └── temperature.html
  ├── style/
  │   └── style.css
  ├── index.js
  └── README.md
```

- **html/** – Contains the three converter pages.
- **style/style.css** – Shared styles for layout, navigation, and form elements.
- **index.js** – Shared JavaScript containing all conversion logic for length, weight, and temperature.

---

### How to Run

This is a static frontend project. You can run it in any of the following ways:

#### 1. Open directly in the browser

1. Navigate to the project folder:

   ```bash
   cd node/unit-converter
   ```

2. Open one of the HTML files in your browser, for example:
   - `html/length.html`
   - `html/weight.html`
   - `html/temperature.html`

You can double-click the file in your file explorer or use "Open with Live Server" if you are using VS Code.

#### 2. Serve with a simple static server (optional)

You can also use any static HTTP server (e.g. `live-server`, `http-server`, or a basic Node/Express setup) to serve the `html/` directory. This is optional and mainly useful if you prefer not to open files via the `file://` protocol.

---

### Length Converter (`length.html`)

- Supports conversions between:
  - meters, kilometers, centimeters, inches, feet, yards, miles
- Internally converts everything **to meters**, then from meters to the target unit.
- Uses a `<button id="convert">` that triggers the conversion when clicked.

---

### Weight Converter (`weight.html`)

- Supports conversions between:
  - kilograms, grams, pounds, ounces, tons
- Internally converts everything **to kilograms**, then from kilograms to the target unit.
- Uses the same DOM IDs as the length page so it can share logic in `index.js`.

---

### Temperature Converter (`temperature.html`)

- Supports conversions between:
  - Celsius, Fahrenheit, Kelvin
- Internally converts from the source unit to **Celsius**, then from Celsius to the target unit.
- Uses helper functions `toCelsius` and `fromCelsius` inside `index.js`.

---

### JavaScript Logic (`index.js`)

- Grabs shared DOM elements by ID (`length`, `from`, `to`, `convert`, `result-value`, `result-unit`).
- Detects the current page type by inspecting the first `<option>` of the `from` `<select>`.
- Registers the appropriate `click` handler:
  - `convertLength` for length
  - `convertWeight` for weight
  - `convertTemperature` for temperature
- Formats numeric output to keep it readable (fixed decimals / precision based on magnitude).

---

## Reference

- Original project idea from: https://roadmap.sh/projects/unit-converter
