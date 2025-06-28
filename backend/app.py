import os
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# --- Konfigurasi ---
MODEL_PATH = os.path.join('model', 'model.tflite') 
IMG_HEIGHT = 224
IMG_WIDTH = 224
# Pastikan urutan kelas ini SAMA PERSIS dengan saat model Anda dilatih
DISEASE_CLASSES = ['Hawar', 'Sehat', 'Busuk', 'Esca', 'Negative'] 

# --- Muat Model TFLite ---
try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print("Model TFLite berhasil dimuat.")
except Exception as e:
    print(f"Error: Gagal memuat model TFLite dari {MODEL_PATH}. Detail: {e}")
    interpreter = None

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Fungsi untuk memproses gambar agar sesuai dengan input model.
    1. Mengubah ukuran gambar ke 224x224.
    2. Mengonversi gambar ke array numpy.
    3. **PENTING: Normalisasi nilai piksel ke rentang [0, 1].**
       Langkah ini harus cocok dengan cara gambar diproses saat training.
    4. Menambahkan dimensi batch.
    """
    img = image.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    
    # Normalisasi gambar. Ini adalah langkah krusial untuk akurasi.
    img_array = img_array / 255.0
    
    # Membuat batch dan memastikan tipe data float32
    img_array = tf.expand_dims(img_array, 0)
    return np.float32(img_array)

@app.route('/classify', methods=['POST'])
def classify_image():
    """
    Endpoint untuk menerima gambar, melakukan klasifikasi, dan mengembalikan hasilnya.
    """
    if interpreter is None:
        return jsonify({'error': 'Kesalahan pada server: Model tidak dapat dimuat.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file gambar yang dikirim dalam permintaan.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih.'}), 400

    try:
        # Buka gambar dan pastikan formatnya RGB
        image = Image.open(file.stream).convert('RGB')
        
        # Proses gambar menggunakan fungsi yang sudah disempurnakan
        processed_image = preprocess_image(image)

        # Lakukan prediksi dengan TFLite Interpreter
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        
        # Dapatkan hasil prediksi
        predictions = interpreter.get_tensor(output_details[0]['index'])
        
        # Gunakan Softmax untuk mendapatkan probabilitas
        score = tf.nn.softmax(predictions[0])
        
        # Dapatkan label dan keyakinan murni dari model
        confidence = np.max(score)
        label = DISEASE_CLASSES[np.argmax(score)]

        print(f"Prediksi: Label='{label}', Confidence={confidence:.2f}")

        # Kirim hasil dalam format JSON
        return jsonify({
            'label': label,
            'confidence': float(confidence)
        })

    except Exception as e:
        print(f"Error saat memproses gambar: {e}")
        return jsonify({'error': f'Terjadi kesalahan saat memproses gambar di server.'}), 500

if __name__ == '__main__':
    # Jalankan server agar bisa diakses dari jaringan lokal
    app.run(debug=True, host='0.0.0.0')