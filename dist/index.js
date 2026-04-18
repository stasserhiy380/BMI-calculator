"use strict";
const inputData = document.getElementById("input-data");
const bmiValue = document.querySelector(".calculated-bmi");
const bmiDescription = document.querySelector(".bmi-description");
const unitRadios = document.querySelectorAll('input[name="unit-system"]');
if (!inputData || !bmiValue || !bmiDescription) {
    throw new Error("Required DOM elements were not found.");
}
function renderMetricFields() {
    inputData.innerHTML = `
    <div class="metric-layout">
      <div class="input-wrapper">
        <label for="height">Height</label>
        <input id="height" name="height" type="number" min="0" step="any">
        <p class="metric">cm</p>
      </div>

      <div class="input-wrapper">
        <label for="weight">Weight</label>
        <input id="weight" name="weight" type="number" min="0" step="any">
        <p class="metric">kg</p>
      </div>
    </div>
  `;
    attachInputListeners();
}
function renderImperialFields() {
    inputData.innerHTML = `
    <div class="imperial-layout">
      <div class="imperial-section">
        <label class="section-label" for="height-ft">Height</label>
        <div class="imperial-group">
          <div class="imperial-field">
            <input id="height-ft" name="height-ft" type="number" min="0" step="1">
            <p class="metric">ft</p>
          </div>
          <div class="imperial-field">
            <input id="height-in" name="height-in" type="number" min="0" step="1">
            <p class="metric">in</p>
          </div>
        </div>
      </div>

      <div class="imperial-section">
        <label class="section-label" for="weight-st">Weight</label>
        <div class="imperial-group">
          <div class="imperial-field">
            <input id="weight-st" name="weight-st" type="number" min="0" step="1">
            <p class="metric">st</p>
          </div>
          <div class="imperial-field">
            <input id="weight-lbs" name="weight-lbs" type="number" min="0" step="1">
            <p class="metric">lbs</p>
          </div>
        </div>
      </div>
    </div>
  `;
    attachInputListeners();
}
function attachInputListeners() {
    const inputs = inputData.querySelectorAll("input");
    inputs.forEach((input) => {
        input.addEventListener("input", updateBMI);
    });
}
function getSelectedUnitSystem() {
    const checkedRadio = document.querySelector('input[name="unit-system"]:checked');
    return (checkedRadio === null || checkedRadio === void 0 ? void 0 : checkedRadio.value) === "imperial" ? "imperial" : "metric";
}
function setDefaultMessage() {
    bmiValue.textContent = "0.0";
    bmiDescription.textContent =
        "Enter your height and weight and you’ll see your BMI result here.";
}
function getBMICategory(bmi) {
    if (bmi < 18.5)
        return "underweight";
    if (bmi < 25)
        return "healthy weight";
    if (bmi < 30)
        return "overweight";
    return "obese";
}
function formatStonePounds(totalPounds) {
    const stone = Math.floor(totalPounds / 14);
    const pounds = Math.round(totalPounds % 14);
    return `${stone}st ${pounds}lbs`;
}
function updateMetricBMI() {
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    if (!heightInput || !weightInput)
        return;
    const heightCm = Number(heightInput.value);
    const weightKg = Number(weightInput.value);
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
        setDefaultMessage();
        return;
    }
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM ** 2);
    const minWeight = 18.5 * (heightM ** 2);
    const maxWeight = 24.9 * (heightM ** 2);
    bmiValue.textContent = bmi.toFixed(1);
    bmiDescription.innerHTML = `
    Your BMI suggests you’re a <span>${getBMICategory(bmi)}</span>.
    Your ideal weight is between <span>${minWeight.toFixed(1)}kgs - ${maxWeight.toFixed(1)}kgs</span>.
  `;
}
function updateImperialBMI() {
    const heightFtInput = document.getElementById("height-ft");
    const heightInInput = document.getElementById("height-in");
    const weightStInput = document.getElementById("weight-st");
    const weightLbsInput = document.getElementById("weight-lbs");
    if (!heightFtInput || !heightInInput || !weightStInput || !weightLbsInput)
        return;
    const heightFt = Number(heightFtInput.value);
    const heightIn = Number(heightInInput.value);
    const weightSt = Number(weightStInput.value);
    const weightLbs = Number(weightLbsInput.value);
    const totalInches = heightFt * 12 + heightIn;
    const totalPounds = weightSt * 14 + weightLbs;
    if (!totalInches || !totalPounds || totalInches <= 0 || totalPounds <= 0) {
        setDefaultMessage();
        return;
    }
    const bmi = (totalPounds / (totalInches ** 2)) * 703;
    const minHealthyPounds = (18.5 * (totalInches ** 2)) / 703;
    const maxHealthyPounds = (24.9 * (totalInches ** 2)) / 703;
    bmiValue.textContent = bmi.toFixed(1);
    bmiDescription.innerHTML = `
    Your BMI suggests you’re a <span>${getBMICategory(bmi)}</span>.
    Your ideal weight is between <span>${formatStonePounds(minHealthyPounds)} - ${formatStonePounds(maxHealthyPounds)}</span>.
  `;
}
function updateBMI() {
    if (getSelectedUnitSystem() === "metric") {
        updateMetricBMI();
    }
    else {
        updateImperialBMI();
    }
}
function renderInputs(unitSystem) {
    if (unitSystem === "metric") {
        renderMetricFields();
    }
    else {
        renderImperialFields();
    }
    setDefaultMessage();
}
unitRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        renderInputs(getSelectedUnitSystem());
    });
});
renderInputs("metric");
