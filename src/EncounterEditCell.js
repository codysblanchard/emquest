import React from 'react';
import _ from 'lodash';
import PaletteDropdown from './PaletteDropdown';
import EmojiDropdown from './EmojiDropdown';

export default class EncounterEditCell extends React.Component{
  render(){
    return (<div key={this.props.rowKey} className='row'>
            {_.map(this.props.fields,(c,i2)=>{
              var c2=c.toLowerCase().replace(/\s/g,'');
              return (  <div key={this.props.rowKey+" "+i2} className={'cell'+(_.indexOf(this.props.bigRows,c)>-1 ? ' xbig': '')}>
                          {_.indexOf(this.props.paletteRows,c) > -1
                            ?
                             <PaletteDropdown palette={this.props.palette} val={_.get(this.props.encounter,c2)} changer={_.partial(this.props.handleInput,this.props.encounter.id,c2)}/>
                             :
                             (  c=='Emoji' ?
                               <EmojiDropdown val={_.get(this.props.encounter,c2)} changer={_} />
                               :<input onChange={_.partial(this.props.handleInput,this.props.encounter.id,c2)} value={_.get(this.props.encounter,c2)}/>
                             )
                           }
                        </div>  )
            })}
            {this.props.encounter.id=='new' ? <a className='button' onClick={_.partial(this.props.handleInput,'savenew','id')}>Save</a> : null}
          </div>)
  }
  shouldComponentUpdate(p,s){
    return _.some(this.props.encounter,(val,key)=>{
      return _.get(p.encounter,key) != val;
    })
  }
}
