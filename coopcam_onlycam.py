# give me a tcp stream from tcp://192.168.1.46:8554 thats it 
import cv2
import flask
import threading
import time

app = flask.Flask(__name__)
url = "tcp://192.168.1.46:8554"

# Global variables for shared frame
current_frame = None
frame_lock = threading.Lock()
capture_thread = None
stop_capture = False

def capture_frames():
    global current_frame, stop_capture
    cap = cv2.VideoCapture(url)
    
    # Set buffer size to reduce latency
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    
    while not stop_capture:
        success, frame = cap.read()
        if success:
            frame = cv2.rotate(frame, cv2.ROTATE_180)
            with frame_lock:
                current_frame = frame.copy()
        else:
            # If capture fails, try to reconnect
            cap.release()
            time.sleep(1)
            cap = cv2.VideoCapture(url)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    
    cap.release()

def start_capture():
    global capture_thread, stop_capture
    if capture_thread is None or not capture_thread.is_alive():
        stop_capture = False
        capture_thread = threading.Thread(target=capture_frames, daemon=True)
        capture_thread.start()

def gen_frames():
    while True:
        with frame_lock:
            if current_frame is not None:
                ret, buffer = cv2.imencode('.jpg', current_frame)
                if ret:
                    frame_bytes = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.033)  # ~30 FPS

@app.route('/video_feed')
def video_feed():
    start_capture()  # Ensure capture is running
    return flask.Response(gen_frames(),
                          mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    start_capture()  # Start capture when server starts
    try:
        app.run(host='0.0.0.0', port=5002, threaded=True)
    finally:
        stop_capture = True
        if capture_thread:
            capture_thread.join()