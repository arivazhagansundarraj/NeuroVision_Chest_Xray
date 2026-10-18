import os

# Windows PATH on this PC is missing System32, where msvcp140.dll lives
os.environ["PATH"] += os.pathsep + r"C:\Windows\System32"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import cv2
import numpy as np

print("Loading NeuroVision model...")

model = tf.keras.models.load_model(
    "neurovision_pneumonia_model.h5",
    compile=False
)

print("Model loaded successfully!")

import sys

# usage: python test_model.py "path\to\image.jpeg"  (defaults to xray.jpeg)
image_path = sys.argv[1] if len(sys.argv) > 1 else "xray.jpeg"

if not os.path.isfile(image_path):
    print(f"Error: file not found: {image_path}")
    print('Usage: python test_model.py "C:\\path\\to\\chest_xray.jpeg"')
    exit()

img = cv2.imread(
    image_path,
    cv2.IMREAD_GRAYSCALE
)

if img is None:
    print("Error: Unable to load the chest X-ray image.")
    exit()

img = cv2.resize(
    img,
    (128, 128),
    interpolation=cv2.INTER_AREA
)

img = img.astype(np.float32) / 255.0

img = img.reshape(
    1,
    128,
    128,
    1
)

prediction = model.predict(
    img,
    verbose=0
)[0][0]

prediction = float(prediction)

if prediction >= 0.5:
    result = "PNEUMONIA"
    confidence = prediction * 100
else:
    result = "NORMAL"
    confidence = (1 - prediction) * 100

print("\nPrediction Score:", prediction)
print("Result:", result)
print("Confidence:", f"{confidence:.2f}%")
