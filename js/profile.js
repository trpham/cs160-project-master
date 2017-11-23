// generation of data
var year = 2017
var months = ['7', '8', '9', '10', '11']
var sides = ['left', 'center', 'right']
var cats = ['Immigration', 'Politics', 'Disaster', 'Health', 'International', 'Education', 'Science', 'Technology', 'Environment']

var allArticles = []

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// var duration = moment.duration(today.diff(today.add(-1, 'years')));
var days = 365

function randomDate() {
	return moment().add(-Math.floor((Math.random() * days)), 'days')
}

for(i = 0; i < sides.length; i++) {
	var side = sides[i]
	var numArts = Math.floor(Math.random() * 150) + 50
	for (j = 0; j < numArts; j++) {
		var art = {}
		art['side'] = side
			// console.log(j)
		art['date'] = randomDate()
		art['cat'] = cats[Math.floor(Math.random() * cats.length)]
		allArticles.push(art)
	}
}

function monthFromDate(date) {
	// console.log(date.month())
	return monthNames[date.month()]
}

function monthFromNum(num) {
	return monthNames[num]
}

function compareDate(a, b) {
	return a['date'] - b['date']
}

// sorting/organizing articles
var allArticles = allArticles.sort(compareDate)

var ratiosChron = []
var allSidesArts = {}

// setting up main dict structure
for (j = 0; j < 3; j++) {
	var side = sides[j]
	allSidesArts[side] = {}
	allSidesArts[side]['count'] = 0
	allSidesArts[side]['articles'] = []
	allSidesArts[side]['byMonth'] = {}
	allSidesArts[side]['byCat'] = {}
	for (i = 0; i < 12; i++) {
		var month = monthFromNum(i)
		// console.log(month)
		allSidesArts[side]['byMonth'][month] = []
	}
	for (i = 0; i < cats.length; i++) {
		var cat = cats[i]
		allSidesArts[side]['byCat'][cat] = []	
	}
}

function totalArts() {
	return allSidesArts['left']['count'] + allSidesArts['center']['count'] + allSidesArts['right']['count']
}


// filling in dict
for(i = 0; i < allArticles.length; i++) {
	var art = allArticles[i]
	var side = art['side']
	var date = art['date']
	var cat = art['cat']
	var month = monthFromDate(date)

	allSidesArts[side]['byMonth'][month].push(art)
	allSidesArts[side]['byCat'][cat].push(art)
	allSidesArts[side]['articles'].push(art)
	allSidesArts[side]['count'] += 1

	if (date.isBefore(moment()) && date.isAfter(moment().add(-5, 'months'))) {
		var ratio = (allSidesArts['left']['count'] - allSidesArts['right']['count']) / totalArts()
		ratiosChron.push({x: date, y: ratio})
	}
}


var padding = 10
var allArtNums = [[], [], []]

for (i = 0; i < 3; i++) {
	var side = sides[i]
	for(j = moment().add(-5, 'months').month(); j < moment().month() + 1; j++) {
		allArtNums[i].push(allSidesArts[side]['byMonth'][monthFromNum(j)].length)
	}
}

var leftNums = allArtNums[0]
var centerNums = allArtNums[1]
var rightNums = allArtNums[2]

var colorDict = {}
colorDict['left'] = 'rgba(141,173,204,0.8)'
colorDict['right'] = 'rgba(204,139,139,0.8)'
colorDict['center'] = 'rgba(154,154,204, 0.8)'

// colorDict['left'] = 'rgba(84, 140,178,0.8)'
// colorDict['right'] = 'rgba(201,110,113,0.8)'
// colorDict['center'] = 'rgba(142,118,148, 0.8)'

var mostNums = [];
var mostColors = [];
var middleNums = [];
var middleColors = [];
var leastNums = [];
var leastColors = [];

function appendMap(valueToAdd) {
	return function (e) {
		return [e, valueToAdd]
	};
}

var leftNumsWithBiases = leftNums.map(appendMap('left'));
var centerNumsWithBiases = centerNums.map(appendMap('center'));
var rightNumsWithBiases = rightNums.map(appendMap('right'));

function compare(a, b) {
	if (a[0] > b[0]) {
		return 1;
	}
	if (a[0] < b[0]) {
		return -1;
	}
	return 0;
}

function getSum(total, num) {
    return total + num;
}

function sum(arr) {
	return arr.reduce(getSum)
}

var ratioValuesDict = {}
ratioValuesDict['left'] = 1
ratioValuesDict['center'] = 0
ratioValuesDict['right'] = -1

var ratios = []

