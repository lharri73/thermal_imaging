import numpy as np
import cv2
from pylepton import Lepton
from matplotlib import pyplot as plt
import time
import pickle
from fuse import fuse, resize
import mysql.connector
import argparse

cal_points = np.array([
                [30657, 90],
                [26895, 28]
             ])


def get_images(l):
    capture = cv2.VideoCapture(0, cv2.CAP_V4L2)
    capture.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('J', 'P', 'E', 'G'))
    width = 3280
    height = 2464
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    success = False
    while not success:
        success, data = capture.read()
        if not success:
            time.sleep(0.5)
            print("did not recieve image. sleeping")
    capture.release()
    ir, _ = l.capture()
    ir_raw = np.copy(ir)
    lamd = (ir_raw - cal_points[1,0] ) / ( cal_points[0,0] - cal_points[1,0])
    ir_raw = cal_points[1,1] + lamd * (cal_points[0,1] - cal_points[1,1])
    cv2.normalize(ir, ir, 0, 65535, cv2.NORM_MINMAX) # extend contrast
    np.right_shift(ir, 8, ir) # fit data into 8 bits
    return data, ir, ir_raw


def connect():
    mydb = mysql.connector.connect(
      host="localhost",
      user="sd",
      password="supersecretpassword",
      database='sd_values'
    )
    return mydb

def get_rects(db):
    query = "SELECT id, min_x, min_y, max_x, max_y FROM rect_pos"
    cursor = db.cursor()
    cursor.execute(query)
    data = []
    results = cursor.fetchall()
    db.commit()
    for (id, minX, minY, maxX, maxY) in results:
        data.append([int(minX), int(minY), int(maxX), int(maxY), id])
    cursor.close()
    return data


def main(args):
    db = connect()

    i=6 ## don't overwrite the original images...
    rect_color = [86,0,161]
    with Lepton('/dev/spidev0.1') as l:
        while True:
            rgb, ir, ir_raw = get_images(l)
            ir_raw = resize(ir_raw)
            gray = cv2.cvtColor(rgb, cv2.COLOR_BGR2GRAY)
            i+=1
            fused = fuse(ir, gray)
            fused = cv2.cvtColor(fused, cv2.COLOR_GRAY2BGR)
            rects = get_rects(db)
            for rect in rects:
                fused = cv2.rectangle(
                            fused, 
                            (rect[0], rect[1]), 
                            (rect[2], rect[3]), 
                            rect_color, 
                            2
                        )
                minVal = np.min(ir_raw[rect[1]:rect[3],rect[0]:rect[2]])
                maxVal = np.max(ir_raw[rect[1]:rect[3],rect[0]:rect[2]])
                rect_shape = (rect[3] - rect[0], rect[2]-rect[1])
                amin = np.unravel_index(np.argmin(ir_raw[rect[1]:rect[3],rect[0]:rect[2]]), rect_shape)
                amax = np.unravel_index(np.argmax(ir_raw[rect[1]:rect[3],rect[0]:rect[2]]), rect_shape)
                print(amin, amax)
                cv2.drawMarker(fused, (rect[0]+amin[1], rect[1]+amin[0]), (255,0,0), markerType=cv2.MARKER_CROSS, markerSize=100, thickness=2, line_type=cv2.LINE_AA)
                cv2.putText(fused, f"id: {rect[4]}, min: {minVal:.1f}, max: {maxVal:.1f}", (rect[0], rect[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 1.6, rect_color, 3)

            if args.scale_factor != 1.0:
                width = int(float(fused.shape[1])*args.scale_factor)
                height = int(float(fused.shape[0])*args.scale_factor)
                fused = cv2.resize(fused, (width,height), interpolation=cv2.INTER_LINEAR)
            #cv2.imwrite(f"../web/img/{i}.jpg", fused)
            cv2.imshow("display", fused)
            cv2.waitKey(500)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--scale_factor", default=1.0, type=float)
    args = parser.parse_args()
    main(args)
