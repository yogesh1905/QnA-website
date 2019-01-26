$(document).ready(function(){

  $('form').on('submit', function(){ // when submit button is pressed a request to /todo url is made which is handled by the todoController file

      var item = $('form input');
      var todo = {item: item.val()};
      $.ajax({
        type: 'POST',
        url: window.location.href,
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });

  $('li').on('click', function(){
      var item = $(this).text().replace(/ /g, "-");
      $.ajax({
        type: 'DELETE',
        url: window.location.href + '/' + item,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

  $('#logout').on('click', function(){
      alert("logged out successfully!!!");
  });


});
