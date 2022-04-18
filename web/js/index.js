$(document).ready(function () {

    var images = "";

    setInterval(update, 5000);

    function update() {

        $.get("./recent")
        .done(function(response) { 
            if (response != "")
            {
                let json = JSON.parse(response);
                if (json[0].file == images)
                    return;

                insertImages(json[0].file);

                var currentdate = new Date(); 
                var datetime = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "&nbsp;"
                + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
                $('#update-time').html(datetime);
            }
        }).fail(function() { 
        });

        $.get("./temperature")
        .done(function(response) { 
            if (response != "")
            {
                let json = JSON.parse(response);

                setTemperature(json[0], json[1]);
            }
        }).fail(function() { 
        });
    }

    function insertImages(url) {
        for (let i = 4; i > 0; i--) {
            $('#img'+i+">img").attr('src', $('#img'+(i-1)+">img").attr('src'));
        }
        $('#img0>img').attr('src', $('#imgCurrent').attr('src'));
        $('#imgCurrent').attr('src',url);
        images = url;
    }

    function setTemperature(min, max) {
        $('#inp_min').val(min);
        $('#inp_max').val(max);
    }
});