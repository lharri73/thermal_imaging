<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="./img/favicon.jpg" type="image/x-icon">
    <title>Camera</title>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="./index.css">
    <script src="./index.js"></script>
</head>

<body>
<?php
    $host = "http://" . getHostByName(php_uname('n'));
    $folder =  getcwd();
    $folder = explode('htdocs', $folder)[1];
    $host .= $folder;
    $host = str_replace("\\", "/", $host);

    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $config = parse_ini_file("setting.ini");

    $num = glob($config['URL']. "\\*." . $config['TYPE']);
    usort($num, function ($a, $b)
    {
        return filectime($a) > filectime($b) ? 1 : -1;
    });

    

    if (count($num) == 0)
    {
        echo "<h1>Photo not found !</h1>";
        return;
    }
    $last_img = basename($num[count($num)-1]);

?>
    <input type="hidden" id="url_folder" value="<?= $config['URL'] ?>">
    <input type="hidden" id="file_type" value="<?= $config['TYPE'] ?>">
    <input type="hidden" id="last_img" value="<?= $last_img ?>">
    <input type="hidden" id="img_current" value="<?= substr($last_img, 0, (strlen($last_img) - strlen($config["TYPE"]) - 1)) ?>">
    <div class="link"><div id="link"><?= $host ?></div></div>
    <div class="home">
        <div class="show">
            <img src="./checkFile.php?url=<?= $num[count($num)-1] ?>" alt="" id="imgCurrent">
        </div>
        <div class="update-time">Update time : <label id="update-time"><?= date ("H:i:s d/m/Y") ?></label></div>
        <div class="list">
            <div class="item" id="img0"><img src="./checkFile.php?url=<?= $num[count($num)-1] ?>" alt=""></div>
            <div class="item" id="img1"><img src="./checkFile.php?url=<?= $num[count($num)-1] ?>" alt=""></div>
            <div class="item" id="img2"><img src="./checkFile.php?url=<?= $num[count($num)-1] ?>" alt=""></div>
            <div class="item" id="img3"><img src="./checkFile.php?url=<?= $num[count($num)-1] ?>" alt=""></div>
            <div class="item" id="img4"><img src="./checkFile.php?url=<?= $num[count($num)-1] ?>" alt=""></div>
        </div>
    </div>
    
</body>
</html>
