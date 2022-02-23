# Infrared Thermal Imaging

## Setup
If this has been run on the raspberry-pi before, then you can skip this step. 

1. Install system prerequisites:
    ```bash
    sudo apt-get install python-opencv python-numpy
    ```

1. Install the `pylepton` package:
    ```bash
    cd /tmp
    git clone https://github.com/groupgets/pylepton.git
    cd pylepton
    pip install .
    ```

1. Enable the spi on the raspberry pi.
    1. Run `sudo raspi-config`
    1. Navigate to "Interface Options"->"SPI" 
    1. Select "Yes"
    1. Select "Finish"

1. Increase the bufsize of the spi device
    Edit the file `/boot/cmdline.txt` (make sure to use `sudo`)
    
    Add `spidev.bufsiz=131072` to the end of the file. Make sure that everything is on *one line*. 
    It should look like this:
    ```
    console=tty1 root=PARTUUID=336afa3f-02 rootfstype=ext4 fsck.repair=yes rootwait spidev.bufsiz=131072
    ```

1. Reboot the device

## Files
- ax8.py: Captures images from the FLIR AX8
- camera.py: Captures a single image from the thermal and NoIR cameras.
- calibrate.py: Captures and displays images from the thermal and NoIR every 0.5s. 
   This code can be used to calibrate the camera, but is too slow for the RPI. 
- old/ : Code from the previous team's senior design team. 
