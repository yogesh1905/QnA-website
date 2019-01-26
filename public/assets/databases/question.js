var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/qapp', {useNewUrlParser: true});
var questionSchema=new mongoose.Schema({
    askedby:String,
    name:String,
    answers:[{by:String,ans:String,upvotedby:[String]}],
    numberOfFollowers:Number
});
var question=new mongoose.model('Question',questionSchema);

module.exports=question;