import cv2
import sys
import numpy as np

W_FACTOR = 32
H_FACTOR = W_FACTOR
x_offset = 320   #actually y
y_offset = 430   # actually x

final_factor = 1

#for i in range(44):
#    runOnce(i)

def fuse(ir, rgb):
    width = int(ir.shape[1]*W_FACTOR)
    height = int(ir.shape[0]*H_FACTOR)
    w2 = int(rgb.shape[1])
    h2 = int(rgb.shape[0])
    ir = cv2.resize(ir, (width,height), interpolation=cv2.INTER_LINEAR)
    rgb = cv2.resize(rgb, (w2,h2), interpolation=cv2.INTER_AREA)
    out2 = cv2.convertScaleAbs(ir, alpha=2, beta=0)
    rgb = rgb[x_offset:ir.shape[0]+x_offset, y_offset:ir.shape[1]+y_offset]
    dst = cv2.addWeighted(rgb, 0.3, out2, 0.7, 0)
    
    final = cv2.resize(dst, 
                       (
                           int(dst.shape[1]*final_factor),
                           int(dst.shape[0]*final_factor),
                       ),
                       interpolation=cv2.INTER_AREA)
    return final

def resize(ir_raw):
    ir = np.copy(ir_raw)
    width = int(ir.shape[1]*W_FACTOR)
    height = int(ir.shape[0]*H_FACTOR)
    ir = cv2.resize(ir, (width,height), interpolation=cv2.INTER_LINEAR)
    return ir

if __name__ == "__main__":
    print("run main.py")
