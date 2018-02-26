
    var base64 = require('base-64');
//---------------------------------------------signup page call------------------------------------------------------

exports.signup = function(req, res){
 // console.log("signup");
    message = '';
    if(req.method == "POST"){
       var post  = req.body;
        //console.log(JSON.stringify(post))
       var name= post.user_name;
       var pass= post.password;
       var fname= post.first_name;
       var lname= post.last_name;
       var mob= post.mob_no;
       

       var encodedData = base64.encode(pass);
      // console.log(encodedData);
       db.beginTransaction(function(err) {
        if (err) { throw err; }
        db.query("INSERT INTO `users` (`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + encodedData + "')", function(err, result) {
          
          if (err) { 
            db.rollback(function() {
              throw err;
            });
          }
         
          var log = result.insertId;
       
          db.query('INSERT INTO log SET logid=?', log, function(err, result) {
            if (err) { 
              db.rollback(function() {
                throw err;
              });
            }  
            db.commit(function(err) {
              if (err) { 
                db.rollback(function() {
                  throw err;
                });
              }
              console.log('Transaction Complete.');
            });
          });
        });
      });
      /* End transaction */
     
        
        message = "Succesfully! Your account has been created.";
        res.render('signup.ejs',{message: message});
          
      //  });
    
 
    } else {
      res.render('signup');
    }
 };

  
 //-----------------------------------------------login page call------------------------------------------------------
 exports.login = function(req, res){
    var message = '';
    var sess = req.session; 
 
    if(req.method == "POST"){
       var post  = req.body;
       var name= post.user_name;
       var pass= post.password;
       console.log(name);
       console.log(pass);

      
      
       var encodedData = base64.encode(pass);
        var sql="SELECT id, first_name, last_name, user_name,password FROM users WHERE user_name= ? and password= ?";                        
        //console.log(sql);
        
        //console.log(encodedData);
        db.query(sql, [name,encodedData],function(err, rows){ 
                  console.log(rows);  
              
          if(rows.length){
             req.session.userId = rows[0].id;
             req.session.user = rows[0];
             console.log(rows[0].id);
             res.redirect('/home/dashboard');
          }
          else{
             message = 'Wrong Credentials.';
             res.render('index.ejs',{message: message});
          }
                  
       });
     
    } else {
       res.render('index.ejs',{message: message});
    }
            
 };
 //-----------------------------------------------dashboard page functionality----------------------------------------------
            
 exports.dashboard = function(req, res, next){
    console.log(req.session);        
    var user =  req.session.user,
    userId = req.session.userId;
    console.log(''+userId);
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
 
    db.query(sql, function(err, results){
       res.render('dashboard.ejs', {user:user});    
    });       
 };
 //------------------------------------logout functionality----------------------------------------------
 exports.logout=function(req,res){
    req.session.destroy(function(err) {
       res.redirect("/login");
    })
 };
 //--------------------------------render user details after login--------------------------------
 exports.profile = function(req, res){
 
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
    db.query(sql, function(err, result){  
       res.render('profile.ejs',{data:result});
    });
 };
 //---------------------------------edit users details after login----------------------------------
 exports.editprofile=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, results){
       res.render('edit_profile.ejs',{data:results});
    });
 };



 



 

