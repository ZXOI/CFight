function drawfps() {
	let str = FPS.toString() + " FPS";
	ctx.fillStyle = colors.fps;
	ctx.font = "15px Monospace";
	ctx.fillText(str, (boardw+2)*blockw - 9*str.length, (boardh+2)*blockw - 5);
}
function drawinfo() {
	ctx.fillStyle = colors.blank;
	ctx.fillRect((boardw+2)*blockw,0,infowidth,(boardh+2)*blockw);
	ctx.font="30px Monospace";
	ctx.fillStyle = colors.mapinfo;
	let str = "Map : " + maps[mapid].name;
	ctx.fillText(str, (boardw+2)*blockw + 15, 40);
	ctx.font = "20px Monospace";
	ctx.fillStyle = colors.teams[nowmove][0];
	str = "Team " + nowmove.toString() + " Moving.";
	ctx.fillText(str,(boardw+2)*blockw + 15, 75);
}
function drawmap() {
	ctx.fillStyle = colors.background;
	ctx.fillRect(0, 0, blockw*(boardw+2), blockw*(boardh+2));
	for(let j=0; j<=boardw+1; j+=1) {
		for(let i=0; i<=boardh+1; i+=1) {
			if(chessmap[i][j] > 10) {
				ctx.fillStyle = colors.teams[chessmap[i][j]-10][1] + "DD";
				ctx.fillRect(j*blockw, i*blockw, blockw, blockw);
				ctx.fillStyle = colors.background;
				ctx.fillRect(j*blockw+3, i*blockw+3, blockw-6, blockw-6);
				ctx.fillStyle = colors.teams[chessmap[i][j]-10][0] + "33";
				ctx.fillRect(j*blockw+3, i*blockw+3, blockw-6, blockw-6);
			}
			if(j<=0 || i<=0 || j>boardw || i>boardh) {
				continue;
			}
			ctx.fillStyle = colors.blank;
			ctx.fillRect(j*blockw, i*blockw, blockw, blockw);
			let k=1;
			for(let d=0; d<4; d+=1) {
				if((map[i][j] & k) > 0) {
					ctx.fillStyle = colors.obstacle;
					let x=j*blockw+(dir[d][0]+dir[d][1]-1)*dir[d][1]*blockw/4;
					let y=i*blockw+(dir[d][0]+dir[d][1]-1)*dir[d][0]*blockw/4;
					ctx.fillRect(x,y,(Math.abs(dir[d][0])+1)*blockw/2,(Math.abs(dir[d][1])+1)*blockw/2)
				}
				k = k*2;
			}
			if(selectedx==i && selectedy==j) {
				drawfillrect(j*blockw, i*blockw, blockw, blockw, 3, colors.selected, colors.selected + "33");
			}
		}
	}
	for(let i=0; i<=boardw; i+=1) {
		// console.log((i+1)*blockw-5, blockw, 10, boardh*blockw);
		ctx.fillStyle = colors.line;
		ctx.fillRect((i+1)*blockw-1, blockw, 2, boardh*blockw);
	}
	for(let i=0; i<=boardh; i+=1) {
		// console.log((i+1)*blockw-5, blockw, 10, boardh*blockw);
		ctx.fillStyle = colors.line;
		ctx.fillRect(blockw, (i+1)*blockw-1, boardw*blockw, 2);
	}
	// console.log("drawed.");
}
function drawchess() {
	// console.log("Selected chess ",selectedchess);
	for(let i in chesses){
		let e = chesses[i];
		e.draw();
		if(i == selectedchess && nowmove == e.team){
			e.draw_possibilities();
		}
	}
}
function drawflag() {
	for(let i in flags){
		let e = flags[i];
		e.draw();
	}
}

function drawflagpoints() {
	let s = 0;
	for(let i = 1; i <= team_cnt; i += 1) {
		let sx = s / (team_cnt * 20) * (boardw + 2) * blockw;
		let w = flag_points[i] / (team_cnt * 20) * (boardw + 2) * blockw;
		ctx.fillStyle = colors.teams[i][0];
		ctx.fillRect(sx,0,w,20);
		s += flag_points[i];
	}
}

function drawmessage() {
	ctx.fillRect((boardw+2)*blockw + 15,100,370,10);
	drawfillrect((boardw+2)*blockw + 15, 100, 370, 400, 3, colors.obstacle, colors.background);
	ctx.font = "20px Monospace";
	let y = 130;
	for(let i = 0; i < messages.length; i += 1) {
		ctx.fillStyle = colors.teams[messages[i].from][0];
		ctx.fillText(teams[messages[i].from].name, (boardw+2)*blockw + 15 + 10, y);
		ctx.fillStyle = colors.mapinfo;
		let rmsg = messages[i].text;
		rmsg = ": " +rmsg;
		for(let j = 0; j <= teams[messages[i].from].name.length; j += 1) {
			rmsg = " " + rmsg;
		}
		let spl = split_msg(rmsg);
		for(let j = 0; j < spl.length; j += 1) {
			ctx.fillText(spl[j], (boardw+2)*blockw + 15 + 10, y);
			y += 25 ;
		}
	}
}

function drawall() {
	drawfps();
	drawmap();
	drawinfo();
	drawflag();
	drawchess();
	drawflagpoints();
	drawmessage();
}