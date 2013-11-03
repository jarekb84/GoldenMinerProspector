(function(){ 
	"use strict";

	//For todays date;
	Date.prototype.today = function(){ 
	    return this.getFullYear() + "/" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1)  +"/"+ ((this.getDate() < 10)?"0":"") + this.getDate()
	};
	
	//For the time now
	Date.prototype.timeNow = function(){
	     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
	};

    function ItemType(elementClass, name, action, compareStats, quantityThreshold) {
        this.ElementClass = elementClass || null;
        this.Name = name || null;
        this.Action = action || null; // sell, drink, craft, stash        
        this.CompareStats = compareStats || false; // checks to see if stats have been imporved, if not then sells        
        this.QuantityThreshold = quantityThreshold || null; // Action will not be executed unless the count of items of a type exceed this number, minimum number required to execute action
    }

    function Item(itemElement) {
        this.Id = null;
        this.Stats = null;        
        this.ActionElement = null;
        this.ExecuteAction = true;
        this.ActionExecuteTime = null;    
        this.DiamondCost = 0;    
        this.Place = null;

        this.Init(itemElement);
    }

    Item.prototype.Init = function(itemElement){
    	this.Place = 'stash'
		this.Id = itemElement.getAttribute('stashid');
		if(!this.Id){
			this.Place = 'finds';
			this.Id = itemElement.getAttribute('findid');
		}
    }
	
	function addSuffixPadding(value, length) {	  		
		value = value.toString();
		var diff = length - value.length;

		if(diff > 0) {
			return (value + Array(diff).join(' '));
		}

		return value;
	}

	var itemTypes = [	
		// Gems
		new ItemType('itemtype100','Tiny Ruby','sell', false, 0),
		new ItemType('itemtype101','Small Ruby','sell', false, 0),
		new ItemType('itemtype102','Big Ruby','sell', false, 0),

		new ItemType('itemtype110','Tiny Diamond','sell', false, 0),
		new ItemType('itemtype111','Small Diamond','sell', false, 0),
		new ItemType('itemtype112','Big Diamond','sell', false, 0),

		new ItemType('itemtype120','Tiny Amethyst','sell', false, 0),
		new ItemType('itemtype121','Small Amethyst','sell', false, 0),
		new ItemType('itemtype122','Big Amethyst','sell', false, 15),		

		new ItemType('itemtype130','Tiny Sapphire','sell', false, 0),
		new ItemType('itemtype131','Small Sapphire','sell', false, 0),
		new ItemType('itemtype132','Big Sapphire','sell', false, 0),

		new ItemType('itemtype140','Tiny Starstone','sell', false, 0),
		new ItemType('itemtype141','Small Starstone','sell', false, 0),
		new ItemType('itemtype142','Big Starstone','sell', false, 0),

		// Potions
		new ItemType('itemtype8','Instant Gold Potion','drink', false, 20),
		new ItemType('itemtype9','Instant Diamond Potion','drink', false, 20),
		new ItemType('itemtype10','Gold Potion','drink', false, 0),
		new ItemType('itemtype11','Diamond Potion','drink', false, 0),
		new ItemType('itemtype12','Magic Find Potion','drink', false, 0),

		// Scrolls
		//new ItemType('itemtype5','Blue scroll','craft', false, 0),
		//new ItemType('itemtype6','Yellow scroll','craft', false, 0),
		//new ItemType('itemtype7','Legendary scroll','craft', false, 0),
		new ItemType('itemtype13','Amnesia Scroll','sell', false, 5), // don't craft this one unless you want your stats reset automatically
		

		// Items
		new ItemType('itemtype0','pickaxe','sell', true, 0),
		new ItemType('itemtype1','armor','sell', true, 0),
		new ItemType('itemtype2','helm','sell', true, 0),
		new ItemType('itemtype3','ring','sell', true, 0),
		new ItemType('itemtype4','amulet','sell', true, 0)
	]

	function appendNodeListToArray(targetArray, nodeList ){
		for (var i = 0; i < nodeList.length; ++i) {
			    targetArray.push(nodeList[i]);
			}
		return targetArray;
	}
	
	function generateOutput(itemType, item, message) {
		var output = [
			addSuffixPadding(itemType.Action, 7),
			addSuffixPadding(itemType.Name, 25),
			'from ' + addSuffixPadding(item.Place, 7),
			'on ' + addSuffixPadding(item.ActionExecuteTime.today() + " @ " + item.ActionExecuteTime.timeNow(), 26)
		];

		if(itemType.CompareStats){
			output.push(' stats Change: ');
			output.push(' GPS:' + addSuffixPadding(parseInt(item.Stats.goldPerSec, 10), 11));
			output.push(' DPS:' + addSuffixPadding(parseInt(item.Stats.diamondsPerSec, 10), 7));
			output.push(' MF:' + addSuffixPadding(parseFloat(item.Stats.magicFind).toFixed(2), 7));
			output.push(' XP:' + addSuffixPadding(parseInt(item.Stats.maxXpPerSec, 10), 6));
		}

		output.push(message);

		return output.join('');
	}

	function automate(){		
		itemTypes.every(function(itemType) {	
			var itemTypeList = [], 
				stashAreaList = document.getElementById('stash'), 
				findsAreaList = document.getElementById('finds'),				
				itemProcessed = false,				
				output,
				message = '',
				countItemsOfType = 0,
				diamondBalance = 0;				
	
			itemTypeList = appendNodeListToArray(itemTypeList, stashAreaList.getElementsByClassName(itemType.ElementClass));
			itemTypeList = appendNodeListToArray(itemTypeList, findsAreaList.getElementsByClassName(itemType.ElementClass));
			
			var gemCoutner = 0;

			itemTypeList.every(function(itemElement){
				var item = new Item(itemElement);									
				countItemsOfType++;

				if(itemType.CompareStats){
					
					
					item.Stats = game.getStatsIfEquipped(item.Place, item.Id);
					//if(item.Stats.goldPerSec > 0 || item.Stats.diamondsPerSec > 0 || item.Stats.magicFind > 0 || item.Stats.maxXpPerSec > 0) {
					if(item.Stats.goldPerSec > 0) {
						// at least one of the stats is better then the currnetly equipped itemType, don't sell
						item.ExecuteAction  = false;
					}
				}
				
				// don't execute action unless the item count exceeds threshold				
				if(itemType.QuantityThreshold >= countItemsOfType){
					item.ExecuteAction  = false;
				} else if(itemType.QuantityThreshold > 0) {
					// only do so for threshold > 0 so that the message is not printed for every item action
					message += ' QuantityThreshold of ' + itemType.QuantityThreshold  + ' exceeded';					
				}

				// make sure we have enough diamonds to craft a scroll
				if(itemType.Action === 'craft'){
					diamondBalance =  parseInt(document.getElementById('diamond').innerHTML.replace(/ /g,''),10);					
					item.DiamondCost = game.data[item.Place][item.Id].diamondsCost;					
					// not enough diamonds, skip to next item in itemTypeList
					if(item.DiamondCost > diamondBalance){
						item.ExecuteAction  = false;
					}
				}
				
				// skips to next item in itemTypeList
				if(!item.ExecuteAction){
					return true;
				}



				item.ActionElement = itemElement.getElementsByClassName(itemType.Action)[0];

				// make sure element exists or is found
				if(item.ActionElement){					
					item.ActionElement.click();				
					item.ActionExecuteTime = new Date();				
					itemProcessed = true;
					
					output = generateOutput(itemType, item, message);
					console.log(output);

					// exists the itemTypeList loop
					return false;	
				}				
			});			
			
			// this ensures that only one item is sold per automation interval
			if(itemProcessed){
				return false
			} 
			
			return true;
		});
	}
		
	var automateInterval = setInterval(automate, 1000);	
}());