for (i = 0; i < leftNums.length; i++) {
	var oneMonthNums = [leftNums[i], centerNums[i], rightNums[i]]
	var sortedNums = oneMonthNums.sort(function(a, b){return a-b})
	// console.log(sortedNums)
	var oneMonthNumBiases = [leftNumsWithBiases[i], centerNumsWithBiases[i], rightNumsWithBiases[i]];
	var sortedNumsBiases = oneMonthNumBiases.sort(compare)
	var sortedBiases = sortedNumsBiases.map(function(e){return e[1]});

	leastNums.push(sortedNums[0])
	leastColors.push(colorDict[sortedBiases[0]])
	middleNums.push(sortedNums[1])
	middleColors.push(colorDict[sortedBiases[1]])
	mostNums.push(sortedNums[2])
	mostColors.push(colorDict[sortedBiases[2]])
}

var ctx = document.getElementById('biasChart').getContext('2d');
var biasChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ['Jul', 'Aug', 'Oct', 'Sep', 'Nov'],
		datasets: [		{
			label: 'most',
			data: mostNums,
			backgroundColor: mostColors,
			hoverBackgroundColor: mostColors,
			borderWidth: 1,
		},
		{
			label: 'middle',
			data: middleNums,
			backgroundColor: middleColors,
			hoverBackgroundColor: middleColors,
			borderWidth: 1
		},
		{
			label: 'least',
			data: leastNums,
			backgroundColor: leastColors,
			hoverBackgroundColor: leastColors,
			borderWidth: 1
		}],
	},
	options: {
		layout: {
			padding: {
				left: padding,
				right: padding,
				top: padding,
				bottom: padding,
			}
		},
		title: {
			display: true,
			position: 'top',
			text: 'Your reading summary',
			fontColor: 'black'
		},
		tooltips: {
			enabled: false
		},
		legend: {
			display: false
		},
		scales: {
			xAxes: [{
				stacked: true,
				ticks: {
					beginAtZero: true
				}
			}],
			yAxes: [{
				display: false,
				stacked: true,
				ticks: {
					beginAtZero: true
				}
			}],
		}
	}
})

var labels = []
var ys = []

for (i = 0; i < ratiosChron.length; i+=7) {
	// console.log(ratiosChron[i])
	if (!isNaN(ratiosChron[i].x)) {
		labels.push(ratiosChron[i].x)
		ys.push(ratiosChron[i].y)
	}
}

function xyMap(valueToAdd) {
	return function (e) {
		return {x: e, y: valueToAdd}
	};
}


var lowestY = Math.min.apply(Math, ys)
var highestY = Math.max.apply(Math, ys)
var graphMin = lowestY
var  graphMax = highestY
if (graphMin >= 0) {
	graphMin = -0.25
} 
if (graphMax <= 0) {
	graphMax = 0.25
}


if (Math.abs(graphMin) != Math.abs(graphMax)) {
	graphMin = -Math.max(Math.abs(graphMin), Math.abs(graphMax))
	graphMax = Math.max(Math.abs(graphMin), Math.abs(graphMax))
}

var graphRange = Math.abs(graphMax) + Math.abs(graphMin)
if (graphRange < 0.5) {
	console.log(graphRange)
	var rangeDiff = 0.5 - graphRange
	console.log(rangeDiff)
	graphRange = 0.5
	graphMax += rangeDiff / 2
	graphMin -= rangeDiff / 2
}

if (Math.abs(lowestY - graphMin) < .1 || Math.abs(highestY - graphMax) < .1) {
	graphMin -= 0.1
	graphRange += 0.2
	graphMax += 0.1
}


var sameNeg = labels.map(xyMap(-graphRange / 3))
var sameMidNeg = labels.map(xyMap(-graphRange / 6))
var sameMidPos = labels.map(xyMap(graphRange / 6))
var samePos = labels.map(xyMap(graphRange / 3))

var ltx = document.getElementById('lineChart').getContext('2d');
var biasChart = new Chart(ltx, {
	type: 'bar',
	data: {
		labels: labels,
		datasets: [
		{
			data: ys,
			type: 'line',
			pointBackgroundColor: 'rgba(255,255,255, 1)',
			borderColor: 'rgba(0,0,0, 1)',
			pointBorderWidth: 0,
			fill: false,
			pointRadius: 0,
			borderWidth: 1,
			pointHoverBackgroundColor: 'rgba(0,0,0, 1)',
			pointHoverBorderWidth: 0,
			pointHoverRadius: 0.5,
			lineTension: 0.5

		},
		{
			data: sameMidNeg,
			backgroundColor: 'rgba(154,154,204, 0.5)',
			hoverBackgroundColor: 'rgba(154,154,204, 0.5)',
		},
		{
			data: sameNeg,
			backgroundColor: 'rgba(204,139,139,0.5)',
			hoverBackgroundColor: 'rgba(204,139,139,0.5)',
		},
		{
			data: sameMidPos,
			backgroundColor: 'rgba(154,154,204, 0.5)',
			hoverBackgroundColor: 'rgba(154,154,204, 0.5)',
		},
		{
			data: samePos,
			backgroundColor: 'rgba(141,173,204,0.5)',
			hoverBackgroundColor: 'rgba(141,173,204,0.5)'
		}],
	},
	options: {
		layout: {
			padding: {
				left: padding,
				right: padding,
				top: padding,
				bottom: padding,
			}
		},
		title: {
			display: true,
			position: 'top',
			text: 'Your bias trend',
			fontColor: 'black'
		},
		tooltips: {
			enabled: false
		},
		legend: {
			display: false
		},
		scales: {
			xAxes: [{
				type: 'time',
				time: {
					displayFormats: {
						'day': 'MMM'
					},
					units: 'month'
				},
				stacked: true,
				ticks: {
					beginAtZero: true
				},
				distribution: 'series',
				barPercentage: 1,
				categoryPercentage: 1,
			}],
			yAxes: [{
				display: false,
				stacked: true,
				ticks: {
					beginAtZero: true,
					min: graphMin,
					max: graphMax
				},
			}],
		}
	}
})

