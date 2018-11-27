import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
const emoji = require('emoji.json');

export default class EmojiDropdown extends React.Component{
  constructor(props){
    super(props);
    this.state={clicked:false,search:'',emojiSearch:''}
    document.onclick=this.unClick.bind(this);
  }
  search(e){
    this.setState({
      search:e.target.value,
      emojiSearch:_.filter(emoji,(em)=>{
        return em.keywords.indexOf(e.target.value) > -1
      }).slice(0,10)
    });
  }
  render(){
    return(
      <div onClick={this.click.bind(this)}>
        {this.state.clicked
          ?
          <div>
            <input value={this.state.search} ref='searchInput' onChange={this.search.bind(this)} />
            <div>
              {_.map(this.state.emojiSearch,(e)=>{
                return <div onClick={_.bind(this.emojiClick,this,e.char)}>{e.char}</div>
              })}
            </div>
          </div>
          :
          this.props.val}
      </div>
      /*<select value={this.props.val} onChange={this.props.changer}>
        {_.map(emoji,(e,i)=>{
          return <option key={i} value={e.char}>{e.char}</option>
        })}
      </select>*/
    )
  }
  emojiClick(e){
    this.setState({
      clicked:false
    });
    this.props.changer(e);
  }
  click(){
    this.setState({clicked:true},()=>{this.refs.searchInput.focus()})
  }
  unClick(e){
    //console.log(e);
    //this.setState({clicked:false});
  }
}
