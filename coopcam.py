import cv2
from ultralytics import YOLO
from flask import Flask, Response
from db.db import Detection, db
from datetime import datetime

app = Flask(__name__)

url = "tcp://192.168.1.46:8554"
cap = cv2.VideoCapture(url)

model = YOLO("models/pt_model/best.pt")
model_2 = YOLO("models/pt_model/best_2.pt")
model_3 = YOLO("models/pt_model/best_3.pt")
model_4 = YOLO("models/pt_model/best_lessaccr.pt")
model_5 = YOLO("models/pt_model/best_vultr.pt")

def gen_frames_model_1():
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
def gen_frames_model_2():
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame not received")
            break

        frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        results = model_2(frame, verbose=False)
        annotated_frame = results[0].plot()

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
def gen_frames_model_3():
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame not received")
            break

        frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        results = model_3(frame, verbose=False)
        annotated_frame = results[0].plot()

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
def gen_frames_model_4():
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame not received")
            break

        frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        results = model_4(frame, verbose=False)
        annotated_frame = results[0].plot()

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
def gen_frames_model_5():
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame not received")
            break

        frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        results = model_5(frame, verbose=False)
        annotated_frame = results[0].plot()

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/model_1')
def video_feed():
    return Response(gen_frames_model_1(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/model_2')
def model_2_feed():
    return Response(gen_frames_model_2(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/model_3')
def model_3_feed():
    return Response(gen_frames_model_3(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/model_4')
def model_4_feed():
    return Response(gen_frames_model_4(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/model_5')
def model_5_feed():
    return Response(gen_frames_model_5(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/no_detect')
def no_detect_feed():
    def gen_no_detect_frames():
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Frame not received")
                break

            frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    return Response(gen_no_detect_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# make a route that uses model_2 to process the video feed, count how many chickens are in frame and log it every time it is called.
@app.route('/api/count_chickens')
def count_chickens():
    ret, frame = cap.read()
    if not ret:
        return {"error": "Frame not received"}, 500

    frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

    results = model_2(frame, verbose=False)
    chicken_count = sum(1 for result in results if result.boxes.cls == 0)  # Assuming class 0 is chicken


# make a route that shows x and y coordinates of detected chickens in the frame.
@app.route('/api/chicken_coordinates')
def chicken_coordinates():
    ret, frame = cap.read()
    if not ret:
        return {"error": "Frame not received"}, 500

    frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

    results = model_2(frame, verbose=False)
    coordinates = [
        {"x": result.boxes.xyxy[0][0], "y": result.boxes.xyxy[0][1]}
        for result in results if result.boxes.cls == 0
    ]

    return {"coordinates": coordinates}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
