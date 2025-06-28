import os
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename

# --- Inisialisasi Aplikasi Flask ---
app = Flask(__name__)

# --- Konfigurasi ---
# Menggunakan path untuk model TFLite
MODEL_PATH = 'model/model.tflite' # Anda bisa ganti nama file ini jika perlu
UPLOAD_FOLDER = 'uploads'

# Pastikan folder upload ada
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# --- Memuat Model TFLite ---
try:
    # Menggunakan Interpreter untuk file .tflite
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Sesuaikan class_names dengan urutan pada model Anda
    class_names = ['Busuk', 'Esca', 'Hawar', 'Negative', 'Sehat'] 
    print(f"Model TFLite '{MODEL_PATH}' berhasil dimuat.")
    
except Exception as e:
    print(f"Error: Gagal memuat file model TFLite '{MODEL_PATH}'. Detail: {e}")
    interpreter = None

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Fungsi untuk memproses gambar agar sesuai dengan input model.
    1. Mengubah ukuran gambar ke 224x224.
    2. Mengonversi gambar ke array numpy.
    3. PENTING: Normalisasi nilai piksel ke rentang [0, 1].
    """
    img_resized = image.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
    img_array_normalized = img_array / 255.0
    img_batch = np.expand_dims(img_array_normalized, axis=0)
    
    # TFLite seringkali lebih sensitif terhadap tipe data input
    return np.float32(img_batch)

@app.route('/classify', methods=['POST'])
def classify_image_api():
    """
    Endpoint API untuk menerima gambar, melakukan klasifikasi dengan TFLite, dan mengembalikan JSON.
    """
    if interpreter is None:
        return jsonify({'error': 'Kesalahan pada server: Model tidak dapat dimuat.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'Request tidak valid, tidak ada "file" yang dikirim.'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih.'}), 400

    try:
        # Buka gambar langsung dari stream request
        image = Image.open(file.stream).convert('RGB')
        
        # Proses gambar menggunakan fungsi pre-processing yang sudah benar
        processed_image = preprocess_image(image)

        # Lakukan prediksi menggunakan interpreter TFLite
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        predictions = interpreter.get_tensor(output_details[0]['index'])[0]
        
        # Dapatkan label dan tingkat keyakinan
        predicted_index = np.argmax(predictions)
        label = class_names[predicted_index]
        confidence = float(predictions[predicted_index])

        print(f"Prediksi untuk {secure_filename(file.filename)}: Label='{label}', Confidence={confidence:.2f}")

        # Kirim hasil dalam format JSON
        return jsonify({
            'label': label,
            'confidence': confidence 
        })

    except Exception as e:
        print(f"Error saat memproses gambar: {e}")
        return jsonify({'error': 'Terjadi kesalahan internal saat memproses gambar.'}), 500

# --- Menjalankan Aplikasi ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)