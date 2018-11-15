var perlin = require('perlin-noise');
const app = require('express')();
const fs = require('fs');
var _ = require('lodash');
const config = require('./config');
const mysql = require('node-mysql');
const emoji = require('node-emoji')
const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
})

var mapper = {

  xsize:99,
  ysize:99,
  db:null,

  //csb: load map into db...
  dbConnect:(connection) =>{
      this.db=connection;
  },
  saveMap:(mapData)=>{
console.log (mapData);
return "cool";
      this.db.query("TRUNCATE map");
      _.map(mapData,(m)=>{
        this.db.query("INSERT INTO map SET ?",
            {
                val:m.val,
                x:m.x,
                y:m.y
            },
            (e,r)=>{
                //console.log(e);
            }
        );
      })
    },
    getMap:(cb)=>{
      this.db.query("SELECT * FROM map",null,(e,r)=>{
        cb(r);
      })
    },
    genMap:()=>{
        var map = mapper.convertMap(perlin.generatePerlinNoise(mapper.xsize, mapper.ysize,{octaveCount:5,amplitude:.1,persistence:.5}));
        //fs.writeFile("./map.js",map);
        return map;
    },
    getPalette:(cb)=>{
      this.db.query("select * from bgpalette",null,(e,r)=>{
        r=_.map(r,(o)=>{
          return _.merge({},o, {emoji:o.emoji.toString()})
        })
        cb(r);
      })
    },
    convertMap(map){
      var y=0;
      return _.map(map,function(m,index){
            var x = index % mapper.xsize;
            if(index==0 || x == 0){
                y++;
            }

            var color=Math.round((m*255)
                    -
                    ((Math.abs((mapper.xsize/2)-x)/mapper.xsize))*155
                    -
                    ((Math.abs((mapper.ysize/2)-y)/mapper.ysize))*155
                )
                ;
            if(color<0)color=0;
            return {x:x,y:y,val:color}
          })
    },
    drawMap:(map)=>{
      return "<table cellpadding='0' cellspacing='0'>"+_.map(map,function(m,index)
      {
            var r='';
            var x = index % this.xsize;
            if(index==0 || x == 0){
                r+="</tr><tr>";
                y++;
            }

            var color=Math.round((m*255)
                -
                ((Math.abs((this.xsize/2)-x)/this.xsize))*155
                -
                ((Math.abs((this.ysize/2)-y)/this.ysize))*155
                )
                ;
            if(color<0)color=0;
            var color = color.toString(16);
            r+="<td width='20' bgcolor='"+color+""+color+""+color+"'>&nbsp;</td>";
            return r;
          });
        }
  }

  mysqlconnection.connect(mapper.dbConnect,(a,b,c)=>{console.log(a,b,c)});


  module.exports=mapper;
