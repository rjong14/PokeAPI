    var getUser = function (user) {
        var call_url = '/api/users/' + user;

        var detailhtml = "";

        $.getJSON(call_url, function (data) {
                var roleselect = $('.hiddenhtml').html();
                detailhtml += '<form class="input-group put-user" data-user="'+data.data._id+'">'
                    + '<div class="input-group">'
                    + '<label>Email</label>'
                    + '<input name="email" class="form-control" value="'+ data.data.local.email +'"/></br>'
                    + '<label>role current: '+ data.data.role.name +'</label>'
                    + roleselect
                    + '</div></br>'
                    + '<button type="submit" class="btn btn-send btn-put">Send</button></form>';
            })
            .done(function () {
                $(".usercrud").empty();
                $(".usercrud").html(detailhtml);
            });
    }

    $(function () {
        'use strict'

        $( ".post-user" ).submit(function( event ) {
            $.post('/api/users/', $('.post-user').serialize());
            event.preventDefault();
            location.reload();
        });


        $('.usercrud').on('click', '.btn-put', function(){


            var form = $('.usercrud').find('.put-user')
            var id = form.attr('data-user');
            var data = form.serialize()
            console.log("/api/users/"+id);
            console.log(data);
            $.ajax({
                    method: "PUT",
                    url: "/api/users/"+id,
                    data: data
                })
                .done(function (msg) {
                    alert("Data Saved: " + msg);
                    location.reload();
                });
        });

        $('.btn-delete').on('click', function(){
            var id = $(this).attr('data-user')
                $.ajax({
                    method: "DELETE",
                    url: "/api/users/"+id,
                })
                .done(function (msg) {
                    alert("Data Saved: " + msg);
                    location.reload();
                });
        })

        $('.user-list-item').on('click', function () {
            var elem = $(this);
            var id = elem.attr('data-user');
            getUser(id);
        })

    })
