import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MapEdit from './MapEdit.js'
import EncountersEdit from './EncountersEdit';
import Utils from './Utils.js';
var u = new Utils();
import Renderer from '../renderer';

 class Admin extends React.Component{
   constructor(props){
     super(props);
     this.state={page:'map',loading:true,palette:[],users:null};
     window.addEventListener('ajax.start',()=>{if(this.mounted)this.setState({loading:true})})
     window.addEventListener('ajax.complete',()=>{if(this.mounted)this.setState({loading:false})})
     window.addEventListener('encounters.updated',(e)=>{this.setState({encounters:e.detail})})
     u.ajax(u.api+"palette/get",null, (palette)=>{
       u.ajax(u.api+"users/get",null,(users)=>{
        u.ajax(u.api+"encounters/get",null,(encounters)=>{
         this.setState({palette:palette,loading:false,users:users,encounters:encounters});
         })
       })

     })
     document.onkeydown=this.handleKeyDown.bind(this);
   }
   handleKeyDown(e){
     u=_.merge({},this.state.users[0]);
     if(e.key=="ArrowDown")u.y++;
     if(e.key=="ArrowUp")u.y--;
     if(e.key=="ArrowLeft")u.x--;
     if(e.key=="ArrowRight")u.x++;

     this.setState({
       users:[u]
     })
   }
   switchPage(p){
     this.setState({page:p})
   }
   componentDidMount(){
     this.mounted=true;
   }

  render(){
    return (
      <div>
      {this.state.loading ? <div id='loading'>LOADING</div> : null }
      <div>
        <a className='button' onClick={_.partial(this.switchPage.bind(this),'map').bind(this)}>Map</a>
        <a className='button' onClick={_.partial(this.switchPage.bind(this),'encounters').bind(this)}>Encounters</a>
      </div>
      {
        this.state.page == 'map'
        ?
        <MapEdit palette={this.state.palette} encounters={this.state.encounters} users={this.state.users} />
        :
        (this.state.page=='encounters'
        ?
        <EncountersEdit encounters={this.state.encounters} palette={this.state.palette} />
        : null
      )
      }
      </div>
    );
  }
}

ReactDOM.render(<Admin />,document.getElementById('react'));
