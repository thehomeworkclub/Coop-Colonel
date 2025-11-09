# give me a tcp stream from tcp://192.168.1.46:8554 thats it 
import cv2
import flask

app = flask.Flask(__name__)
url = "tcp://192.168.1.46:8554"

def gen_frames():
    cap = cv2.VideoCapture(url)
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
@app.route('/video_feed')
def video_feed():
    return flask.Response(gen_frames(),
                          mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)