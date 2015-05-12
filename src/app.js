var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');

var parseFeed = function (data, quantity){
  var items = [];
  for(var i =0;i< quantity; i++){
    items.push({
      title:data[i].n,
      subtitle:data[i].en
    });
  }
  return items;
};

var splashWindow = new UI.Window();

var text = new UI.Text({
  position: new Vector2(0,0),
  size: new Vector2(144,168),
  text: '\n\nDownloading BoB data...',
  color: 'white',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'black'
});
splashWindow.add(text);
splashWindow.show();

var req = function(){
  ajax(
    {
      url:'http://pebob.herokuapp.com/',
      type:'json'
    },
    function(data){
      Vibe.vibrate('short');
      if(data.length>0){
        var menuItems = parseFeed(data,data.length);
        var resultsMenu = new UI.Menu({
          sections: [{
            title:'dining menu',
            items: menuItems
          }]
        });
        resultsMenu.on('select', function(e){
          var selectedMenu = data[e.itemIndex];
          var detailCard = new UI.Card({
            title:selectedMenu.n,
            subtitle:selectedMenu.en,
            body: '\n'+selectedMenu.f+'\n'+
                  'Cal   : '+selectedMenu.c+' Kcal\n'+
                  'Price : '+selectedMenu.w,
            scrollable: true
          });
          detailCard.show();
        });
        splashWindow.hide();
        resultsMenu.show(); 
      }else{
        var nottime = new UI.Text({
          position: new Vector2(0,0),
          size: new Vector2(144,168),
          text: '\nIt`s not dining time',
          color: 'white',
          textOverflow:'wrap',
          textAlign:'center',
          backgroundColor:'black'
        });
        splashWindow.add(nottime);
      }
    },
    function(error) {
      var errortext = new UI.Text({
          position: new Vector2(0,0),
          size: new Vector2(144,168),
          text: 'Can not download data\n'+error,
          color: 'white',
          textOverflow:'wrap',
          textAlign:'center',
          backgroundColor:'black'
        });
        splashWindow.add(errortext);
    }
  );
};
req();