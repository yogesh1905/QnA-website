
$(document).ready(function () {
  $('form').on('submit', function () { // when submit button is pressed a request to /login url is made which is handled by the todoController file
    var info = { username: $('#foo').val(), password: $('#bar').val() };
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: info,
      dataType: 'json',
      success: function (result) {
        if (result.error === false) {
          var str = '/qapp/' + result.username + "/details";
          document.location.replace(str);
        }
        else {
          usernameTag = document.getElementById('invalidUsername');
          usernameTag.setAttribute("style", "visibility: visible;");
          usernameTag.innerHTML = 'Username already taken';

          inputTags = document.getElementsByTagName('input');
          inputTags[0].setAttribute('style', 'border: 1px solid red;');

        }
      }
    });

    return false;

  });

});