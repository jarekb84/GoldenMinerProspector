GoldenMinerProspector
=====================

Utility script for [Golden Miner](http://goldenminer.org)

After playing Golden Miner for a few days, I got tired of selling junk gems and having my stash fill up with items I wasn't interested in using. I created this script to help sell off or use up items, and only keep the items that were worth while.
With the Prospector running, I only set the game mining options to stash legendary items, scrolls, potions, and gems. 
The rest is taken care of by the Prospector.

## Features

* Takes actions against items in the Latest Finds and Stash
* Sell any item
* Drink potions
* Craft scrolls
* For equipement, can compare stats to your currenlty equipped set, and will sell worse ones
* Logs actions to console, so you can see what has been sold, when, and how the stats differed

Feature requests are welcome and can be submitted [here](https://github.com/jarekb84/GoldenMinerProspector/issues).

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

## Disabling items

If you don't want the Prospector to take action on an item, just add "//" to the line to comment the item out as I did with Big Amethyst in the itemTypes array.

		
		new ItemType('itemtype120','Tiny Amethyst','sell'),
		new ItemType('itemtype121','Small Amethyst','sell'),
		//new ItemType('itemtype122','Big Amethyst','sell'),	
    
## Adding items

If you want to add new items, (in chrome)
* right click on the item in the game page
* click inspect element
* get the itemtype number and name

In the screenshot below, you can see that Diamond potions are itemtype11, so just add this line to the itemTypes array.
	
	new ItemType('itemtype11','Diamond potion','sell'),
	
![alt text](http://i.imgur.com/92kR9V2.png "Example of Chrome html")

## Bugs
Right now this works for me in Chrome. Seems to be broken in FireFox and I haven't tested IE. If there is interest in those browsers, I can take a look at fixing the cross browser issues.
Feel free to report bugs [here](https://github.com/jarekb84/GoldenMinerProspector/issues).

## Todo
* Add a minimum quantity threshold, ie only sell Big Amethyst if there are 15 already in the stash
* Add a socket filter, ie only sell items if they have less then 3 sockets
* Add more filtering criteria to the item compare logic, right now only checks if gold rate is better
* Check if enough diamonds are avaialbe before attempting to craft a scroll