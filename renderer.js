const emoji = require('node-emoji');
import _ from 'lodash';
export default class Renderer{
  static render(data,msg){
      //var rarity = _.random(0,300);
      //var encounter = _.sample(_.filter(encounters,(n)=>{return parseInt(n.rarity,10) > rarity}));

      var layout = _.map(_.split(data.layout,"\n"),function(l){return _.split(l,'')});
      if(!_.isEmpty(encounter)){
          layout[1][4]=encounter.emoji;//emoji.get('slightly_smiling_face');
          layout[1][1]=encounter.face;//emoji.get('scorpion');
          msg+=encounter.text+br;
      }else layout[1][1]=emoji.get('slightly_smiling_face');
      return msg+_.map(layout,(l)=>{return l.join('')}).join(br);
  }
  static rollDice(x,y,fatigue,terrain,encounters){
    var encounter = _.find(encounters,{x:x,y:y});
    var dice = _.random(0,100);
    if(_.isEmpty(encounter)){
      encounter = _.sample(_.filter(encounters,(e)=>{
        return e.rarity < dice && e.terrainmin <= terrain && e.terrainmax >= terrain;
      }))
    }
    return encounter;
  }
  static build(data){//backdrop,player,encounter){
      var tiles=[];
      for(var i=0;i<3;i++){
          tiles[i]=[];
          for(var j=0;j<5;j++){
              tiles[i][j]=(_.sample(data.bg));
          }
          if(!_.isEmpty(data.emoji))tiles[1][3]=emoji.get(data.emoji);
      }
      if(!_.isEmpty(data.face))tiles[1][1]=emoji.get(data.face);
      else tiles[1][1]=emoji.get('slightly_smiling_face');

      var encounter=data.encounter;
      var msg="";
      if(!_.isEmpty(encounter)){
          tiles[1][3]=encounter.emoji;//emoji.get('slightly_smiling_face');
          tiles[1][1]=encounter.face;//emoji.get('scorpion');
          msg+=encounter.text+"\n";
      }else tiles[1][1]=emoji.get('slightly_smiling_face');

      return msg+"\n"+_.map(tiles,(t)=>{return t.join('')}).join('\n');
  }

  static getPaletteFromCell(palette,cell){
    if(_.isEmpty(cell))return '';
    return _.get(_.find(palette,(p)=>{return p.minval<=cell.val && p.maxval>=cell.val}),'emoji');
  }
}
