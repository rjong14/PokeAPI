    var getUser = function (user) {
        console.log(user);
        var call_url = '/api/users/' + user;
        console.log(call_url);

        var detailhtml = "";

        $.getJSON(call_url, function (data) {
                console.log("json");
                console.log(data.data.local.email);
                detailhtml += '<form ng-submit="submitCategory()" class="input-group">'
                    + '<div class="input-group"><label>Email</label>'
                    + '<input value="'+ data.data.local.email +'"/>'
                    + '</div>'
                    + '<button type="submit" class="btn btn-send">Send</button>< /form>';
            })
            .done(function () {
                console.log('done');
                $(".usercrud").empty();
                $(".usercrud").html(detailhtml);
            });
    }

    $(function () {
        'use strict'

        $('.user-list-item').on('click', function () {
            console.log('click');
            var elem = $(this);
            var id = elem.attr('data-user');
            getUser(id);



        })

    })
