
const valueInput = document.getElementById("length");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertButton = document.getElementById("convert");
const resultValueSpan = document.getElementById("result-value");
const resultUnitSpan = document.getElementById("result-unit");

// Conversion factors to meters (for length)
const lengthToMeter = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

// Conversion factors to kilograms (for weight)
const weightToKilogram = {
  kilogram: 1,
  gram: 0.001,
  pound: 0.45359237,
  ounce: 0.0283495231,
  ton: 1000,
};

const formatNumber = (value) => {
  if (Number.isNaN(value)) return "";
  if (Math.abs(value) >= 1) return value.toFixed(2);
  return value.toPrecision(3);
};

const convertLength = () => {
  const rawValue = parseFloat(valueInput.value);
  const fromUnit = fromSelect.value;
  const toUnit = toSelect.value;

  if (Number.isNaN(rawValue)) {
    resultValueSpan.textContent = "";
    resultUnitSpan.textContent = "";
    return;
  }

  const fromFactor = lengthToMeter[fromUnit];
  const toFactor = lengthToMeter[toUnit];

  if (!fromFactor || !toFactor) {
    resultValueSpan.textContent = "";
    resultUnitSpan.textContent = "";
    return;
  }

  const valueInMeters = rawValue * fromFactor;
  const converted = valueInMeters / toFactor;

  resultValueSpan.textContent = formatNumber(converted);
  resultUnitSpan.textContent = toUnit;
};

const convertWeight = () => {
  const rawValue = parseFloat(valueInput.value);
  const fromUnit = fromSelect.value;
  const toUnit = toSelect.value;

  if (Number.isNaN(rawValue)) {
    resultValueSpan.textContent = "";
    resultUnitSpan.textContent = "";
    return;
  }

  const fromFactor = weightToKilogram[fromUnit];
  const toFactor = weightToKilogram[toUnit];

  if (!fromFactor || !toFactor) {
    resultValueSpan.textContent = "";
    resultUnitSpan.textContent = "";
    return;
  }

  const valueInKilograms = rawValue * fromFactor;
  const converted = valueInKilograms / toFactor;

  resultValueSpan.textContent = formatNumber(converted);
  resultUnitSpan.textContent = toUnit;
};

const toCelsius = (value, fromUnit) => {
  switch (fromUnit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return (value - 32) * (5 / 9);
    case "kelvin":
      return value - 273.15;
    default:
      return NaN;
  }
};

const fromCelsius = (valueCelsius, toUnit) => {
  switch (toUnit) {
    case "celsius":
      return valueCelsius;
    case "fahrenheit":
      return valueCelsius * (9 / 5) + 32;
    case "kelvin":
      return valueCelsius + 273.15;
    default:
      return NaN;
  }
};

const convertTemperature = () => {
  const rawValue = parseFloat(valueInput.value);
  const fromUnit = fromSelect.value;
  const toUnit = toSelect.value;

  if (Number.isNaN(rawValue)) {
    resultValueSpan.textContent = "";
    resultUnitSpan.textContent = "";
    return;
  }

  const valueInCelsius = toCelsius(rawValue, fromUnit);
  const converted = fromCelsius(valueInCelsius, toUnit);

  if (Number.isNaN(converted)) {
    resultValueSpan.textContent = "";
    resultUnitSpan.textContent = "";
    return;
  }

  resultValueSpan.textContent = formatNumber(converted);
  resultUnitSpan.textContent = toUnit;
};

const detectPageType = () => {
  if (!fromSelect || !fromSelect.options || fromSelect.options.length === 0) return null;
  const firstValue = fromSelect.options[0].value;

  if (["meter", "kilometer", "centimeter", "inch", "foot", "yard", "mile"].includes(firstValue)) {
    return "length";
  }

  if (["kilogram", "gram", "pound", "ounce", "ton"].includes(firstValue)) {
    return "weight";
  }

  if (["celsius", "fahrenheit", "kelvin"].includes(firstValue)) {
    return "temperature";
  }

  return null;
};

if (convertButton && valueInput && fromSelect && toSelect && resultValueSpan && resultUnitSpan) {
  const pageType = detectPageType();

  if (pageType === "length") {
    convertButton.addEventListener("click", convertLength);
  } else if (pageType === "weight") {
    convertButton.addEventListener("click", convertWeight);
  } else if (pageType === "temperature") {
    convertButton.addEventListener("click", convertTemperature);
  }
}

