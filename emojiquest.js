const readline = require('readline');
const _ = require('lodash');
const emoji = require('node-emoji');
const config = require('./config');
const twilio = require('twilio')(config.accountSid, config.authToken);
const app = require('express')();
const mysql = require('node-mysql');
const lang = require('./lang');

var db;
var user;
const testing=true;
const commandForm = "<form method='get'><input name='command'><input type='hidden' name='phone' value='5033125056'></form>";
const br=testing ? "<br />" : "\n";
const DB = mysql.DB;

const mysqlconnection = new mysql.DB({
    host:config.dbhost,
    user:config.dbuser,
    password:config.dbpassword,
    database:config.database
})

mysqlconnection.connect((connection)=>{db=connection});

mysqlconnection.add({
   name:'users',
    idFieldName:'phone',
    Row:{},
    Table:{}
});
const Users = mysqlconnection.get('users');


//var DB = db.DB;
//var BaseRow = db.Row;
//var BaseTable = db.Table;

app.listen(3000,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
    userInput(req.query.command,res,req.query.phone);

});

function userInput(input,res,phone){
    Users.Table.findById(db,phone,(e,r,f)=>{
        if(_.isEmpty(r)){
            console.log('no user...');
            var xory=_.range(0,1);
            Users.Table.create(db,
                {
                   phone:phone,
                    x:xory ? _.range(0,config.dimensionx) : 0,
                    y:!xory ? _.range(0,config.dimensiony) : 0
                },
                (user)=>{
                    user=user;
                    reply(lang.welcome+
                        br+
                        Zone.build(['evergreen_tree','deciduous_tree','seedling'],'smiley','ox'),
                        res);
                }
            );
        }
        else user=_.head(r);
    });
}

function reply(output,res){
    if(testing){
        res.send(commandForm+output);
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

const Zone = {
    content:'',
    tiles:[],
    output:function(){

    },
    build:function(backdrop,player,encounter){
        this.tiles=[];
        for(var i=0;i<3;i++){
            this.tiles[i]=[];
            for(var j=0;j<6;j++){
                this.tiles[i][j]=emoji.get(_.sample(backdrop));
            }
        }
        this.tiles[1][4]=emoji.get(encounter);
        this.tiles[1][1]=emoji.get(player);
        this.content=_.map(this.tiles,(t)=>{return t.join('')}).join(br);
        return this.content;
    }
};