import os
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# --- Konfigurasi Model ---
# Ganti dengan path ke file model .tflite Anda
MODEL_PATH = os.path.join('model', 'model.tflite') 
# Sesuaikan dengan ukuran input yang diharapkan oleh model Anda
IMG_HEIGHT = 224
IMG_WIDTH = 224
# Sesuaikan dengan kelas penyakit yang ada
DISEASE_CLASSES = ['Hawar', 'Sehat', 'Busuk', 'Esca', 'Negative']

# --- Muat Model TFLite ---
try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
except (ValueError, RuntimeError) as e:
    print(f"Error loading TFLite model from {MODEL_PATH}: {e}")
    interpreter = None

def preprocess_image(image):
    """
    Fungsi untuk melakukan pra-pemrosesan gambar sebelum dimasukkan ke model.
    """
    img = image.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Membuat batch
    return img_array

@app.route('/classify', methods=['POST'])
def classify_image():
    """
    Endpoint untuk menerima gambar dan mengembalikan hasil klasifikasi.
    """
    if interpreter is None:
        return jsonify({'error': 'Model tidak dapat dimuat, periksa path dan file model.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file gambar yang dikirim'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih'}), 400

    try:
        # Buka gambar menggunakan Pillow
        image = Image.open(file.stream).convert('RGB') # Pastikan format RGB
        
        # Lakukan pra-pemrosesan pada gambar
        processed_image = preprocess_image(image)

        # Lakukan prediksi dengan TFLite Interpreter
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        predictions = interpreter.get_tensor(output_details[0]['index'])
        
        score = tf.nn.softmax(predictions[0])
        
        # Dapatkan label dan confidence
        label = DISEASE_CLASSES[np.argmax(score)]
        confidence = np.max(score)

        # Kirim respon dalam format JSON
        return jsonify({
            'label': label.replace('_', ' '),
            'confidence': float(confidence)
        })

    except Exception as e:
        return jsonify({'error': f'Terjadi kesalahan saat memproses gambar: {str(e)}'}), 500

if __name__ == '__main__':
    # Ganti host menjadi '0.0.0.0' agar dapat diakses dari jaringan lokal
    app.run(debug=True, host='0.0.0.0')