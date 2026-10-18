const fileInput = document.getElementById("file");
const dropzone = document.getElementById("dropzone");
const preview = document.getElementById("preview");
const dzText = document.getElementById("dz-text");
const analyzeBtn = document.getElementById("analyze");

const placeholder = document.getElementById("placeholder");
const loading = document.getElementById("loading");
const output = document.getElementById("output");
const errorBox = document.getElementById("error");
const badge = document.getElementById("badge");
const meterFill = document.getElementById("meter-fill");
const confidence = document.getElementById("confidence");
const advice = document.getElementById("advice");

let selectedFile = null;

function showState(state) {
  placeholder.hidden = state !== "placeholder";
  loading.hidden = state !== "loading";
  output.hidden = state !== "output";
  errorBox.hidden = state !== "error";
}

function setFile(file) {
  if (!file) return;
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    errorBox.textContent = "Invalid file type. Please upload JPG, JPEG or PNG.";
    showState("error");
    return;
  }
  selectedFile = file;
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  dzText.hidden = true;
  analyzeBtn.disabled = false;
  showState("placeholder");
}

fileInput.addEventListener("change", () => setFile(fileInput.files[0]));

["dragenter", "dragover"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add("drag"); })
);
["dragleave", "drop"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove("drag"); })
);
dropzone.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));

analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) return;
  analyzeBtn.disabled = true;
  showState("loading");

  const form = new FormData();
  form.append("image", selectedFile);

  try {
    const res = await fetch("/predict", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Something went wrong.");

    const isPneumonia = data.prediction === "PNEUMONIA";
    const cls = isPneumonia ? "pneumonia" : "normal";
    badge.textContent = isPneumonia ? "Pneumonia detected" : "Normal";
    badge.className = "badge " + cls;
    meterFill.className = "meter-fill " + cls;
    meterFill.style.width = "0";
    requestAnimationFrame(() => (meterFill.style.width = data.confidence + "%"));
    confidence.textContent = data.confidence.toFixed(2) + "%";
    advice.textContent = isPneumonia
      ? "The model found patterns consistent with pneumonia. Please consult a doctor for a proper diagnosis."
      : "The model found no signs of pneumonia. This does not rule out illness — consult a doctor if you have symptoms.";
    showState("output");
  } catch (err) {
    errorBox.textContent = err.message;
    showState("error");
  } finally {
    analyzeBtn.disabled = false;
  }
});
