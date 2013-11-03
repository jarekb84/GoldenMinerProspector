GoldenMinerProspector
=====================

Utility script for [Golden Miner](http://goldenminer.org)

After playing Golden Miner for a few days, I got tired of selling junk gems and having my stash fill up with items I wasn't interested in using. I created this script to help sell off or use up items, and only keep the items that were worth while.
With the Prospector running, I only set the game mining options to stash legendary items, scrolls, potions, and gems. 
The rest is taken care of by the Prospector.

## Features

* Sell any item
* Drink potions
* Craft scrolls
* For equipement, can compare stats to your currenlty equipped set, and will sell worse ones
* Logs actions to console, so you can see what has been sold, when, and how the stats differed
* Set a minimum number of items that are stored in stash before an action is executed. Great way to keep a set number of gems in stock, but not too many.
* Takes actions against items in the Latest Finds and Stash

Feature requests are welcome and can be submitted [here](https://github.com/jarekb84/GoldenMinerProspector/issues).

## Changelog

<dl>
	<dt>v1.1.1 released 2013-11-03</dt>
	<dd>
		Scrolls will only be crafted if there are enough diamonds in the current balance. This resovled [issue #4](https://github.com/jarekb84/GoldenMinerProspector/issues/4).
		Commented out scroll types from the itemTypes array since my diamond balance has been really low. Since instant diamond potions can now be stocked up a bit, plan is to craft scrolls manually after drinking all the instant diamond potions to build up a diamond balance.
	</dd>
	<dt>v1.1.0 released 2013-11-03</dt>
	<dd>
		Added minimum quantity threshold before an action is executed.
	</dd>
	<dt>v1.0.0 released 2013-11-02</dt>
	<dd>
		Initial version of script. Sells, drinks, and crafts items. Can compare equippable items before selling. Logs all actions to console.
	</dd>
</dl>

## Instructions

* copy the javascript code found [here](https://raw.github.com/jarekb84/GoldenMinerProspector/master/Prospector.js)
* go the the game and get to the developer console (Chrome Ctrl + Shift + J)
* paste in the code and hit enter

You should start seeing console log messages like this once items are sold.
	
	drink Instant Gold Potion     from stash on 2013/11/02 @ 14:30:15
	craft Blue scroll             from stash on 2013/11/02 @ 14:40:04
	sell  pickaxe                 from finds on 2013/11/02 @ 14:40:43     stats Change:  GPS:-32243534  DPS:-15691 MF:-3.23  XP:-61 
	craft Legendary scroll        from stash on 2013/11/02 @ 14:41:17
	sell  Small Sapphire          from stash on 2013/11/02 @ 14:42:19
	sell  amulet                  from finds on 2013/11/02 @ 14:44:42     stats Change:  GPS:-28496467  DPS:-64564 MF:-2.36  XP:-34  
	sell  Big Amethyst            from stash on 2013/11/03 @ 10:24:45     QuantityThreshold of 15 exceeded

## Settings
The ItemType takes the following parameters, when creating a new ItemType object to pass to the itemTypes array, be mindful of the order of these values.
	
	ItemType(elementClass, name, action, compareStats, quantityThreshold)

<dl>
  <dt>elementClass (string)</dt>
  <dd>
  	This is the html class that points to the item the Prospector will look for in the game page.
  </dd>

  <dt>name (string)</dt>
  <dd>
  	This name is what will be printed out in the console window when an action is executed.
  </dd>

  <dt>action (string)</dt>
  <dd>
  	The type of action to execute. Currently <strong>'sell'</strong>, <strong>'drink'</strong>, <strong>'craft'</strong> values are suppored.
  </dd>

  <dt>compareStats (bolean)</dt>
  <dd>
  	Set this to <strong>true</strong> to compare an item to what is currnetly equipped (reccomended for wearable items).
  	
  	Set it to <strong>false</strong> for items that don't have stats (gems, scrolls, potions).
  </dd>

  <dt>quantityThreshold (integer)</dt>
  <dd>
  	An action will not be executed unless the count of items of a particular type is greater then the quantityThreshold value passed in. Set this to 0 to always execute the action if an item of the type is found. Set it to any other positive value to prevent an action unless the count is greater than the threshold. Examples would be to only sell Big Amethyst if there are already 15 in the stash or only drinking Instant Gold Potions if there are already 20 in the stash. This is meant to be used as a way to keep valuable itmes, but not let them take up all the space in the stash.
  </dd>
</dl>

## Disabling items

If you don't want the Prospector to take action on an item, just add "//" to the line to comment the item out as I did with Big Amethyst in the itemTypes array.
		
	new ItemType('itemtype120','Tiny Amethyst','sell', false, 0),
	new ItemType('itemtype121','Small Amethyst','sell', false, 0),
	//new ItemType('itemtype122','Big Amethyst','sell', false, 15),	
    
## Adding items

If you want to add new items, (in chrome)
* right click on the item in the game page
* click inspect element
* get the itemtype number and name


In the screenshot below, you can see that Diamond potions are itemtype11, so just add this line to the itemTypes array. Look at the settings section above to determine what values to include for the paramaters.
	
	new ItemType('itemtype11','Diamond Potion','drink', false, 0),

In this case, the Prospector will drink a Diamond Potion everytime it is found in the stash or finds area. The prospector will not attempt to compare the potion to an item already equipped.

![alt text](http://i.imgur.com/92kR9V2.png "Example of Chrome html")



## Bugs
Right now this works for me in Chrome. Seems to be broken in FireFox and I haven't tested IE. If there is interest in those browsers, I can take a look at fixing the cross browser issues.
Feel free to report bugs [here](https://github.com/jarekb84/GoldenMinerProspector/issues).

## Todo
* Add a socket filter, ie only sell items if they have less then 3 sockets
* Add more filtering criteria to the item compare logic, right now only checks if gold rate is better
* Check if enough diamonds are avaialbe before attempting to craft a scroll