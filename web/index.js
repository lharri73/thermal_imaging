$(document).ready(function () {
    $('#link').click(function () { 
        navigator.clipboard.writeText($('#link').html());
        alert("Copied the link !");
    });

    let url_folder = $('#url_folder').val();
    let file_type = $('#file_type').val();
    let last_img = $('#last_img').val();
    let num_img = last_img.substring(0, last_img.length - file_type.length - 1) * 0;
    setInterval(update, 5000);

    function update() {
        num_img = parseInt($('#img_current').val());
        let url = url_folder+"\\"+ (parseInt(num_img) + 1) + "." + file_type;
        $.get("./checkFile.php?url="+url)
        .done(function(response) { 
            if (response != 0)
            {
                for (let i = 4; i > 0; i--) {
                    $('#img'+i+">img").attr('src', $('#img'+(i-1)+">img").attr('src'));
                }
                $('#img0>img').attr('src', $('#imgCurrent').attr('src'));
                $('#imgCurrent').attr('src', "./checkFile.php?url="+url);

                var currentdate = new Date(); 
                var datetime = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "&nbsp;"
                + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
                $('#update-time').html(datetime);

                $('#img_current').val(num_img + 1);
            }
        }).fail(function() { 
        });
    }
});