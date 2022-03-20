import numpy as np
import cv2
from pylepton import Lepton

def main():
    capture = cv2.VideoCapture(1)
    capture.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('J', 'P', 'E', 'G'))
    width = 3280
    height = 2464
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    print(capture)

    with Lepton('/dev/spidev0.1') as l:
        a,_ = l.capture()

    success, data = capture.read()
    cv2.normalize(a, a, 0, 65535, cv2.NORM_MINMAX) # extend contrast

    np.right_shift(a, 8, a) # fit data into 8 bits
    cv2.imwrite("a.jpg", np.uint8(a))
    cv2.imwrite("b.jpg", data)

    capture.release()
     

if __name__ == "__main__":
    main()
