var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//Connect to database
mongoose.connect('mongodb://localhost/qapp', { useNewUrlParser: true });

var MongoClient = require('mongodb').MongoClient,assert = require('assert');

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    user: String,
    item: String
});

//Create a schema for users
var userSchema = new mongoose.Schema({
    username: String,
    name:String,
    password: String,
    profession: String,
    email: String,
    followers:[String],
    following:[String],
    college: String,
    interests: String
});

var User = new mongoose.model('user', userSchema);

var urlencodedParser = bodyParser.urlencoded({extended: false});

var question=require('../public/assets/databases/question.js');

//res.cookie(name, id);
module.exports = function(app){



    app.get('/qapp/viewprofile/:name', function(req, res){
        User.findOne({username: req.params.name}, function(err, obj){
            if(err)
                throw err;
            res.render('viewprofile', {user: obj});
        });

    });
    
    app.use('/qapp/:name', function(req, res, next){

        if(req.cookies.name == null || req.cookies.id == null)
            res.render('notlogged');
        User.findOne({username: req.cookies.name}, function(err, obj){
            if(obj == null)
                res.render('notlogged');
            else if(obj._id == req.cookies.id)
                next();
            else
                res.render('notlogged');
        });
        
    });
    
    
    app.get('/qapp/:name/followers', function(req, res){
        User.findOne({username: req.params.name}, function(err, obj){
            var obj1=obj.toObject();
            var data = [];
            var name={name:req.params.name};
            for(var i=0;i<obj1.followers.length;i++)
                data.push(obj1.followers[i]);
            res.render('followers', {arr: data,name:name});
        });
   });

    app.get('/qapp/:name/following', function(req, res){
        User.findOne({username: req.params.name}, function(err, obj){
            var data = [];
            var obj1=obj.toObject();
            for(var i=0;i<obj1.following.length;i++)
                data.push(obj1.following[i]);
                var name={name:req.params.name};
            res.render('following', {arr: data,name:name});
        });
    });

    //Search bar for users
    app.post('/search/user', urlencodedParser, function(req, res){
        if(req.body.qry === "")
        {
            res.send([]);
        }
        else{
            User.find({username: {$regex: req.body.qry, $options: 'i'}}, function(err, obj){
                res.send(obj);  
            });
        }
    });
    

    //When the follow button is pressed for the :name user by the current user, this post request is made
    app.post('/qapp/viewprofile/:name', urlencodedParser, function(req, res){
        
        if(req.cookies.name === null)
            res.render('notlogged');
        
        else
            {
                User.findOne({username: req.cookies.name}, function(err, obj){
                if(err)
                    throw err;
                var temp = obj.following;     
                var isFound = temp.indexOf(req.params.name);
                if(isFound === -1){
                    temp.push(req.params.name);
                    User.findOneAndUpdate({username: req.cookies.name}, {following: temp}, function(err, obj){
                        if(err)
                            throw err;
                        User.findOne({username: req.params.name}, function(err, obj){
                            if(err) throw err;
                            var currFollowers = obj.followers;
                            currFollowers.push(req.cookies.name);
                            User.findOneAndUpdate({username: req.params.name}, {followers: currFollowers}, function(err, obj){
                                if(err)
                                    throw err;
                                res.redirect('/qapp/' + req.cookies.name);
                            });
                        });
                    });
                }
                else
                {
                    res.redirect('/qapp/' + req.cookies.name);    
                }

            });
        };

    });


    
    
    app.get('/qapp/:name/:qid/answer',function(req,res){
        question.find({_id:req.params.qid},function(err,obj){
            if(err) throw err;
            var name={name:req.params.name};
            res.render('answer',{name:name,arr:obj});
        });
    });

    app.post('/search', urlencodedParser, function(req,res){
        question.find({name: {$regex: req.body.qry, $options: 'i'}}, function(err, obj){
            var p={arr:obj};
            var result = {obj: obj, name: req.cookies.name};
            res.send(result);    
        });
    });
    
    app.get('/home', function(req, res){
        res.render('home');
    });
    
    app.get('/login', function(req, res){
        res.render('login');
    });
    
    app.get('/qapp/:name/ask',function(req,res)
    {
        var name={name:req.params.name};
        res.render('ask',{name:name});
    });
    
    app.post('/qapp/:name/ask',urlencodedParser ,function(req,res)
    {
        var qname=req.body.q;
        var name={name:req.params.name};
        question.findOne({name: qname,askedby:req.params.name}, function(err, obj){
            if(err) throw err;
            if(obj === null){
                var newq = {
                    name:qname,
                    askedby:req.params.name
                };
                question(newq).save(function(err, data){
                    if(err) throw err;
                    //res.render('ask',{name:name});
                    res.redirect('/qapp/' + req.params.name);    
                });
            }
            else
            res.redirect('/qapp/' + req.params.name);
        });
    });
    
    app.get('/signup', function(req, res){
        res.render('signup');
    });

    app.get('/qapp/:name/details', function(req, res){
        res.render('details', {name: req.params.name});   // Instead of passing an object(previously what I believed) you can just pass attributes directly
    });



    app.get('/qapp/:name', function(req, res){
        
        question.find({},function(err,obj)
        {    
            if(err) throw err;
            var name={name:req.params.name};
            var question={arr:obj};
            res.render('feedn',{arr:obj,name:name});    
        });;
    });
    
    app.post('/home', urlencodedParser, function(req, res){
        res.clearCookie('id');    //To clear cookie after logout
        res.clearCookie('name');
        res.redirect('/home');
    });
    
    app.post('/qapp/:name', urlencodedParser, function(req, res){
        var newUser = req.body;
        User.findOneAndUpdate({username: req.params.name}, {name: newUser.name, profession: newUser.prof,email:newUser.email,college: newUser.college, interests: newUser.intrests}, function(err, obj){
            if(err) throw err;
            res.redirect('/qapp/' + req.params.name);
        });
    });
        
    

    app.post('/login', urlencodedParser, function(req, res){
        var newLogin = req.body;
        var data = {error: false, username: newLogin.username, password: newLogin.password};
        User.findOne({username: newLogin.username, password: newLogin.password}, function (err, obj){
            if(err)
                throw err;
            if(obj === null){
                data.error = true;
            }
            else{
                res.cookie('id', obj._id);
				res.cookie('name', obj.username);
				res.cookie('dbs brolly',"Is available on youtube XD");
            }
            res.json(data);    
        });
        
    });
    
    app.post('/qapp/:name/details', urlencodedParser, function(req, res){
        var newLogin = req.body;
        var data = {error: false, username: newLogin.username, password: newLogin.password};
        User.findOne({username: newLogin.username, password: newLogin.password}, function (err, obj){
            if(err)
                throw err;
            if(obj === null){
                data.error = true;
            }
            res.json(data);
        });
        
    });
    

    app.post('/signup', urlencodedParser, function(req, res){
        var userInfo = {error: false, username: req.body.username, password: req.body.password};
       //To check the data returned
        User.findOne({username: req.body.username}, function(err, obj){
            if(err) throw err;
            if(obj === null){
                var newUser = User(userInfo).save(function(err, data){
                    if(err) throw err;
                    res.cookie('id', data._id);
                    res.cookie('name', data.username);
                    res.json(userInfo);

                    });
            }
            else
            {

                userInfo.error = true;
                res.json(userInfo);

            }

        });
    });

    app.post('/qapp/:name/:qid/:ansid/upvote', urlencodedParser, function(req, res){
        question.findOne({_id: req.params.qid}, function(err, obj){
            if(err) throw err;
            var temp = obj.answers;
            var ind = -1;
            for(var i=0;i<temp.length;i++){
                if(temp[i]._id == req.params.ansid)
                    ind = i;
            }
            
            var flag = false;
            for(var i=0;i<obj.answers[ind].upvotedby.length;i++){
                if(obj.answers[ind].upvotedby[i] == req.params.name)
                    flag = true;
            }
            
            if(!flag){
                obj.answers[ind].upvotedby.push(req.params.name);

            }
            else{
                var tmpArr = [];
                
                for(var i=0;i<obj.answers[ind].upvotedby.length;i++){
                    if(obj.answers[ind].upvotedby[i] != req.params.name)
                        tmpArr.push(obj.answers[ind].upvotedby[i]);
                
                }
                obj.answers[ind].upvotedby = tmpArr;
                
            }

            question.findOneAndUpdate({_id: req.params.qid}, {answers : obj.answers}, function(err, obj){
                if(err) throw err;
                res.send({});
            });
        
            

        });
    });
    
    app.post('/qapp/:name/:qid/answer',urlencodedParser,function(req,res){
        question.find({_id:req.params.qid},function(err,obj){
    
            if(err) throw err;
            var name={name:req.params.name};
            var answer=req.body.answer;
            obj[0].answers.push({by:req.params.name,ans:answer});
            question.findOneAndUpdate({_id:req.params.qid},{answers:obj[0].answers},function(err,obj){
                if(err) throw err;
                res.redirect('/qapp/'+name.name);
            });
            
        });
    
    });

    app.use('/', function(req, res, next){
        res.render('404');
    });

}