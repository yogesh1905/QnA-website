$(document).ready(function(){
  $('form').on('submit', function(){ // when submit button is pressed a request to /login url is made which is handled by the todoController file
    var info={username: $('#foo').val(), password: $('#bar').val()};
    $.ajax({
      type: 'POST',
      url: '/login',
      data: info,
      dataType: 'json',
      success: function(result){
            if(result.error === false){
              var str = '/qapp/' + result.username;
              document.location.replace(str);
            }
            else
            {
                usernameTag = document.getElementById('invalidUsername');
                usernameTag.innerHTML = 'Username is Invalid';
                usernameTag.setAttribute("style", "visibility: visible;");
                passwordTag = document.getElementById('invalidPassword');
                passwordTag.innerHTML = 'Password is Invalid';
                passwordTag.setAttribute("style", "visibility: visible;");
                inputTags = document.getElementsByTagName('input');
                for(var i=0;i<inputTags.length;i++)
                {
                  inputTags[i].setAttribute('style', 'border: 1px solid red;');
                }

            }
      }

    });
    return false;
    
  });

});
