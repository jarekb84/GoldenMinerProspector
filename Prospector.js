// Generated by CoffeeScript 1.6.3
(function() {
  var Item, ItemCompare, ItemType, addSuffixPadding, appendNodeListToArray, automate, automateInterval, generateOutput, itemTypes;

  Date.prototype.today = function() {
    var _ref, _ref1;
    return (_ref = this.getFullYear() + '/' + this.getMonth() + 1 < 10) != null ? _ref : {
      '0': (_ref1 = '' + (this.getMonth() + 1) + '/' + this.getDate() < 10) != null ? _ref1 : {
        '0': '' + this.getDate()
      }
    };
  };

  Date.prototype.timeNow = function() {
    var _ref, _ref1, _ref2;
    return (_ref = this.getHours() < 10) != null ? _ref : {
      '0': (_ref1 = '' + this.getHours() + ':' + this.getMinutes() < 10) != null ? _ref1 : {
        '0': (_ref2 = '' + this.getMinutes() + ':' + this.getSeconds() < 10) != null ? _ref2 : {
          '0': '' + this.getSeconds()
        }
      }
    };
  };

  ItemCompare = (function() {
    function ItemCompare(options) {
      this.Enabled = options[0] || false;
      this.CheckGold = options[1] || false;
      this.CheckDiamonds = options[2] || false;
      this.CheckMagicFind = options[3] || false;
      this.CheckXp = options[4] || false;
      this.MinSockets = options[5] || 0;
    }

    return ItemCompare;

  })();

  ItemType = (function() {
    function ItemType(ElementClass, Name, Action, compareStats, QuantityThreshold) {
      this.ElementClass = ElementClass;
      this.Name = Name;
      this.Action = Action;
      this.QuantityThreshold = QuantityThreshold;
      this.CompareStats = new ItemCompare(compareStats);
    }

    return ItemType;

  })();

  Item = (function() {
    function Item(itemElement) {
      this.Id = itemElement.getAttribute('stashid');
      this.StatChange = null;
      this.Stats = null;
      this.ActionElement = null;
      this.ExecuteAction = true;
      this.ActionExecuteTime = null;
      this.Place = 'stash';
      if (!this.Id) {
        this.Place = 'finds';
        this.Id = itemElement.getAttribute('findid');
      }
    }

    return Item;

  })();

  addSuffixPadding = function(value, length) {
    var diff;
    value = value.toString();
    diff = length - value.length;
    if (diff > 0) {
      return value + new Array(diff).join(' ');
    }
    return value;
  };

  itemTypes = [new ItemType('itemtype100', 'Tiny Ruby', 'sell', [], 0), new ItemType('itemtype101', 'Small Ruby', 'sell', [], 0), new ItemType('itemtype102', 'Big Ruby', 'sell', [], 0), new ItemType('itemtype103', 'Giant Ruby', 'sell', [], 0), new ItemType('itemtype110', 'Tiny Diamond', 'sell', [], 0), new ItemType('itemtype111', 'Small Diamond', 'sell', [], 0), new ItemType('itemtype112', 'Big Diamond', 'sell', [], 0), new ItemType('itemtype113', 'Giant Diamond', 'sell', []), new ItemType('itemtype120', 'Tiny Amethyst', 'sell', [], 0), new ItemType('itemtype121', 'Small Amethyst', 'sell', [], 0), new ItemType('itemtype122', 'Big Amethyst', 'sell', [], 0), new ItemType('itemtype123', 'Giant Amethyst', 'sell', [], 15), new ItemType('itemtype130', 'Tiny Sapphire', 'sell', [], 0), new ItemType('itemtype131', 'Small Sapphire', 'sell', [], 0), new ItemType('itemtype132', 'Big Sapphire', 'sell', [], 0), new ItemType('itemtype133', 'Giant Sapphire', 'sell', [], 0), new ItemType('itemtype140', 'Tiny Starstone', 'sell', [], 0), new ItemType('itemtype141', 'Small Starstone', 'sell', [], 0), new ItemType('itemtype142', 'Big Starstone', 'sell', [], 0), new ItemType('itemtype143', 'Giant Starstone', 'sell', [], 0), new ItemType('itemtype8', 'Instant Gold Potion', 'drink', [], 50), new ItemType('itemtype9', 'Instant Diamond Potion', 'drink', [], 50), new ItemType('itemtype10', 'Gold Potion', 'drink', [], 0), new ItemType('itemtype11', 'Diamond Potion', 'drink', [], 0), new ItemType('itemtype12', 'Magic Find Potion', 'drink', [], 0), new ItemType('itemtype5', 'Blue scroll', 'craft', [], 0), new ItemType('itemtype6', 'Yellow scroll', 'craft', [], 0), new ItemType('itemtype7', 'Legendary scroll', 'craft', [], 0), new ItemType('itemtype13', 'Amnesia Scroll', 'sell', [], 5), new ItemType('itemtype0', 'pickaxe', 'sell', [true, false, false, true, true, 1], 0), new ItemType('itemtype1', 'armor', 'sell', [true, false, false, true, true, 1], 0), new ItemType('itemtype2', 'helm', 'sell', [true, false, false, true, true, 1], 0), new ItemType('itemtype3', 'ring', 'sell', [true, false, false, true, true, 1], 0), new ItemType('itemtype4', 'amulet', 'sell', [true, false, false, true, true, 1], 0)];

  appendNodeListToArray = function(targetArray, nodeList) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = nodeList.length; _i < _len; _i++) {
      item = nodeList[_i];
      _results.push(targetArray.push(item));
    }
    return _results;
  };

  generateOutput = function(itemType, item, message) {
    var output;
    output = [addSuffixPadding(itemType.Action, 7), addSuffixPadding(itemType.Name, 25), "from " + (addSuffixPadding(item.Place, 7)), 'on ' + addSuffixPadding(item.ActionExecuteTime.today() + " @ " + item.ActionExecuteTime.timeNow(), 26)];
    if (itemType.CompareStats.Enabled) {
      output.push(' stats Change: ');
      output.push(' GPS:' + addSuffixPadding(parseInt(item.StatChange.goldPerSec, 10), 11));
      output.push(' DPS:' + addSuffixPadding(parseInt(item.StatChange.diamondsPerSec, 10), 7));
      output.push(' MF:' + addSuffixPadding(parseFloat(item.StatChange.magicFind).toFixed(2), 7));
      output.push(' XP:' + addSuffixPadding(parseInt(item.StatChange.maxXpPerSec, 10), 6));
      output.push(' Sockets:' + addSuffixPadding(parseInt(item.Stats.sockets, 10), 2));
    }
    output.push(message);
    return output.join('');
  };

  automate = function() {
    var countItemsOfType, diamondBalance, findsAreaList, item, itemElement, itemProcessed, itemType, itemTypeList, message, output, socketedMf, stashAreaList, _i, _j, _len, _len1, _results;
    _results = [];
    for (_i = 0, _len = itemTypes.length; _i < _len; _i++) {
      itemType = itemTypes[_i];
      itemTypeList = new Array;
      stashAreaList = document.getElementById('stash');
      findsAreaList = document.getElementById('finds');
      itemProcessed = false;
      item;
      output;
      message = '';
      countItemsOfType = 0;
      diamondBalance = 0;
      itemTypeList = appendNodeListToArray(itemTypeList, stashAreaList.getElementsByClassName(itemType.ElementClass));
      itemTypeList = appendNodeListToArray(itemTypeList, findsAreaList.getElementsByClassName(itemType.ElementClass));
      for (_j = 0, _len1 = itemTypeList.length; _j < _len1; _j++) {
        itemElement = itemTypeList[_j];
        item = new Item(itemElement);
        countItemsOfType++;
        if (itemType.CompareStats.Enabled) {
          item.StatChange = game.getStatsIfEquipped(item.Place, item.Id);
          item.Stats = game.data[item.Place][item.Id];
          socketedMf = item.Stats.sockets * 1.0;
          if ((itemType.CompareStats.CheckGold && item.StatChange.goldPerSec > 0) && (itemType.CompareStats.CheckMagicFind && (item.StatChange.magicFind + socketedMf) >= 0) && (itemType.CompareStats.CheckDiamonds && item.StatChange.diamondsPerSec > 0) && (itemType.CompareStats.CheckXp && item.StatChange.maxXpPerSec > 0)) {
            if (item.ExecuteAction && item.Stats.sockets >= itemType.CompareStats.MinSockets) {
              item.ExecuteAction = false;
            } else {
              message += " Not enough sockets. Has " + item.Stats.sockets + " needed " + itemType.CompareStats.MinSockets;
            }
          }
        }
        if (itemType.QuantityThreshold >= countItemsOfType) {
          item.ExecuteAction = false;
        } else if (itemType.QuantityThreshold > 0) {
          message += ' QuantityThreshold of ' + itemType.QuantityThreshold + ' exceeded';
        }
        if (itemType.Action === 'craft') {
          item.Stats = game.data[item.Place][item.Id];
          diamondBalance = parseInt(document.getElementById('diamond').innerHTML.replace('', ''), 10);
          if (item.Stats.diamondsCost > diamondBalance) {
            item.ExecuteAction = false;
          }
        }
        if (!item.ExecuteAction) {
          break;
        }
        item.ActionElement = itemElement.getElementsByClassName(itemType.Action)[0];
        if (item.ActionElement) {
          item.ActionElement.click();
          item.ActionExecuteTime = new Date();
          itemProcessed = true;
          output = generateOutput(itemType, item, message);
          console.log(output);
          break;
        }
      }
      if (itemProcessed) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  automateInterval = setInterval(automate, 500);

}).call(this);
