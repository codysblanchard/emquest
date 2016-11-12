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
const app = require('express')();
const pallette = require('./bgpallettes');
const mysql = require('node-mysql');

var db;
var user;
const testing=true;
const commandForm = "<form method='get'><input name='Body' onload='this.focus();'><input type='hidden' name='From' value='5033125056'></form>";
const br="\n";
var isTwilio=false;
var encounters;
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
});
mysqlconnection.add({
   name:'users',
    idFieldName:'phone',
    Row:{},
    Table:{}
});
const Users = mysqlconnection.get('users');

var port = process.env.PORT || 3000;
app.listen(port,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
    isTwilio = !_.isEmpty(req.query.MessageSid);
    userInput(req.query.Body,res,req.query.From);
});


function userInput(input,res,phone){
    input=input.toLowerCase();
    db.query("select * from users where phone=?",[phone],(e,r,f)=>{
        if(_.isEmpty(r)){
            console.log('new user...');
            var xory=_.range(0,1);
            var x = xory ? _.random(0,config.dimensionx) : 0;
            var y = !xory ? _.random(0,config.dimensiony) : 0;
            db.query("INSERT INTO users SET ?",
                {
                    phone:phone,
                    x:x,
                    y:y
                },
                (e,r)=>{
                    //console.log()
                    user=r[0];
                    Zone.get(x,y,lang.welcome,_.partialRight(reply,res));
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

            if(user.x<0 || user.y<0){
                if(user.x<0)user.x=0;
                if(user.y<0)user.y=0;
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
                            cb(this.render(z[0],msg+lang.edge+br));
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
                            layout: _.replace(this.build({bg: [_.sample(myPallette), _.sample(myPallette), _.sample(myPallette)]}), /\:/g, '')
                        };
                        var q = db.query(
                            "insert into zones set ?",
                            zone,
                            (e, r, f)=> {
                                cb(this.render(zone,msg));
                            }
                        )
                    }
                });
            }
            else {
                cb(this.render(r[0],msg));
            }
        });
    },
    getEncounter:function(x,y,fatigue){

    },
    render:function(data,msg){
        var rarity = _.random(0,400);
        var encounter = _.sample(_.filter(encounters,(n)=>{return parseInt(n.rarity,10) > rarity}));

        var layout = _.map(_.split(data.layout,"\n"),function(l){return _.split(l,'')});
        if(!_.isEmpty(encounter)){
            layout[1][4]=encounter.emoji;//emoji.get('slightly_smiling_face');
            layout[1][1]=encounter.face;//emoji.get('scorpion');
            msg+=encounter.text+br;
        }else layout[1][1]=emoji.get('slightly_smiling_face');
        return msg+_.map(layout,(l)=>{return l.join('')}).join(br);
    },
    build:function(data){//backdrop,player,encounter){
        var tiles=[];
        for(var i=0;i<3;i++){
            tiles[i]=[];
            for(var j=0;j<6;j++){
                tiles[i][j]=emoji.get(_.sample(data.bg));
            }
        }
        if(!_.isEmpty(data.emoji))tiles[1][4]=emoji.get(data.emoji);
        if(!_.isEmpty(data.face))tiles[1][1]=emoji.get(data.face);
        return _.map(tiles,(t)=>{return t.join('')}).join(br);
    }
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
