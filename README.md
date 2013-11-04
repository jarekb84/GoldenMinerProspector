Golden Miner Prospector
=====================

[Features](#features) ||
[Instructions](#instructions) ||
[Settings](#settings) ||
[Disabling items](#disabling-items) ||
[Adding items](#adding-items) ||
[Bugs](#bugs) ||
[Todo](#todo)

Utility script for [Golden Miner](http://goldenminer.org)

After playing Golden Miner for a few days, I got tired of selling junk gems and having my stash fill up with items I wasn't interested in using. I created this script to help sell off or use up items, and only keep the items that were worthwhile.
With the Prospector running, I only set the game mining options to stash legendary items, scrolls, potions, and gems. 
The rest is taken care of by the Prospector.

## Features

* Sell any item
* Drink potions
* Craft scrolls
* For equipment, can compare stats to your currently equipped set, and will sell worse ones
	* can check for improved gold, diamond, magic find, and xp rate
	* can also add a minimum number of sockets filter
* Logs actions to console, so you can see what has been sold, when, and how the stats differed
* Set a minimum number of items that are stored in stash before an action is executed. Great way to keep a set number of gems in stock, but not too many.
* Takes actions against items in the Latest Finds and Stash

Feature requests are welcome and can be submitted [here](https://github.com/jarekb84/GoldenMinerProspector/issues).



## Changelog


**v1.2.0 released 2013-11-03**

* Added more filtering criteria to item compare logic. This resolved [issue #3](https://github.com/jarekb84/GoldenMinerProspector/issues/3). Check the settings section for more info.
* Added a minimum socket check. This resolved [issue #2](https://github.com/jarekb84/GoldenMinerProspector/issues/2).

**v1.1.1 released 2013-11-03**

* Scrolls will only be crafted if there are enough diamonds in the current balance. This resolved [issue #4](https://github.com/jarekb84/GoldenMinerProspector/issues/4).
* Commented out scroll types from the itemTypes array since my diamond balance has been really low. Since instant diamond potions can now be stocked up a bit, plan is to craft scrolls manually after drinking all the instant diamond potions to build up a diamond balance.

**v1.1.0 released 2013-11-03**

* Added minimum quantity threshold before an action is executed.

**v1.0.0 released 2013-11-02**

* Initial version of script. Sells, drinks, and crafts items. Can compare equipable items before selling. Logs all actions to console.	

## Instructions

* copy the javascript code found [here](https://raw.github.com/jarekb84/GoldenMinerProspector/master/Prospector.js)
* go the game and get to the developer console (Chrome Ctrl + Shift + J)
* paste in the code and hit enter

You should start seeing console log messages like this once items are sold.
	
	sell  pickaxe                 from finds on 2013/11/03 @ 14:23:24     stats Change:  GPS:-59687564  DPS:-29586 MF:-4.16  XP:-95   Sockets:1	
	drink Instant Gold Potion     from stash on 2013/11/03 @ 14:30:15
	craft Blue scroll             from stash on 2013/11/03 @ 14:40:04
	sell  pickaxe                 from finds on 2013/11/03 @ 14:40:43     stats Change:  GPS:-32243534  DPS:-15691 MF:-3.23  XP:-61   Sockets:1	 
	craft Legendary scroll        from stash on 2013/11/03 @ 14:41:17
	sell  Small Sapphire          from stash on 2013/11/03 @ 14:42:19
	sell  amulet                  from finds on 2013/11/03 @ 14:44:42     stats Change:  GPS:-28496467  DPS:-64564 MF:-2.36  XP:-34   Sockets:2	  
	sell  Big Amethyst            from stash on 2013/11/03 @ 14:44:45     QuantityThreshold of 15 exceeded
	sell  amulet                  from finds on 2013/11/03 @ 14:45:42     stats Change:  GPS: 58996467  DPS:-44564 MF:-3.23  XP:0     Sockets:2	 Not enough sockets. Has 2 needed 3 
	

## Settings
The ItemType takes the following parameters, when creating a new ItemType object to pass to the itemTypes array, be mindful of the order of these values.
	
	ItemType(elementClass, name, action, compareStats, quantityThreshold)


**elementClass (string)**

This is the html class that points to the item the Prospector will look for in the game page.

**name (string)**

This name is what will be printed out in the console window when an action is executed.

**action (string)**

The type of action to execute. Currently `'sell'`, `'drink'`, `'craft'` values are supported.

**compareStats (array)**

Check if an item has better gold, diamond, magic find, or xp rate. Each rate check can be enabled individually, but if multiple rate checkers are enabled, an item only has to pass one of them to be kept in the stash. Ie if you set gold and diamond rate checkers to true, an item that has a better gold rate, but worse diamond rate will be kept and not sold. 

If an item passes one of the above mentioned rate checkers, it is then also checked to see if it has more then the minimum number of sockets. From the example above, if gold and diamond rate checkers are set to true and minimum sockets is set to 2, than an item with positive gold and negative diamond with 1 socket will be sold. Same item with 2 sockets would be kept in the stash.

This setting is now an array of options for the comparison logic. Set it to `[]` to use the default which is not to compare for items that don't have stats (gems, scrolls, potions).

The options array can be passed in as such `[Enabled, CheckGold, CheckDiamonds, CheckMagicFind, CheckXp, MinSockets]`

	Enabled (bool): default false 
	CheckGold (bool): default false 
	CheckDiamonds (bool): default false 
	CheckMagicFind (bool): default false 
	CheckXp (bool): default false 
	MinSockets (integer): default 0 

Example usage 
	
	new ItemType('itemtype122','Big Amethyst','sell', [], 15),
	new ItemType('itemtype0','pickaxe','sell', [true, true, false, false, false, 1], 0),


**quantityThreshold (integer)**

An action will not be executed unless the count of items of a particular type is greater then the quantityThreshold value passed in. Set this to 0 to always execute the action if an item of the type is found. Set it to any other positive value to prevent an action unless the count is greater than the threshold. Examples would be to only sell Big Amethyst if there are already 15 in the stash or only drinking Instant Gold Potions if there are already 20 in the stash. This is meant to be used as a way to keep valuable items, but not let them take up all the space in the stash.
  


## Disabling items

If you don't want the Prospector to take action on an item, just add "//" to the line to comment the item out as I did with Big Amethyst in the itemTypes array.
		
	new ItemType('itemtype120','Tiny Amethyst','sell', [], 0),
	new ItemType('itemtype121','Small Amethyst','sell', [], 0),
	//new ItemType('itemtype122','Big Amethyst','sell', [], 15),	
	//new ItemType('itemtype0','pickaxe','sell', [true, true, false, false, false, 2], 0),
    
## Adding items

If you want to add new items, (in chrome)
* right click on the item in the game page
* click inspect element
* get the itemtype number and name


In the screenshot below, you can see that Diamond potions are itemtype11, so just add this line to the itemTypes array. Look at the settings section above to determine what values to include for the parameters.
	
	new ItemType('itemtype11','Diamond Potion','drink', [], 0),

In this case, the Prospector will drink a Diamond Potion everytime it is found in the stash or finds area. The prospector will not attempt to compare the potion to an item already equipped.

![alt text](http://i.imgur.com/92kR9V2.png "Example of Chrome html")



## Bugs
Tested and working in Chrome and Firefox, not in IE. I mostly use Chrome, so if any bugs popup in other browsers, submit a bug report [here](https://github.com/jarekb84/GoldenMinerProspector/issues).

## Todo
* Disable Gamble button when gold or diamond rates are affected by a potion
* bug fixes