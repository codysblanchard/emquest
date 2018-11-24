import React from 'react';
//import _ from 'loadash';
export default class MapCanvas extends React.Component{
  render(){
    return (<canvas ref='mapCanvas' onMouseMove={this.mapMouse.bind(this)} onMouseDown={this.mapClick.bind(this)} onMouseUp={this.mapUnclick.bind(this)} width={this.props.width} height={this.props.height}></canvas>)
  }
  shouldComponentUpdate(p,s){
    var should =  _.every(this.props.map,(m,i)=>{
      return m.val==p.map[i].val;
    })
    return should;
  }
  componentDidUpdate(){
    //this.drawMap();
  }
  drawMap(){
    var c = this.refs.mapCanvas;
    var ctx = c.getContext("2d");
    ctx.font="14px Arial";
    ctx.fillStyle="rgba(0,0,0,1)";
    var xsize=99;
    var ysize=99;
    _.map(this.props.map,function(m,index)
    {
         var color = m.val;
//console.log(m);
         //if(color==0){
           ctx.fillStyle = "rgba("+color+","+color+","+color+","+1+")";
          ctx.fillRect( m.x*this.props.zoom, m.y*this.props.zoom, this.props.zoom, this.props.zoom );
        //}else{
          if(color>0){
            ctx.fillStyle=color > 125 ? "rgba(0,0,0,1)" : "rgba(0,200,0,1)";
            ctx.fillText(_.get(_.find(this.props.palette,(p)=>{return p.minval<=m.val && p.maxval>=m.val}),'emoji'),m.x*this.props.zoom,m.y*this.props.zoom+this.props.zoom);
          }
          //}
          return null;
      }.bind(this));
  }
  mapMouse(e){
    //console.log(e);
    if(this.mouseDown){
      this.props.mapClick(Math.round((e.clientX - this.refs.mapCanvas.offsetLeft) / this.props.zoom),Math.round ( (e.clientY - this.refs.mapCanvas.offsetTop) / this.props.zoom ))
    }
      /*this.setState({
        map:_.map(this.props.map,(m)=>{
          return m.x ==  && m.y ==  ? _.merge({},m,{val:0}) : m
        })
      },_.throttle(_.bind(this.drawMap,this)),500)
    }*/
  }
  getCanvasPos(){

  }
  mapUnclick(e){
    this.mouseDown=false;
  }
  mapClick(e){
    this.mouseDown=true;
  }
}
