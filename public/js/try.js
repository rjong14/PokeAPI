console.log(" _______ ");
console.log("|__   __| ");
console.log("    | |_ __ _   _ ");
console.log("    | | '__| | | |");
console.log("    | | |  | |_| |");
console.log("    |_|_|   \\__, |");
console.log("             __/ |");
console.log("            |___/ ");

var update = function (call) {
    jQuery('#interactive').val(call);
    interactive_call();
    hljs.initHighlightingOnLoad();
}

var interactive_call = function () {
    var content = jQuery('#interactive').val()
    if (content == '') {
        content = '';
    }
    var call_url = '/api/' + content;
    $.ajax({
        dataType: 'json'
        , url: call_url
        , context: document.body
    }).complete(function (data) {
        if (data['status'] == 200) {
            var d = jQuery.parseJSON(data['responseText']);
            $('#interactive_output').text(JSON.stringify(d, null, '\t'));
        } else if (data['status'] == 404) {
            $('#interactive_output').text(data['status'] + ' ' + data['statusText']);
        }
    });
}
