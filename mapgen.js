var perlin = require('perlin-noise');
const app = require('express')();
const fs = require('fs');
var _ = require('lodash');

var xsize=99;
var ysize=99;

const config = require('./config');
const mysql = require('node-mysql');

var db;

//csb: load map into db...
var loadedmap = require("./maps/mapisland");
/*
const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
})

mysqlconnection.connect((connection)=>{
    db=connection;

var y=0;
map = _.map(map,function(m,index){
    var r='';
    var x = index % 99;
    if(index==0 || x == 0){
        r+="</tr><tr>";
        y++;
    }

    var color=Math.round((m*255)
            -
            ((Math.abs((xsize/2)-x)/xsize))*155
            -
            ((Math.abs((ysize/2)-y)/ysize))*155
        )
        ;
    if(color<0)color=0;

    db.query("INSERT INTO map SET ?",
        {
            val:color,
            x:x,
            y:y
        },
        (e,r)=>{
            //console.log(e);
        }
    );

    return color;
});
//console.log(map);
},(a,b,c)=>{console.log(a,b,c)});

return;
*/
//csb; generate maps...
app.listen(3000,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
    var map = loadedmap;//perlin.generatePerlinNoise(xsize, ysize,{octaveCount:5,amplitude:.1,persistence:.5});
    fs.writeFile("./map.js",map);
    var y = 0;
    res.send("<table cellpadding='0' cellspacing='0'>"+_.map(map,function(m,index){
        var r='';
        var x = index % 99;
        if(index==0 || x == 0){
            r+="</tr><tr>";
            y++;
        }

        var color=Math.round((m*255)
            -
            ((Math.abs((xsize/2)-x)/xsize))*155
            -
            ((Math.abs((ysize/2)-y)/ysize))*155
            )
            ;
        if(color<0)color=0;
        var color = color.toString(16);
        r+="<td width='20' bgcolor='"+color+""+color+""+color+"'>&nbsp;</td>";
        return r;
    }))
});