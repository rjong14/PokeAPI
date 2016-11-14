  var myUser = {
      User: "",

      find: function (id, callback) {
          var call_url = '/api/users/' + id;
          var User = '';
          $.getJSON(call_url, function (data) {
              User = data;
              if (callback)
                  callback(data);

          })
          return this;
      }

  }

  var detailhtml = "";
  var headerhtml = '';

  var getUser = function (user) {
      var call_url = '/api/users/' + user;

      myUser.find(user, function (data) {
          var roleselect = $('.hiddenhtml').html();
          headerhtml = '<span class="fa fa-pencil"></span>' + 'Edit ' + data.data.local.email;
          detailhtml = '<form class="input-group put-user" data-user="' + data.data._id + '">' + '<div class="input-group">' + '<label>Email</label>' + '<input name="email" class="form-control f-email" value="' + data.data.local.email + '"/></br>' + '<label>Password</label>' + '<input name="password" class="form-control f-password" value=""/></br>' + '<label>role current: ' + data.data.role.name + '</label>' + roleselect + '</div></br>' + '<button type="submit" class="btn btn-send btn-put">Send</button></form>';
          $(".usercrud").empty();
          $('.headinguser').html(headerhtml);
          $(".usercrud").html(detailhtml);

      })
  }

  var getLocation = function (loc) {
      var call_url = '/api/locations/' + loc;
      var Location = '';
      $.getJSON(call_url, function (data) {
          Location = data;

          console.log(data.data);

          headerhtml = '<span class="fa fa-pencil"></span>' + 'Edit ' + Location.data._id;
          detailhtml = '<form class="put-location input-group" data-location="' + Location.data._id + '">' + '<div class="input-group">' + '<label>lat</label>' + '<input name="lat" value="' + Location.data.latlng.lat + '" class="form-control"/><br/>' + '<label>lng</label>' + '<input name="lng" value="' + Location.data.latlng.lng + '" class="form-control"/><br/>' + '<label>pokeid</label>' + '<input name="pokeid" value="' + Location.data.pokeid + '" class="form-control"/><br/>' + '</div>' + ' <button type="submit" class="btn btn-put">Submit</button>' + '</form>';
          $(".locationcrud").empty();
          $('.headinglocation').html(headerhtml);
          $(".locationcrud").html(detailhtml);
      })

  }

  var newUser = function () {
      headerhtml = '<span class="fa fa-user-plus"></span>' + 'New User';
      $('.headinguser').html(headerhtml);

      var roleselect = $('.hiddenhtml').html();
      detailhtml = '<form class="post-user input-group">' + '<div class="input-group">' + '<label>Email</label>' + '<input name="email" value="" class="form-control"/><br/>' + '<label>Password</label>' + '<input name="password" value="" class="form-control"/><br/>' + '<label>Role</label>' + roleselect + '</div>' + ' <button type="submit" class="btn btn-send">Submit</button>' + '</form>';

      $(".usercrud").html(detailhtml);
  }

  var newLocation = function () {
      headerhtml = '<span class="fa fa-user-plus"></span>' + 'New Location';
      $('.headinglocation').html(headerhtml);

      detailhtml = '<form class="post-location input-group">' + '<div class="input-group">' + '<label>lat</label>' + '<input name="lat" value="" class="form-control"/><br/>' + '<label>lng</label>' + '<input name="lng" value="" class="form-control"/><br/>' + '<label>pokeid</label>' + '<input name="pokeid" value="" class="form-control"/><br/>' + '</div>' + ' <button type="submit" class="btn btn-send">Submit</button>' + '</form>';

      $(".locationcrud").html(detailhtml);
  }

  $(function () {
      'use strict'

      $(".post-user").submit(function (event) {
          $.post('/api/users/', $('.post-user').serialize());
          event.preventDefault();
          location.reload();
      });

      $(".post-location").submit(function (event) {
          console.log($('.post-location').serialize());
          $.post('/api/locations/', $('.post-location').serialize());
          event.preventDefault();
          location.reload();
      });


      $('.usercrud').on('click', '.btn-put', function () {


          var form = $('.usercrud').find('.put-user');
          var email = $('.usercrud').find('.f-email').val();
          var password = $('.usercrud').find('.f-password').val();
          var role = $('.usercrud').find('.f-role').val();
          var data = {email: '', pwd: '', role: ''};
          data.email = email;
          data.pwd = password;
          data.role = role;
          var id = form.attr('data-user');
          //var data = form.serialize();
          console.log("/api/users/" + id);
          console.log(data);
          $.ajax({
                  method: "PUT",
                  url: "/api/users/" + id,
                  data: data
              })
              .done(function (msg) {
                  alert("Data Saved: " + msg);
                  //location.reload();
              });
      });


      $('.locationcrud').on('click', '.btn-put', function () {


          var form = $('.locationcrud').find('.put-location')
          var id = form.attr('data-location');
          var data = form.serialize()
          console.log("/api/locations/" + id);
          console.log(data);
          $.ajax({
                  method: "PUT",
                  url: "/api/locations/" + id,
                  data: data
              })
              .done(function (msg) {
                  console.log("Data Saved: " + msg);
                  //location.reload();

              });
          getLocation(id);
      });

      $('.btn-newuser').on('click', function () {
          newUser();
      });

      $('.btn-newlocation').on('click', function () {
          newLocation();
      });

      $('.btn-delete-user').on('click', function () {
          var id = $(this).attr('data-user')
          $.ajax({
                  method: "DELETE",
                  url: "/api/users/" + id,
              })
              .done(function (msg) {
                  location.reload();
              });
      })

      $('.btn-delete-location').on('click', function () {
          var id = $(this).attr('data-location')
          $.ajax({
                  method: "DELETE",
                  url: "/api/locations/" + id,
              })
              .done(function (msg) {
                  location.reload();
              });
      })

      $('.user-list-item').on('click', function () {
          var elem = $(this);
          var id = elem.attr('data-user');
          getUser(id);


      })

      $('.location-list-item').on('click', function () {
          var elem = $(this);
          var id = elem.attr('data-location');
          getLocation(id);


      })

  })
