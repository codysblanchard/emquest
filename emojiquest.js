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
const commandForm = "<form method='get'><input name='command' onload='this.focus();'><input type='hidden' name='phone' value='5033125056'></form>";
const br="\n";

console.log(process.env.JAWSDB_MARIA_URL);
if(_.isEmpty(process.env.JAWSDB_MARIA_URL)) {
    var mysqlconnection = new mysql.DB({
        host: config.dbhost,
        user: config.dbuser,
        password: config.dbpassword,
        database: config.database
    })
}
else{
    var mysqlconnection = new mysql.createConnection(process.env.JAWSDB_MARIA_URL);
}

mysqlconnection.connect((connection)=>{db=connection});
mysqlconnection.add({
   name:'users',
    idFieldName:'phone',
    Row:{},
    Table:{}
});
const Users = mysqlconnection.get('users');

app.listen(3000,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
    userInput(req.query.command,res,req.query.phone);
});


function userInput(input,res,phone){
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
            if(_.includes(command,'north'))user.y--;
            if(_.includes(command,'east'))user.x++;
            if(_.includes(command,'south'))user.y++;
            if(_.includes(command,'west'))user.x--;

            if(user.x<0 || user.y<0){
                if(user.x<0)user.x=0;
                if(user.y<0)user.y=0;
                msg="Can't go that way. It's the edge of the forest.";
            }

            var q = db.query("update users set ? where id=?",[user,user.id],(e,r,f)=>{
                //console.log(e,r,f);
            });
            //console.log(q.sql);

            Zone.get(user.x,user.y,msg,_.partialRight(reply,res));
        }


    });
}


const Zone = {
    content:'',
    tiles:[],
    output:function(){

    },
    get:function(x,y,msg,cb){
        msg = user.x+"x"+user.y+" F"+user.fatigue+"\n"+msg+"\n";
        db.query('select * from zones where x=? and y=?',[x,y],(e,r)=>{
            if(_.isEmpty(r)){
                var zone={
                    x:x,
                    y:y,
                    layout:_.replace(this.build({bg:[_.sample(pallette),_.sample(pallette),_.sample(pallette)]}),/\:/g,'')
                };
                var q = db.query(
                    "insert into zones set ?",
                    zone,
                    (e,r,f)=>{
                        cb(msg+this.render(zone));
                    }
                )
            }
            else {
                cb(msg+this.render(r[0]));
            }
        });
    },
    getEncounter:function(x,y,fatigue){

    },
    render:function(data){
        var layout = _.map(_.split(data.layout,"\n"),function(l){return _.split(l,'')});
        layout[1][1]=emoji.get('slightly_smiling_face');
        layout[1][4]=emoji.get('scorpion');
        return _.map(layout,(l)=>{return l.join('')}).join(br);
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
    if(testing){
        res.send(commandForm+_.replace(output,/\n/g,"<br />"));
    }
    else{
        var options = {
            to: subscriber.phone,
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
                var masked = subscriber.phone.substr(0,subscriber.phone.length - 5);
                masked += '*****';
                console.log('Message sent to ' + masked);
            }
        });
    }
}
