import cv2
from ultralytics import YOLO
from flask import Flask, Response

app = Flask(__name__)

url = "tcp://192.168.1.46:8554"
cap = cv2.VideoCapture(url)

model = YOLO("models/pt_model/best.pt")

def gen_frames():
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame not received")
            break

        frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        results = model(frame, verbose=False)
        annotated_frame = results[0].plot()

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
