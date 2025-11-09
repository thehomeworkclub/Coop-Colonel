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
@app.route('/api/count_chickens_water')
def count_chickens():
    ret, frame = cap.read()
    if not ret:
        return {"error": "Frame not received"}, 500

    frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
    results = model_2(frame, verbose=False)

    # Define target bounding region (example from your image)
    region = (120, 200, 320, 400)  # (x1, y1, x2, y2)

    def iou(boxA, boxB):
        # Compute intersection over union
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])

        interArea = max(0, xB - xA) * max(0, yB - yA)
        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        return interArea / boxAArea if boxAArea > 0 else 0

    chicken_count = 0
    try:
        boxes = results[0].boxes
        xyxy_list = boxes.xyxy.tolist() if hasattr(boxes, "xyxy") else []
        cls_list = boxes.cls.tolist() if hasattr(boxes, "cls") else []
    except Exception:
        xyxy_list = []
        cls_list = []

    for box, cls in zip(xyxy_list, cls_list):
        if int(cls) == 0:  # class 0 = chicken
            overlap = iou(box, region)
            if overlap >= 0.5:
                chicken_count += 1
    # Log to database
    Detection.create(timestamp=datetime.now(), chicken_count=chicken_count, location="watering")
    return {"chicken_count": chicken_count}, 200


@app.route('/api/chicken_count_feeding')
def chicken_count_feeding():
    ret, frame = cap.read()
    if not ret:
        return {"error": "Frame not received"}, 500

    frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
    results = model_2(frame, verbose=False)

    # Feeding hole region (red box)
    region = (60, 180, 180, 420)

    def iou(boxA, boxB):
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])
        interArea = max(0, xB - xA) * max(0, yB - yA)
        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        return interArea / boxAArea if boxAArea > 0 else 0

    chicken_count = 0
    try:
        boxes = results[0].boxes
        xyxy_list = boxes.xyxy.tolist() if hasattr(boxes, "xyxy") else []
        cls_list = boxes.cls.tolist() if hasattr(boxes, "cls") else []
    except Exception:
        xyxy_list = []
        cls_list = []

    for box, cls in zip(xyxy_list, cls_list):
        if int(cls) == 0:  # class 0 = chicken
            overlap = iou(box, region)
            if overlap >= 0.5:
                chicken_count += 1
    Detection.create(timestamp=datetime.now(), chicken_count=chicken_count, location="feeding")
    return {"chicken_count": chicken_count}, 200

# make a route that shows x and y coordinates of detected chickens in the frame.
@app.route('/api/chicken_coordinates')
def chicken_coordinates():
    ret, frame = cap.read()
    if not ret:
        return {"error": "Frame not received"}, 500

    frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

    results = model_2(frame, verbose=False)
    coordinates = []

    # Convert tensor outputs to Python lists so they are JSON serializable
    try:
        boxes = results[0].boxes
        xyxy_list = boxes.xyxy.tolist() if hasattr(boxes, "xyxy") else []
        cls_list = boxes.cls.tolist() if hasattr(boxes, "cls") else []
    except Exception:
        xyxy_list = []
        cls_list = []

    for box, cls in zip(xyxy_list, cls_list):
        if int(cls) == 0:  # class 0 is chicken
            x = float(box[0])
            y = float(box[1])
            coordinates.append({"x": x, "y": y})

    return {"coordinates": coordinates}, 200

@app.route("/api/return_all_detections")
def return_all_detections():
    detections = []
    query = Detection.select().order_by(Detection.timestamp.desc())
    for det in query:
        detections.append({
            "id": det.id,
            "timestamp": det.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "chicken_count": det.chicken_count,
            "location": det.location
        })
    return {"detections": detections}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
