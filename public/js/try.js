console.log(" _______ ");
console.log("|__   __| ");
console.log("    | |_ __ _   _ ");
console.log("    | | '__| | | |");
console.log("    | | |  | |_| |");
console.log("    |_|_|   \\__, |");
console.log("             __/ |");
console.log("            |___/ ");

const tri = {
        update: function (call) {
        jQuery('#interactive').val(call);
        this.interactive_call();
    },
        interactive_call: () => {
        let content = jQuery('#interactive').val()
        if (content == '') {
            content = '';
        }
        let call_url = '/api/' + content;
        $.ajax({
            dataType: 'json'
            , url: call_url
            , context: document.body
        }).complete(function (data) {
            if (data['status'] == 200) {
                let d = jQuery.parseJSON(data['responseText']);
                let elem = $('#interactive_output');
                elem.text(JSON.stringify(d, null, '\t'));
                  $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                  });
            } else if (data['status'] == 404) {
                $('#interactive_output').text(data['status'] + ' ' + data['statusText']);
            }
        });
    }
}
