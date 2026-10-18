# PulmoScan – Chest X-Ray Pneumonia Detection

A deep-learning project that classifies a chest X-ray as **NORMAL** or **PNEUMONIA**.
A CNN was trained in Google Colab and is served through a Flask website where users can upload an X-ray and get a prediction with a confidence score.

> **Disclaimer:** This is an educational project, not a medical device. Its output is not a diagnosis and must not replace advice from a doctor or radiologist.

## Features
- CNN trained on ~5,200 labelled chest X-rays (test accuracy **97.89 %** on a held-out slice of the training data)
- Dark medical-themed website with four pages: Dashboard, X-ray Analysis, About System, About Pneumonia
- Drag-and-drop upload with image preview, result badge and confidence bar
- Command-line script to test the model on a single image
- Upload validation (JPG / JPEG / PNG only, max 10 MB) and a `/health` endpoint

## Project structure
```
NeuroVision_Chest_Xray/
├── app.py                                   # Flask web server
├── test_model.py                            # test the model on one image from the terminal
├── view_model.py                            # print the model summary
├── neurovision_pneumonia_model.h5           # trained model
├── NeuroVision_Pneumonia_Detection.ipynb.ipynb  # Colab training notebook
├── NeuroVision_Pneumonia_Code_Explanation.pdf   # line-by-line notebook explanation
├── requirements.txt
├── templates/                               # base, index (dashboard), analysis, system, pneumonia
└── static/                                  # style.css, app.js
```

## Model
| Item | Value |
|---|---|
| Input | 128 × 128 grayscale image, pixels scaled to 0–1 |
| Architecture | 3 × (Conv2D + MaxPooling) with 32 / 64 / 128 filters → Flatten → Dense 128 → Dropout 0.5 → Dense 1 (sigmoid) |
| Output | Probability of pneumonia. `>= 0.5` = PNEUMONIA, otherwise NORMAL |
| Labels | NORMAL = 0, PNEUMONIA = 1 |
| Parameters | 3,304,193 |
| Training | Adam, binary cross-entropy, batch size 16, early stopping (patience 3) |

## Setup
Requires Python 3.10+ (3.11 or 3.12 recommended for TensorFlow).

```powershell
cd NeuroVision_Chest_Xray
pip install -r requirements.txt
```

## Run the website
```powershell
python app.py
```
Wait for the model to load, then open **http://127.0.0.1:5000** in your browser.
The server listens on all interfaces, so other devices on the same network can use `http://<your-PC-IP>:5000`. Set the `PORT` environment variable to change the port.

| Route | Purpose |
|---|---|
| `/` | Dashboard |
| `/analysis` | Upload an X-ray and get a prediction |
| `/system` | How the system works |
| `/pneumonia` | Medical terms, symptoms and risk factors |
| `/predict` (POST) | Prediction API, form field `image` |
| `/health` | Health check |

`/predict` returns JSON:
```json
{ "success": true, "prediction": "PNEUMONIA", "confidence": 85.14 }
```

## Test from the terminal
```powershell
python test_model.py "C:\path\to\chest_xray.jpeg"
```
Prints the prediction score, the result and the confidence. Use `python view_model.py` to print the model architecture.

## Troubleshooting
| Problem | Fix |
|---|---|
| `Could not find the DLL(s) 'msvcp140.dll'` | The scripts already add `C:\Windows\System32` to PATH for this reason. If it still fails, install the [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe) and restart VS Code. |
| Website will not open | Make sure `python app.py` is still running and use `http://127.0.0.1:5000`, not `0.0.0.0`. |
| First upload is slow | The model loads on the first request (about 30 s). Later requests are fast. |
| `Address already in use` | Another copy is running on port 5000. Stop it or set a different `PORT`. |

## Limitations
- The test split was taken from the dataset's `train` folder (random 80/20), not from its official `test` folder, and images from the same patient may appear on both sides. Real-world accuracy is likely lower than 97.89 %.
- The classes are unbalanced (about 3 pneumonia images for every Normal one).
- The model was trained on one public dataset and has not been clinically validated.

## Tech stack
Python · TensorFlow / Keras · Flask · Pillow · NumPy · HTML / CSS / JavaScript · Google Colab (training)
