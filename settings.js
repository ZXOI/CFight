var ctx=document.getElementById("board").getContext("2d");
const blockw = 60;
const boardw = 17,boardh = 9;
const dir = [[0, 1], [-1, 0], [0, -1], [1, 0]];
const chessr1 = 15, chessr2 = 18;
const team_cnt = 2;

const colors = {
	teams:[["#FFFFFF","#EEEEEE"],["#D70450","#B50028"],["#44B7CD","#2295AB"]],
	background:"#1E1F1C",
	blank:"#272822",
	obstacle:"#49483E",
	line:"#75715E88",
	selected:"#A6E22E",
	possiblilty:"#A6E22E",
	mapinfo:"#F8F8F2",
	fps:"#00FF00",
};

const maps = [{
		name:"test",
		map:[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,1,0,2,0,3,0,4,0,5,0,6,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,8,0,9,0,10,0,11,0,12,0,13,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		],
		teammap:[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
			[11,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,12],
			[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		]
	}
];