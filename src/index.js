import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MapEdit from './MapEdit.js'
import EncountersEdit from './EncountersEdit';
import Utils from './Utils.js';
var u = new Utils();

 class Admin extends React.Component{
   constructor(props){
     super(props);
     this.state={page:'map',loading:true,palette:[]};
     window.addEventListener('ajax.start',()=>{if(this.mounted)this.setState({loading:true})})
     window.addEventListener('ajax.complete',()=>{if(this.mounted)this.setState({loading:false})})
     u.ajax(u.api+"palette/get",null, (palette)=>{
       this.setState({palette:palette,loading:false});
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
        <MapEdit palette={this.state.palette} />
        :
        (this.state.page=='encounters'
        ?
        <EncountersEdit palette={this.state.palette} />
        : null
      )
      }
      </div>
    );
  }
}

ReactDOM.render(<Admin />,document.getElementById('react'));
