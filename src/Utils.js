export default class Utils{
  constructor(){
    this.api="http://localhost:3000/api/";
  }
  ajax(uri,params,cb){
    //if(this.mounted)this.setState({loading:true})
    var e = new Event('ajax.start');
    var ec = new Event('ajax.complete');
    window.dispatchEvent(e);
     var conf={
       method:_.isEmpty(params) ? 'GET' : 'POST',
       body:_.isEmpty(params) ? null : JSON.stringify(params)
     };
     if(!_.isEmpty(params))conf.headers={
         'Content-Type': 'application/json'
       }
     fetch(uri,conf).then(res => res.json())
     .then(response=>{window.dispatchEvent(ec);cb(response)});
     return;

  }
}
