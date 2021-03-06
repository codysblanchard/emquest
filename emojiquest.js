/*
TODO
define zones for different bg tiles
    could be simple as overlapping rings of tile possibilities
    or some map generator algorithm?
    32 emoji pallette for BGs

create some encounters and probability system
 */

const _ = require('lodash');
const emoji = require('node-emoji');
const config = require('./config');
const lang = require('./lang');
const twilio = require('twilio')(config.accountSid, config.authToken);
const express = require('express');
const bodyParser=require('body-parser')
const app = express();
const pallette = require('./bgpallettes');
const mysql = require('node-mysql');
const fs = require('fs');
const mapper = require('./mapgen')
const renderer = {};//require('./renderer')
const encounterer = require('./encounters')

var db;
var user;
const testing=true;
const commandForm = "<form method='get'><input name='Body' onload='this.focus();'><input type='hidden' name='From' value='5033125056'></form>";
const br="\n";
var isTwilio=false;
var encounters;
var startingPoints=[];
const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
})

mysqlconnection.connect((connection)=>{
    db=connection;
    db.query("select * from encounters",(e,r)=>{
        encounters=r;
    });
    db.query("SELECT x,y FROM map WHERE val!=0 AND (X<5 OR Y<5)",(e,r)=>{
        startingPoints=r;
    });
},(error)=>{
  console.log(error);
});
mysqlconnection.add({
   name:'users',
    idFieldName:'phone',
    Row:{},
    Table:{}
});
const Users = mysqlconnection.get('users');

var port = process.env.PORT || 3000;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Content-Type','application/json');
  next();
});

app.use(bodyParser.json({
    limit:'50mb',
    extended:true
  }
));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit:'50mb'
}));

app.listen(port,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
    isTwilio = !_.isEmpty(req.query.MessageSid);
    userInput(req.query.Body,res,req.query.From);
});
app.get('/admin',(req,res)=>{
  fs.readFile('./templates/admin.html',(e,f)=>{
    res.send(f.toString());
  });
})
app.get('/public/*',(req,res)=>{
  fs.readFile("./"+req.url,(e,f)=>{
    res.send(f.toString());
  });
});
app.get('/api/map/get',(req,res)=>{
  mapper.getMap((map)=>{
    res.send(map);
  });
})
app.get('/api/palette/get',(req,res)=>{
  mapper.getPalette((palette)=>{
    res.send(palette);
  });
})
app.post('/api/map/save',(req,res)=>{
  mapper.saveMap(req.body.mapData,(r)=>{
    res.end(JSON.stringify({status:true}))
  })
})
app.get('/api/map/gen',(req,res)=>{
  res.send(mapper.genMap());
})
app.get('/api/encounters/get',(req,res)=>{
  encounterer.getAll((r)=>{
    res.send(r)
  })
})
app.post('/api/encounters/save',(req,res)=>{
  encounterer.save(req.body.encounter,(r)=>{
    res.send(r)
  })
})
app.get('/api/users/get',(req,res)=>{
  db.query("select * from users",(e,r)=>{
    res.send(r);
  })
})

function userInput(input,res,phone){
    input=input.toLowerCase();
    db.query("select * from users where phone=?",[phone],(e,r,f)=>{
        if(_.isEmpty(r)){
            console.log('new user...');
            var start = _.sample(startingPoints);
            var newuser={
                phone:phone,
                x:start.x,
                y:start.y
            };
            db.query("INSERT INTO users SET ?",
                newuser,
                (e,r)=>{
                    user=newuser;
                    Zone.get(start.x,start.y,[0,0],lang.welcome+br,_.partialRight(reply,res));
                }
            );
        }
        else{
            user=r[0];
            var msg='';
            var command = _.words(input);
            var dir=[0,0];
            if(_.includes(command,'north'))dir=[0,-1];
            if(_.includes(command,'east'))dir=[1,0];
            if(_.includes(command,'south'))dir=[0,1];
            if(_.includes(command,'west'))dir=[-1,0];

            user.x+=dir[0];user.y+=dir[1];

            if(user.x<1 || user.y<1){
                if(user.x<1)user.x=1;
                if(user.y<1)user.y=1;
                msg=lang.edge;
            }

            Zone.get(user.x,user.y,dir,msg,(response)=>{
                var q = db.query("update users set ? where id=?",[user,user.id],(e,r,f)=>{
                    //console.log(e,r,f);
                });
                reply(response,res);
            });

            //console.log(q.sql);
        }


    });
}


const Zone = {
    content:'',
    tiles:[],
    output:function(){

    },
    get:function(x,y,dir,msg,cb){
        //msg = "X"+user.x+"Y"+user.y+" F"+user.fatigue+br;//msg+br;

        db.query('select * from zones where x=? and y=?',[x,y],(e,r)=>{
            if(_.isEmpty(r)){
                db.query('select * from map where x=? and y=?',[x,y],(e,m)=>{
                    if(_.isEmpty(m) || parseInt(m[0].val,10)===0){
                        user.x-=dir[0];
                        user.y-=dir[1];
                        db.query("select * from zones where x=? and y=?",[user.x,user.y],(e,z)=>{
                            cb(renderer.render(z[0],msg+lang.edge+br));
                        });
                    }
                    else {
                        var myPallette = _.map(_.filter(pallette, (p)=> {
                            return m[0].val >= p.min && m[0].val <= p.max
                        }), 'emoji');
                        //console.log(myPallette);
                        var zone = {
                            x: x,
                            y: y,
                            layout: _.replace(renderer.build({bg: [_.sample(myPallette), _.sample(myPallette), _.sample(myPallette)]}), /\:/g, '')
                        };
                        //console.log(zone);
                        var q = db.query(
                            "insert into zones set ?",
                            zone,
                            (e, r, f)=> {
                                cb(renderer.render(zone,msg));
                            }
                        )
                    }
                });
            }
            else {
                cb(renderer.render(r[0],msg));
            }
        });
    },
    getEncounter:function(x,y,fatigue){

    },

};

function reply(output,res){
    if(!isTwilio){
        res.send(commandForm+_.replace(output,/\n/g,"<br />"));
    }
    else{
        res.send('<?xml version="1.0" encoding="UTF-8" ?>'+
            '<Response>'+
                '<Message>'+output+'</Message>'+
            '</Response>'
    );
        /*
        var options = {
            to: user.phone,
            from: config.twilioNumber,
            body: output
        };

        // Send the message!
        twilio.sendMessage(options, function(err, response) {
            if (err) {
                // Just log it for now
                console.error(err);
            } else {
                // Log the last few digits of a phone number
                var masked = user.phone.substr(0,user.phone.length - 5);
                masked += '*****';
                console.log('Message sent to ' + masked);
            }
        });
        */
    }
}
