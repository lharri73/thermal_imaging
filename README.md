# Infrared Thermal Imaging

In this project, we create a low-cost thermal monitoring system using a Raspber Pi, a NoIR camera, and a FLIR Lepton thermal imaging sensor.
We use OpenCV and Python to fuse these two image modalities, and allow the user to specify regions of interest to monitor within the image. 
This project features a basic web interface that displays the 6 most recent images, allows the user to specify regions of interest, and shows the min, max, and
mean temperature of each region. The max temperature of each region is stored within a databse, hosted locally on the Raspberry pi, and can easily be
connected to a larger data monitoring system. 


## Setup
If this has been run on the raspberry-pi before, then you can skip this step. 

1. Install system prerequisites:
    ```bash
    sudo apt-get install python-opencv python-numpy
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

1. Install python requirements:
    ```bash
    python3 -m pip install -r requirements.txt
    ```

1. Setup the database
    ```bash
    mysql -u root < database/init.sql
    ```

1. Start the server!
    ```bash
    cd web && ./start.sh
    ```
    
    The webserver will be available at port 8000 of the device running the `start.sh` script. 
