var myUser = {
	    User: "",

        find: function (id, callback) {
            var call_url = '/api/users/' + id;
            var User='';
            $.getJSON(call_url, function (data) {
                User = data;
               if(callback)
                   callback(data);

            })
            return this;
        }

}

    var detailhtml = "";
    var headerhtml = '';

    var getUser = function (user) {
        var call_url = '/api/users/' + user;

        myUser.find(user, function(data){
                var roleselect = $('.hiddenhtml').html();
                headerhtml = '<span class="fa fa-pencil"></span>'
                    + 'Edit ' + data.data.local.email;
                detailhtml = '<form class="input-group put-user" data-user="'+data.data._id+'">'
                    + '<div class="input-group">'
                    + '<label>Email</label>'
                    + '<input name="email" class="form-control" value="'+ data.data.local.email +'"/></br>'
                    + '<label>role current: '+ data.data.role.name +'</label>'
                    + roleselect
                    + '</div></br>'
                    + '<button type="submit" class="btn btn-send btn-put">Send</button></form>';
                $(".usercrud").empty();
                $('.headinguser').html(headerhtml);
                $(".usercrud").html(detailhtml);

        })
    }

    var newUser = function () {
        headerhtml = '<span class="fa fa-user-plus"></span>'
                    + 'New User';
        $('.headinguser').html(headerhtml);

        var roleselect = $('.hiddenhtml').html();
        detailhtml = '<form class="post-user input-group">'
              + '<div class="input-group">'
                + '<label>Email</label>'
                + '<input name="email" value="" class="form-control"/><br/>'
                + '<label>Password</label>'
                + '<input name="password" value="" class="form-control"/><br/>'
                + '<label>Role</label>'
                + roleselect
              + '</div>'
               +' <button type="submit" class="btn btn-send">Submit</button>'
            + '</form>';

            $(".usercrud").html(detailhtml);
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

        $('.btn-newuser').on('click', function(){

                newUser();
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
