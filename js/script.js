$(document).ready(function() {
    $("#intro1").typed({
        strings: ["Hello World, Meet "],
        typeSpeed: 15,
        showCursor: false
    });
    setTimeout(function(){
        $("#intro2").typed({
            strings: ["Guavascript."],
            typeSpeed: 15,
            showCursor: false
        });
    }, 1230);
});