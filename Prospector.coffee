# Golden Miner Prospector version 1.2.0 using coffeescript

#For todays date
Date.prototype.today = ->	
	return @getFullYear() + '/' + @getMonth() + 1  < 10 ? '0' : '' + (@getMonth() + 1) + '/' + @getDate() < 10 ? '0' : '' + @getDate()
	
#For the time now
Date.prototype.timeNow = ->
	 return @getHours() < 10 ? '0' : '' + @getHours() + ':' + @getMinutes() < 10 ? '0' : '' + @getMinutes() + ':' + @getSeconds() < 10 ? '0' : '' + @getSeconds()
        

class ItemCompare
	constructor: (options) ->
		@Enabled = options[0] || false
		@CheckGold = options[1] || false
		@CheckDiamonds = options[2] || false
		@CheckMagicFind = options[3] || false
		@CheckXp = options[4] || false
		@MinSockets = options[5] || 0	

class ItemType
	constructor: (@ElementClass, @Name, @Action, compareStats, @QuantityThreshold) ->    
    	@CompareStats = new ItemCompare(compareStats); 

class Item
	constructor: (itemElement) ->
		@Id = itemElement.getAttribute('stashid')
		@StatChange = null
		@Stats = null
		@ActionElement = null
		@ExecuteAction = true
		@ActionExecuteTime = null
		@Place = 'stash'			
		
		unless @Id
			@Place = 'finds'
			@Id = itemElement.getAttribute('findid')

addSuffixPadding = (value, length) ->
	value = value.toString()
	diff = length - value.length

	if diff > 0
		return value + new Array(diff).join(' ')	

	return value

itemTypes = [	
	new ItemType('itemtype100','Tiny Ruby','sell', [], 0),
	new ItemType('itemtype101','Small Ruby','sell', [], 0),
	new ItemType('itemtype102','Big Ruby','sell', [], 0),
	new ItemType('itemtype103','Giant Ruby','sell', [], 0),
	new ItemType('itemtype110','Tiny Diamond','sell', [], 0),
	new ItemType('itemtype111','Small Diamond','sell', [], 0),
	new ItemType('itemtype112','Big Diamond','sell', [], 0),
	new ItemType('itemtype113','Giant Diamond','sell', [], ),
	new ItemType('itemtype120','Tiny Amethyst','sell', [], 0),
	new ItemType('itemtype121','Small Amethyst','sell', [], 0),
	new ItemType('itemtype122','Big Amethyst','sell', [], 0),
	new ItemType('itemtype123','Giant Amethyst','sell', [], 15),
	new ItemType('itemtype130','Tiny Sapphire','sell', [], 0),
	new ItemType('itemtype131','Small Sapphire','sell', [], 0),
	new ItemType('itemtype132','Big Sapphire','sell', [], 0),
	new ItemType('itemtype133','Giant Sapphire','sell', [], 0),
	new ItemType('itemtype140','Tiny Starstone','sell', [], 0),
	new ItemType('itemtype141','Small Starstone','sell', [], 0),
	new ItemType('itemtype142','Big Starstone','sell', [], 0),
	new ItemType('itemtype143','Giant Starstone','sell', [], 0),	
	new ItemType('itemtype8','Instant Gold Potion','drink', [], 50),
	new ItemType('itemtype9','Instant Diamond Potion','drink', [], 50),
	new ItemType('itemtype10','Gold Potion','drink', [], 0),
	new ItemType('itemtype11','Diamond Potion','drink', [], 0),
	new ItemType('itemtype12','Magic Find Potion','drink', [], 0),
	new ItemType('itemtype5','Blue scroll','craft', [], 0),
	new ItemType('itemtype6','Yellow scroll','craft', [], 0),
	new ItemType('itemtype7','Legendary scroll','craft', [], 0),
	new ItemType('itemtype13','Amnesia Scroll','sell', [], 5),
	new ItemType('itemtype0','pickaxe','sell', [true, false, false, true, true, 1], 0),
	new ItemType('itemtype1','armor','sell', [true, false, false, true, true, 1], 0),
	new ItemType('itemtype2','helm','sell', [true, false, false, true, true, 1], 0),
	new ItemType('itemtype3','ring','sell', [true, false, false, true, true, 1], 0),
	new ItemType('itemtype4','amulet','sell', [true, false, false, true, true, 1], 0)
];

