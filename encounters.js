const config = require('./config');
const mysql = require('node-mysql');
const _ = require('lodash')

const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
})


class Encounters{ 
  getAll(cb){
    this.db.query("select * from encounters",(e,r)=>{
      r=_.map(r,(o)=>{
        return _.merge({},o, {emoji:o.emoji.toString(),face:_.isEmpty(o.face) ? '' : o.face.toString()})
      })
      cb(r);
    });
  }
  save(e,cb){
    this.db.query("REPLACE INTO encounters SET ?",
        e,
        (er,r)=>{
            cb({status:_.isEmpty(er) ? true : er});
        }
    );
  }
  dbConnect(connection){
    this.db=connection;
  }
}

var e = new Encounters();
mysqlconnection.connect(e.dbConnect.bind(e),(a,b,c)=>{console.log(a,b,c)});
module.exports=e;
