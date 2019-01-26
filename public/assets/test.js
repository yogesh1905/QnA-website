$(document).ready(function(){
    $('#sea').keyup(function(){
        
        var entered = {qry: $('#sea').val()};
        $.ajax({
            type:'POST',
            url:'/search',
            data: entered,
            success:function(result){
                $('#result').html('');
                for(var i=0;i<result.length;i++)
                {
                    $('#result').append('<a class="list-group-item >'+result[i]+'</a>');
                }
            }
        });
        return false;
    });
});