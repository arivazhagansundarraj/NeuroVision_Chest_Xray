import os

# Windows PATH on this PC is missing System32, where msvcp140.dll lives
os.environ["PATH"] += os.pathsep + r"C:\Windows\System32"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf

model = tf.keras.models.load_model("neurovision_pneumonia_model.h5")

print("\n" + "=" * 70)
print("PULMOSCAN CHEST X-RAY CNN MODEL")
print("=" * 70)

print("\nMODEL SUMMARY")
print("-" * 70)

model.summary()

print("\nINPUT SHAPE:")
print(model.input_shape)

print("\nOUTPUT SHAPE:")
print(model.output_shape)

print("\nTOTAL PARAMETERS:")
print(model.count_params())

print("\nTRAINABLE PARAMETERS:")
print(sum(tf.keras.backend.count_params(w) for w in model.trainable_weights))

print("\nNON-TRAINABLE PARAMETERS:")
print(sum(tf.keras.backend.count_params(w) for w in model.non_trainable_weights))

print("\nMODEL LOADED SUCCESSFULLY!")
