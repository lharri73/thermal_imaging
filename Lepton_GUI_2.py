from remi.gui import *
from widgets.toolbox_opencv import *
from remi import start, App
from multiprocessing import Process
import time
import picamera
import numpy as np
from numpy import ndarray as arr
import cv2
import traceback
import sys
sys.path.insert(1,'/home/pi/pylepton')
from pylepton import Lepton
# Test line below
#from pylepton import pylepton_overlay

# Define video overlay function

def overlay(flip_v = False, alpha = 128, device = "/dev/spidev0.1"):
  # Create an array representing a 1280x720 image of
  # a cross through the center of the display. The shape of
  # the array must be of the form (height, width, color)
  a = np.zeros((240, 320, 3), dtype=np.uint8)
  lepton_buf = np.zeros((60, 80, 1), dtype=np.uint16)

  with picamera.PiCamera() as camera:
    camera.resolution = (640, 480)
    camera.framerate = 24
    camera.vflip = flip_v
    camera.start_preview()
    camera.zoom = (0.0, 0.0, 1.0, 1.0)
    # Add the overlay directly into layer 3 with transparency;
    # we can omit the size parameter of add_overlay as the
    # size is the same as the camera's resolution
    o = camera.add_overlay(a.tobytes(), size=(320,240), layer=3, alpha=int(alpha), crop=(0,0,80,60), vflip=flip_v)
    try:
        time.sleep(0.2) # give the overlay buffers a chance to initialize
        with Lepton(device) as l:
            last_nr = 0
            while True:
              _,nr = l.capture(lepton_buf)
              if nr == last_nr:
                # no need to redo this frame
                continue
              last_nr = nr
              cv2.normalize(lepton_buf, lepton_buf, 0, 65535, cv2.NORM_MINMAX)
              np.right_shift(lepton_buf, 8, lepton_buf)
              a[:lepton_buf.shape[0], :lepton_buf.shape[1], :] = lepton_buf
              o.update(a.tobytes())
    except Exception:
      traceback.print_exc()
    finally:
      camera.remove_overlay(o)

if __name__ == '__overlay__':
  from optparse import OptionParser

  usage = "usage: %prog [options] output_file[.format]"
  parser = OptionParser(usage=usage)
  
  parser.add_option("-f", "--flip-vertical",
                    action="store_true", dest="flip_v", default=False,
                    help="flip the output images vertically")

  parser.add_option("-a", "--alpha",
                    dest="alpha", default=128,
                    help="set lepton overlay opacity")

  parser.add_option("-d", "--device",
                    dest="device", default="/dev/spidev0.1",
                    help="specify the spi device node (might be /dev/spidev0.1 on a newer device)")

  (options, args) = parser.parse_args()
  
# Prepare video overlay function for multiprocessing  
p1=Process(target=overlay)

