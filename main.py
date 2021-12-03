import cv2
from argparse import ArgumentParser
import time

def main(args):

    # available params are https://flir.custhelp.com/app/answers/detail/a_id/1053/related/1
    dat = f"rtsp://{args.ip}/mjpg?overlay={'on' if args.keep_overlay else 'off'}"
    print(dat)
    cap = cv2.VideoCapture(dat)
    time.sleep(1)
    count = 0
    major = 0

    last = 0
    while True:
        ret, frame = cap.read()

        if not ret:
            print("Could not open FLIR camera capture. Check if camera is connected and the IP is correct")


        count += 1
        count %= 9
        if count == 0:
            # reads at 9fps
            cv2.imwrite(f"images/out_{major}.jpg", frame)
            major += 1
            print(last - time.time())
            last = time.time()




if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("--ip", type=str,  help="IP address of the flir ax8", default="192.168.1.4")
    parser.add_argument("--keep_overlay", help="keep the text overlay on flir ax8 images", action="store_true")

    args = parser.parse_args()
    main(args)