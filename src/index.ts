type UnitSystem = "metric" | "imperial";

const inputData = document.getElementById("input-data") as HTMLDivElement;
const bmiValue = document.querySelector<HTMLParagraphElement>(".calculated-bmi") as HTMLParagraphElement;
const bmiDescription = document.querySelector<HTMLParagraphElement>(".bmi-description") as HTMLParagraphElement;
const unitRadios = document.querySelectorAll<HTMLInputElement>('input[name="unit-system"]');

if (!inputData || !bmiValue || !bmiDescription) {
    throw new Error("Required DOM elements were not found.");
}

function renderMetricFields(): void {
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

function renderImperialFields(): void {
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

function attachInputListeners(): void {
    const inputs = inputData.querySelectorAll<HTMLInputElement>("input");
    inputs.forEach((input) => {
        input.addEventListener("input", updateBMI);
    });
}

function getSelectedUnitSystem(): UnitSystem {
    const checkedRadio = document.querySelector<HTMLInputElement>(
        'input[name="unit-system"]:checked'
    );

    return checkedRadio?.value === "imperial" ? "imperial" : "metric";
}

function setDefaultMessage(): void {
    bmiValue.textContent = "0.0";
    bmiDescription.textContent =
        "Enter your height and weight and you’ll see your BMI result here.";
}

function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "healthy weight";
    if (bmi < 30) return "overweight";
    return "obese";
}

function formatStonePounds(totalPounds: number): string {
    const stone = Math.floor(totalPounds / 14);
    const pounds = Math.round(totalPounds % 14);
    return `${stone}st ${pounds}lbs`;
}

function updateMetricBMI(): void {
    const heightInput = document.getElementById("height") as HTMLInputElement | null;
    const weightInput = document.getElementById("weight") as HTMLInputElement | null;

    if (!heightInput || !weightInput) return;

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

function updateImperialBMI(): void {
    const heightFtInput = document.getElementById("height-ft") as HTMLInputElement | null;
    const heightInInput = document.getElementById("height-in") as HTMLInputElement | null;
    const weightStInput = document.getElementById("weight-st") as HTMLInputElement | null;
    const weightLbsInput = document.getElementById("weight-lbs") as HTMLInputElement | null;

    if (!heightFtInput || !heightInInput || !weightStInput || !weightLbsInput) return;

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

function updateBMI(): void {
    if (getSelectedUnitSystem() === "metric") {
        updateMetricBMI();
    } else {
        updateImperialBMI();
    }
}

function renderInputs(unitSystem: UnitSystem): void {
    if (unitSystem === "metric") {
        renderMetricFields();
    } else {
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