class untitled(App):
    def __init__(self, *args, **kwargs):
        #DON'T MAKE CHANGES HERE, THIS METHOD GETS OVERWRITTEN WHEN SAVING IN THE EDITOR
        if not 'editing_mode' in kwargs.keys():
            super(untitled, self).__init__(*args, static_file_path={'my_res':'./res/'})

    def idle(self):
        #idle function called every update cycle
        pass
    
    # Create main GUI features below
    def main(self):
        return untitled.construct_ui(self)
        
    @staticmethod
    def construct_ui(self):
        #DON'T MAKE CHANGES HERE, THIS METHOD GETS OVERWRITTEN WHEN SAVING IN THE EDITOR
        container0 = Container()
        container0.attr_class = "Container"
        container0.attr_editor_newclass = False
        container0.css_height = "250px"
        container0.css_left = "15px"
        container0.css_position = "absolute"
        container0.css_top = "165px"
        container0.css_width = "1000px"
        container0.variable_name = "container0"
        Videofeed = Button()
        Videofeed.attr_class = "Button"
        Videofeed.attr_editor_newclass = False
        Videofeed.css_font_size = "16px"
        Videofeed.css_height = "32px"
        Videofeed.css_left = "797px"
        Videofeed.css_position = "absolute"
        Videofeed.css_top = "217px"
        Videofeed.css_width = "200px"
        Videofeed.text = "Get Video Feed"
        Videofeed.variable_name = "Videofeed"
        container0.append(Videofeed,'Videofeed')
        button1 = Button()
        button1.attr_class = "Button"
        button1.attr_editor_newclass = False
        button1.css_font_size = "16px"
        button1.css_height = "32px"
        button1.css_left = "594px"
        button1.css_position = "absolute"
        button1.css_top = "217px"
        button1.css_width = "200px"
        button1.text = "Edit Alert Contacts"
        button1.variable_name = "button1"
        container0.append(button1,'button1')
        button2 = Button()
        button2.attr_class = "Button"
        button2.attr_editor_newclass = False
        button2.css_font_size = "16px"
        button2.css_height = "32px"
        button2.css_left = "391px"
        button2.css_position = "absolute"
        button2.css_top = "217px"
        button2.css_width = "200px"
        button2.text = "Regions of Interest"
        button2.variable_name = "button2"
        container0.append(button2,'button2')
        tablewidget0 = TableWidget()
        tablewidget0.attr_class = "TableWidget"
        tablewidget0.attr_editor_newclass = False
        tablewidget0.column_count = 3
        tablewidget0.css_display = "table"
        tablewidget0.css_float = "none"
        tablewidget0.css_font_size = "12px"
        tablewidget0.css_height = "100px"
        tablewidget0.css_left = "0px"
        tablewidget0.css_position = "absolute"
        tablewidget0.css_top = "1px"
        tablewidget0.css_width = "1000px"
        tablewidget0.row_count = 2
        tablewidget0.use_title = True
        tablewidget0.variable_name = "tablewidget0"
        container0.append(tablewidget0,'tablewidget0')
        opencvbitwiseand0 = OpencvBitwiseAnd()
        opencvbitwiseand0.attr_class = "OpencvBitwiseAnd"
        opencvbitwiseand0.attr_editor_newclass = False
        opencvbitwiseand0.css_height = "180px"
        opencvbitwiseand0.css_left = "843.265625px"
        opencvbitwiseand0.css_position = "absolute"
        opencvbitwiseand0.css_top = "455.125px"
        opencvbitwiseand0.css_width = "200px"
        opencvbitwiseand0.variable_name = "opencvbitwiseand0"
        container0.append(opencvbitwiseand0,'opencvbitwiseand0')
        opencvbitwiseand1 = OpencvBitwiseAnd()
        opencvbitwiseand1.attr_class = "OpencvBitwiseAnd"
        opencvbitwiseand1.attr_editor_newclass = False
        opencvbitwiseand1.css_height = "180px"
        opencvbitwiseand1.css_left = "795.0px"
        opencvbitwiseand1.css_position = "absolute"
        opencvbitwiseand1.css_top = "255.0px"
        opencvbitwiseand1.css_width = "200px"
        opencvbitwiseand1.variable_name = "opencvbitwiseand1"
        container0.append(opencvbitwiseand1,'opencvbitwiseand1')
        container0.children['Videofeed'].onclick.do(container0.children['opencvbitwiseand0']) #.p1.start() **  After the last bracket
        container0.children['opencvbitwiseand1'].on_new_image.do(container0.children['opencvbitwiseand0'].on_new_image_1_listener)


        self.container0 = container0
        return self.container0
    


#Configuration
configuration = {'config_project_name': 'untitled', 'config_address': '0.0.0.0', 'config_port': 8081, 'config_multiple_instance': True, 'config_enable_file_cache': True, 'config_start_browser': True, 'config_resourcepath': './res/'}

if __name__ == "__main__":
    # start(MyApp,address='127.0.0.1', port=8081, multiple_instance=False,enable_file_cache=True, update_interval=0.1, start_browser=True)
    start(untitled, address=configuration['config_address'], port=configuration['config_port'], 
                        multiple_instance=configuration['config_multiple_instance'], 
                        enable_file_cache=configuration['config_enable_file_cache'],
                        start_browser=configuration['config_start_browser'])
    

