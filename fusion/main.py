import numpy as np
import cv2
from pylepton import Lepton
from matplotlib import pyplot as plt
import time
import pickle
from fuse import fuse
import mysql.connector


def get_images(l, adjust=False):
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
    print("got image")
    capture.release()
    ir, _ = l.capture()
    if adjust:
        cv2.normalize(ir, ir, 0, 65535, cv2.NORM_MINMAX) # extend contrast
        np.right_shift(ir, 8, ir) # fit data into 8 bits
    return data, ir


def connect():
    mydb = mysql.connector.connect(
      host="localhost",
      user="sd",
      password="supersecretpassword",
      database='sd_values'
    )
    return mydb

def get_rects(db):
    query = "SELECT min_x, min_y, max_x, max_y FROM rect_pos"
    cursor = db.cursor()
    cursor.execute(query)
    data = []
    results = cursor.fetchall()
    db.commit()
    for (minX, minY, maxX, maxY) in results:
        data.append([minX, minY, maxX, maxY])
    cursor.close()
    return data


def main():
    objp = np.zeros((7*7,3), np.float32)
    objp[:,:2] = np.mgrid[0:7,0:7].T.reshape(-1,2)
    # Arrays to store object points and image points from all the images.
    objpoints = [] # 3d point in real world space
    imgpoints = [] # 2d points in image plane.

    db = connect()

    i=6
    data = []
    rect_color = [0,255,0]
    with Lepton('/dev/spidev0.1') as l:
        while True:
            rgb, ir = get_images(l, adjust=True)
            gray = cv2.cvtColor(rgb, cv2.COLOR_BGR2GRAY)
            data.append(ir)
            #cv2.imwrite(f"images/ir/{i:04d}.jpg", ir)
            #cv2.imwrite(f"images/rgb/{i:04d}.jpg", rgb)
            i+=1
            fused = fuse(ir, gray)
            rects = get_rects(db)
            print(rects)
            for rect in rects:
                fused = cv2.rectangle(
                            fused, 
                            (rect[0], rect[1]), 
                            (rect[2], rect[3]), 
                            rect_color, 
                            5
                        )
    #        cv2.imshow("blended", fused)
            cv2.imwrite(f"../web/img/{i}.jpg", fused)
            cv2.waitKey(500)


if __name__ == "__main__":
    main()
