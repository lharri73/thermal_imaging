import numpy as np
import cv2
from pylepton import Lepton
import time

CHECKERBOARD = (7,7)
criteria = (cv2.TERM_CRITERIA_EPS + 
            cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

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


def main():
    print("here")
    objp = np.zeros((7*7,3), np.float32)
    objp[:,:2] = np.mgrid[0:7,0:7].T.reshape(-1,2)
    # Arrays to store object points and image points from all the images.
    objpoints = [] # 3d point in real world space
    imgpoints = [] # 2d points in image plane.

    i=0
    with Lepton('/dev/spidev0.1') as l:
        while True:
            rgb, ir = get_images(l)
            gray = cv2.cvtColor(rgb, cv2.COLOR_BGR2GRAY)

#            print("finding chessboard")
#            ret, corners = cv2.findChessboardCorners(
#                    gray,
#                    CHECKERBOARD,
#                    cv2.CALIB_CB_ADAPTIVE_THRESH + 
#                    cv2.CALIB_CB_FAST_CHECK +
#                    cv2.CALIB_CB_NORMALIZE_IMAGE)
#            print("found chessboardCorners")
#            if ret:
#                corners2 = cv2.cornerSubPix(gray,corners, (11,11), (-1,-1), criteria)
#                imgpoints.append(corners)
#                # Draw and display the corners
#                cv2.drawChessboardCorners(rgb, (7,6), corners2, ret)
#                cv2.imshow('img', rgb)
#                cv2.waitKey(500)
            cv2.imshow('img', rgb)
            cv2.imwrite(f"images/ir/{i:04d}.jpg", ir)
            cv2.imwrite(f"images/rgb/{i:04d}.jpg", rgb)
            i+=1
            cv2.waitKey(500)


if __name__ == "__main__":
    main()