function compareCatsDescending(a, b) {
	if (a['total'] < b['total']) {
		return 1
	}
	if (a['total'] > b['total']) {
		return -1
	}
	return 0
}

var top5Cats = []
var catStats = {}

for (i = 0; i < cats.length; i++) {
	var cat = cats[i]
	catStats[cat] = {
		'name': cat
	},
	catStats[cat]['total'] = 0,
	catStats[cat]['left'] = 0,
	catStats[cat]['center'] = 0,
	catStats[cat]['right'] = 0
}


for (i = 0; i < cats.length; i++) {
	var cat = cats[i]
	for (j = 0; j < 3; j++) {
		var side = sides[j]
		var artsInCat = allSidesArts[side]['byCat'][cat]
		catStats[cat]['total'] += artsInCat.length
		catStats[cat][side] += artsInCat.length
	}
}

var allCatStats = []

for (key in catStats) {
	allCatStats.push(catStats[key])
}

var top5Cats = allCatStats.sort(compareCatsDescending).slice(0, 5)

var top5CatNames = top5Cats.map(function(e) {return e['name']})
var top5left = top5Cats.map(function(e) {return e['left'] / e['total']})
var top5center = top5Cats.map(function(e) {return e['center'] / e['total']})
var top5right = top5Cats.map(function(e) {return e['right'] / e['total']})

var catctx = document.getElementById('catChart').getContext('2d');
var catChart = new Chart(catctx, {
	type: 'horizontalBar',
	data: {
		labels: top5CatNames,
		datasets: [
		{	
			label: 'Right   ',
			data: top5right,
			backgroundColor: colorDict['right'],
			hoverBackgroundColor: colorDict['right']
		},
		{
			label: 'Center   ',
			data: top5center,
			backgroundColor: colorDict['center'],
			hoverBackgroundColor: colorDict['center']
		},
		{
			label: 'Left   ',
			data: top5left,
			backgroundColor: colorDict['left'],
			hoverBackgroundColor: colorDict['left']
		},]
	},
	options: {
		layout: {
			padding: {
				left: 0,
				right: padding,
				top: padding,
				bottom: padding,
			}
		},
		title: {
			display: true,
			position: 'top',
			text: 'Your 5 most-read topics',
			fontColor: 'black'
		},
		tooltips: {
			enabled: false
		},
		legend: {
			display: true,
			position: 'left',
			labels: {
				fontSize: 16,
				boxWidth: 20,
				fontStyle: 'bold',
				// fontColor: 'black'
				// boxHeight: 10
			},
			reverse: true
		},
		scales: {
			xAxes: [{
				display: false,
				stacked: true,
				ticks: {
					beginAtZero: true
				}
			}],
			yAxes: [{
				display: true,
				stacked: true,
				ticks: {
					beginAtZero: true
				}
			}],
		}
	}
})

var allCatPer = allCatStats.map(function (e) {return e['total']})
var labels = allCatStats.map(function (e) {return e['name']})

var doughColors = ['rgba(125,191,161,0.8)', 'rgb(141,199,173, 0.8)'
,'rgba(158,207,185,0.8)','rgba(174,215,196, 0.8)',
'rgba(190,223,208,0.8)','rgba(206,231,220,0.8)',
'rgba(223,239,232,0.8)','rgba(239,247,243,0.8)'].slice(0, cats.length)


var doughctx = document.getElementById('doughChart').getContext('2d')
var myDoughnutChart = new Chart(doughctx, {
    type: 'doughnut',
    options: {
    	layout: {
			padding: {
				left: padding,
				right: padding,
				top: padding,
				bottom: padding,
			}
		},
    	title: {
    		display: true,
    		position: 'top',
    		text: 'All topics',
    		fontColor: 'black'
    	},
    	tooltips: {
    		enabled: true,
    		callbacks: {
        title: function(tooltipItems, data) {
          	return '';
        },
        label: function(tooltipItem, data) {
          var datasetLabel = '';
          var label = data.labels[tooltipItem.index];
          return ' ' + data.labels[tooltipItem.index]
        }
      }
    	},
    	legend: {
    		display: false
    	}
    },
    data: {
    	labels: labels,
    	datasets: [{
    		data: allCatPer,
    		backgroundColor: doughColors
    	}]
    },
});