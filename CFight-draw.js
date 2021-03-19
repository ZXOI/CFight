function drawfps() {
	let str = FPS.toString() + " FPS";
	ctx.fillStyle = colors.fps;
	ctx.font = "15px Consolas";
	ctx.fillText(str, (boardw+2)*blockw - 9*str.length, (boardh+2)*blockw - 5);
}
function drawinfo() {
	ctx.font="30px Consolas";
	ctx.fillStyle = colors.mapinfo;
	let str = "Map : " + maps[mapid].name;
	// console.log(str);
	ctx.fillText(str, (boardw+2)*blockw/2-11*str.length, 30);
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
	console.log("Selected chess ",selectedchess);
	for(let i in chesses){
		let e = chesses[i];
		e.draw();
		if(i == selectedchess && nowmove == e.team){
			e.draw_possibilities();
		}
	}
}
function draw_player_moving() {
	ctx.font = "20px Consolas";
	ctx.fillStyle = colors.teams[nowmove][0];
	let str = "Team " + nowmove.toString() + " Moving.";
	ctx.fillText(str,boardw*blockw - 11*str.length + 110, 25);
}

function drawall() {
	drawfps();
	drawmap();
	drawinfo();
	drawchess();
	draw_player_moving();
}