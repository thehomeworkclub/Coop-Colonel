#!/bin/bash

CONFIG_FILE="/etc/camera-stream/camera-stream.conf"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    WIDTH=640
    HEIGHT=480
    FPS=15
    BITRATE=800000
    ROTATION=0
    HFLIP=0
    VFLIP=0
fi

PORT=8554

if command -v libcamera-vid &> /dev/null; then
    CAMERA_CMD="libcamera-vid"
elif command -v rpicam-vid &> /dev/null; then
    CAMERA_CMD="rpicam-vid"
elif command -v raspivid &> /dev/null; then
    CAMERA_CMD="raspivid"
    CMD="raspivid -t 0 -w $WIDTH -h $HEIGHT -fps $FPS -b $BITRATE -cd H264 -ih -pf baseline"
    [ "$ROTATION" != "0" ] && CMD="$CMD -rot $ROTATION"
    [ "$HFLIP" = "1" ] && CMD="$CMD -hf"
    [ "$VFLIP" = "1" ] && CMD="$CMD -vf"
    CMD="$CMD -o - | nc -l -p $PORT -q 1"

    eval $CMD
    exit 0
else
    exit 1
fi

CMD="$CAMERA_CMD -t 0 --width $WIDTH --height $HEIGHT --framerate $FPS"
CMD="$CMD --codec h264 --bitrate $BITRATE --inline"
[ "$ROTATION" != "0" ] && CMD="$CMD --rotation $ROTATION"
[ "$HFLIP" = "1" ] && CMD="$CMD --hflip"
[ "$VFLIP" = "1" ] && CMD="$CMD --vflip"

$CMD -o - | nc -l -p $PORT -q 1