appendNodeListToArray = (targetArray, nodeList ) ->
	targetArray.push(item) for item in nodeList
	
generateOutput = (itemType, item, message) ->
	output = [
		addSuffixPadding(itemType.Action, 7),
		addSuffixPadding(itemType.Name, 25),
		"from #{addSuffixPadding(item.Place, 7)}",
		 'on ' + addSuffixPadding(item.ActionExecuteTime.today() + " @ " + item.ActionExecuteTime.timeNow(), 26)		
	]

	if itemType.CompareStats.Enabled
		output.push(' stats Change: ')
		output.push(' GPS:' + addSuffixPadding(parseInt(item.StatChange.goldPerSec, 10), 11))
		output.push(' DPS:' + addSuffixPadding(parseInt(item.StatChange.diamondsPerSec, 10), 7))
		output.push(' MF:' + addSuffixPadding(parseFloat(item.StatChange.magicFind).toFixed(2), 7))
		output.push(' XP:' + addSuffixPadding(parseInt(item.StatChange.maxXpPerSec, 10), 6))
		output.push(' Sockets:' + addSuffixPadding(parseInt(item.Stats.sockets, 10), 2))

	output.push(message)

	return output.join('')

automate = ->
	for itemType in itemTypes
		itemTypeList = new Array
		stashAreaList = document.getElementById('stash')
		findsAreaList = document.getElementById('finds')
		itemProcessed = false
		item
		output
		message = ''
		countItemsOfType = 0
		diamondBalance = 0

		itemTypeList = appendNodeListToArray(itemTypeList, stashAreaList.getElementsByClassName(itemType.ElementClass))
		itemTypeList = appendNodeListToArray(itemTypeList, findsAreaList.getElementsByClassName(itemType.ElementClass))

		for itemElement in itemTypeList
			item = new Item(itemElement)

			countItemsOfType++

			if itemType.CompareStats.Enabled
				item.StatChange = game.getStatsIfEquipped(item.Place, item.Id)
				item.Stats = game.data[item.Place][item.Id]

				socketedMf = item.Stats.sockets * 1.0

				if (itemType.CompareStats.CheckGold && item.StatChange.goldPerSec > 0) && (itemType.CompareStats.CheckMagicFind && (item.StatChange.magicFind + socketedMf) >= 0) && (itemType.CompareStats.CheckDiamonds && item.StatChange.diamondsPerSec > 0) && (itemType.CompareStats.CheckXp && item.StatChange.maxXpPerSec > 0)				
					if item.ExecuteAction && item.Stats.sockets >= itemType.CompareStats.MinSockets
						# at least one of the stats is better then the currnetly equipped itemType, don't sell													
						item.ExecuteAction  = false
					else
						message += " Not enough sockets. Has " + item.Stats.sockets + " needed " + itemType.CompareStats.MinSockets						
							
			if itemType.QuantityThreshold >= countItemsOfType
				# don't execute action unless the item count exceeds threshold
				item.ExecuteAction  = false
			else if itemType.QuantityThreshold > 0
				# only do so for threshold > 0 so that the message is not printed for every item action
				message += ' QuantityThreshold of ' + itemType.QuantityThreshold  + ' exceeded'
			
			# make sure we have enough diamonds to craft a scroll
			if itemType.Action == 'craft'
				item.Stats = game.data[item.Place][item.Id]
				diamondBalance =  parseInt(document.getElementById('diamond').innerHTML.replace('',''),10)

				# not enough diamonds, skip to next item in itemTypeList
				if item.Stats.diamondsCost > diamondBalance
					item.ExecuteAction  = false
			
			# skips to next item in itemTypeList
			unless item.ExecuteAction
				break
			
			item.ActionElement = itemElement.getElementsByClassName(itemType.Action)[0];

			# make sure element exists or is found
			if item.ActionElement
				item.ActionElement.click()
				item.ActionExecuteTime = new Date()
				itemProcessed = true
				
				output = generateOutput(itemType, item, message)
				console.log(output)

				# exits the itemTypeList loop
				break

		# this ensures that only one item is sold per automation interval
		if itemProcessed
			break

automateInterval = setInterval(automate, 500)