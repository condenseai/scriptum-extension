
$(document).ready(function () {
    $('#submit').click(function (e) {
    console.log("submitting");
        var fd = new FormData(document.getElementById("form"));
        var object = {};
        fd.forEach(function(value, key){
            object[key] = value;
        });
        console.log("calling algorithmia on " + object["content"]);
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000',
            data: JSON.stringify(object),
            contentType: "application/json",
            dataType: "json",
            success: function(data){$('#output').html(data);},
            failure: function(errMsg) {console.err(errMsg);}
        });
    });
});