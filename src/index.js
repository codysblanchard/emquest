import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MapCanvas from './Canvas.js'

 class Admin extends React.Component{
   constructor(props){
     super(props);
     this.mouseDown=false;
     this.state = { map: {}, zoom:12,palette:{},paint:0 };
     this.api="http://localhost:3000/api/";
     this.ajax(this.api+'map/get',null,(map)=>{
       this.ajax(this.api+'palette/get',null,(palette)=>{
         this.setState({palette:palette,map:map}) //,this.drawMap.bind(this))
       })
     });
   }
   ajax(uri,params,cb){
     var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
      if(req.readyState === 4) {
        if(req.status === 200) {
          cb(JSON.parse(req.responseText));
        } else {
          //error
        }
      }
    }

    req.open(_.isEmpty(params) ? 'GET' : 'POST', uri);
    req.send(JSON.stringify(params));
   }
   saveMap(){
    this.ajax(this.api+"map/save",{mapData:this.state.map},(r)=>{
       console.log(r);
     })
   }
   genMap(){
     this.ajax(this.api+"map/gen",null,(map)=>{
       this.setState({map:map})//,this.drawMap.bind(this))
     })
   }
   mapClick(x,y){
     //console.log(x,y);
     if(_.isEmpty(_.find(this.state.map,{x:x,y:y,val:this.state.paint})))return;
     var index=_.findIndex(this.state.map,{x:x,y:y});
     var m = _.clone(this.state.map);
     m.splice(index,1,{x:x,y:y,val:this.state.paint})
     this.setState({
       map:m
     })
   }

  render(){
    return (
      <div>
        <div>
          <a onClick={this.genMap.bind(this)}>Generate</a>
          <a onClick={this.saveMap.bind(this)}>Save</a>
        </div>
        <MapCanvas ref='mapCanvas'
          width={this.state.zoom*99}
          height={this.state.zoom*99}
          zoom={this.state.zoom}
          map={this.state.map}
          palette={this.state.palette}
          mapClick={this.mapClick.bind(this)}
          />


      </div>
    );
  }
}

ReactDOM.render(<Admin />,document.getElementById('react'));
