<?php
    if (!isset($_GET['url']))
        return;
    
    if (file_exists($_GET['url']))
    {
        $type = 'image/jpeg';
        header('Content-Type:'.$type);
        header('Content-Length: ' . filesize($_GET['url']));
        $img = file_get_contents($_GET['url']);
        echo $img;

        exit();
        return;
    }
    echo "0";