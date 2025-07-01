# backend/app.py
import os
from flask import Flask, request, jsonify, session
from PIL import Image
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", os.urandom(24))

MODEL_PATH = 'model/model.tflite'
UPLOAD_FOLDER = 'uploads'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY tidak ditemukan di file .env Anda.")
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Model Gemini berhasil diinisialisasi.")
except Exception as e:
    print(f"Error saat inisialisasi Gemini: {e}")
    model = None

try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    class_names = ['Busuk', 'Esca', 'Hawar', 'Negative', 'Sehat'] 
    print(f"Model TFLite '{MODEL_PATH}' berhasil dimuat.")
except Exception as e:
    print(f"Error: Gagal memuat file model TFLite '{MODEL_PATH}'. Detail: {e}")
    interpreter = None

def preprocess_image(image: Image.Image) -> np.ndarray:
    img_resized = image.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
    img_array_normalized = img_array / 255.0
    img_batch = np.expand_dims(img_array_normalized, axis=0)
    return np.float32(img_batch)

@app.route('/classify', methods=['POST'])
def classify_image_api():
    if interpreter is None:
        return jsonify({'error': 'Kesalahan pada server: Model tidak dapat dimuat.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'Request tidak valid, tidak ada "file" yang dikirim.'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih.'}), 400

    try:
        image = Image.open(file.stream).convert('RGB')
        processed_image = preprocess_image(image)
        interpreter.set_tensor(input_details[0]['index'], processed_image)
        interpreter.invoke()
        predictions = interpreter.get_tensor(output_details[0]['index'])[0]
        predicted_index = np.argmax(predictions)
        label = class_names[predicted_index]
        confidence = float(predictions[predicted_index])
        print(f"Prediksi untuk {secure_filename(file.filename)}: Label='{label}', Confidence={confidence:.2f}")
        return jsonify({'label': label, 'confidence': confidence})
    except Exception as e:
        print(f"Error saat memproses gambar: {e}")
        return jsonify({'error': 'Terjadi kesalahan internal saat memproses gambar.'}), 500

@app.route('/chat', methods=['POST'])
def chat_handler():
    if model is None:
        return jsonify({'error': 'Kesalahan pada server: Model Gemini tidak dapat dimuat.'}), 500
    if not request.json or 'prompt' not in request.json:
        return jsonify({'error': 'Request tidak valid, "prompt" tidak ditemukan.'}), 400
    
    user_prompt = request.json['prompt']

    if 'chat_history' not in session:
        session['chat_history'] = []

    history_for_prompt = "\n".join([f"{msg['role']}: {msg['text']}" for msg in session.get('chat_history', [])])

    system_instruction = (
        "Anda adalah GrapeCheck Bot, seorang ahli botani digital yang ramah dan berspesialisasi dalam kesehatan tanaman anggur. "
        "Tugas Anda adalah membantu pengguna mengidentifikasi penyakit, memberikan saran perawatan, dan menjawab pertanyaan terkait budidaya anggur berdasarkan riwayat percakapan. "
        "Selalu berikan jawaban yang **akurat, ringkas, dan mudah dipahami**. "
        "Ketika memberikan saran, **selalu gunakan format Markdown** seperti **poin-poin bernomor** atau **bullet points** untuk langkah-langkah yang jelas. "
        "Jika Anda tidak yakin atau pertanyaannya di luar topik anggur, katakan dengan sopan bahwa Anda hanya bisa membantu seputar tanaman anggur. "
        "Selalu sapa pengguna dengan ramah.\n\n"
        f"Riwayat Percakapan:\n{history_for_prompt}\n\n"
        f"Pertanyaan Pengguna Saat Ini: \"{user_prompt}\""
    )
    
    try:
        response = model.generate_content(system_instruction)
        bot_response_text = response.text

        session['chat_history'].append({"role": "user", "text": user_prompt})
        session['chat_history'].append({"role": "bot", "text": bot_response_text})
        session['chat_history'] = session['chat_history'][-20:] 
        session.modified = True
        
        return jsonify({'response': bot_response_text})
    except Exception as e:
        print(f"Error saat berkomunikasi dengan Gemini API: {e}")
        return jsonify({'error': 'Terjadi kesalahan internal saat memproses permintaan Anda.'}), 500

@app.route('/chat/reset', methods=['POST'])
def chat_reset():
    session.pop('chat_history', None)
    return jsonify({'status': 'ok', 'message': 'Riwayat percakapan berhasil direset.'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)