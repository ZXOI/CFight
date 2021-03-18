function get_chess_by_pos(_x, _y){
	for(let i in chesses){
		let e = chesses[i];
		if(e.x == _x && e.y == _y){
			return i;
		}
	}
	return -1;
}

function Chess(_x, _y, _t){
	this.x = _x;
	this.y = _y;
	this.team = _t;
	this.at_border = new Array(this.x==boardh,this.y==1,this.x==1,this.y==boardw);
	this.alive = 1;
	this.tprc = 255;
	
	this.update_atborder = () => {
		for(let d=0; d<4; d+=1) {
			let px = this.x+dir[d][0], py = this.y+dir[d][1];
			if(px<=0 || py<=0 || px>=boardh || py>=boardw){
				this.at_border[d] = true;
			}
			else {
				this.at_border[d] = false;
			}
		}
	}
	this.can_move = (d) => {
		if(d == -1) {
			return 0;
		}
		if(this.alive == 0){
			return 0;
		}
		if(this.at_border[d]){
			return 1;
		}
		if(map[this.x][this.y] & (1<<d)){
			return 1;
		}
		let chess_cnt=0;
		let i = this.x, j = this.y;
		let dis = 0;
		for(;; i += dir[d][0],j += dir[d][1],dis++){
			let k = get_chess_by_pos(i + dir[d][0], j + dir[d][1]);
			if(k!=-1){
				chess_cnt ++;
			}
			let _i = i + dir[d][0] * chess_cnt;
			let _j = j + dir[d][1] * chess_cnt;
			if((map[_i][_j] & (1<<d))|| _i < 1 || _i > boardh || _j < 1 || _j > boardw){
				return dis;
			}
		}
	}
	this.check_alive = () => {
		if(this.x < 1 || this.y < 1 || this.x > boardh || this.y > boardw){
			this.alive = 0;
		}
	}
	this.draw_possibilities = () => {
		for(let d=0; d < 4; d+=1) {
			let maxlen = this.can_move(d);
			let px = this.x;
			let py = this.y;
			for (let l=0; l <maxlen; l+=1) {
				px += dir[d][0];
				py += dir[d][1];
				let tx=px*blockw;
				let ty=py*blockw;
				ctx.fillStyle = colors.possiblilty + "33";
				ctx.fillRect(ty, tx, blockw, blockw);
			}
		}
	}
	this.move = (d, dis) => {
		chess_on_way = new Array();
		let i = this.x, j = this.y;
		let mvcnt = 0;
		for(;mvcnt < dis; i += dir[d][0],j += dir[d][1],mvcnt += 1) {
			let k = get_chess_by_pos(i + dir[d][0], j + dir[d][1]);
			if(k!=-1) {
				chess_on_way.push(k);
			}
		}
		for(let i in chess_on_way) {
			chesses[chess_on_way[i]].move(d, dis-abs(chess[chess_on_way[i]].x-this.x)-abs(chess[chess_on_way[i]].y-this.y));
		}
		this.x += dis * dir[d][0];
		this.y += dis * dir[d][1];
	}
	this.move_to = (x, y) => {
		let dx=x-this.x, dy=y-this.y;
		let d = getDir(this.x, this.y, x, y);
		if(d == -1) {
			return 0;
		}
		console.log("Chess move to ",x,y);
		if(this.can_move(d) >= dx+dy) {
			this.move(d, dx+dy);
			return 1;
		}
		// this.check_alive()
		return 0;
	}
	this.can_move_to = (x, y) => {
		let d = getDir(this.x, this.y, x, y)
		return d!=-1 && this.can_move(d)>=abs(this.x-x)+abs(this.y-y);
	}
	this.draw = () => {
		let x=this.x*blockw+blockw/2;
		let y=this.y*blockw+blockw/2;
		drawcirc(y, x, chessr1, chessr2, colors.teams[this.team][0] + toHex(this.tprc), colors.teams[this.team][1] + toHex(this.tprc - toDec("CC")));
	}
	this.update = () => {
		this.update_atborder();
		this.check_alive();
		if(!this.alive && toDec(this.tprc) > 0) {
			this.tprc -= 1;
		}
	}
}

function add_chess() {
	for(let i = 0; i <= boardh; i++) {
		for(let j = 0; j <= boardw; j++) {
			// console.log(i,j,chessmap[i][j]);
			if(chessmap[i][j] != 0 && chessmap[i][j] <= 10) {
				chesses.push(new Chess(i, j, chessmap[i][j]));
			}
		}
	}
}
function update_chess() {
	for(let i in chesses) {
		chesses[i].update();
	}
}

function player_move(){
	nowmove += chesses[selectedchess].move_to(selectedx,selectedy);
	nowmove %= team_cnt;
	nowmove ++;
}

function mouse_select(x, y) {
	if(selectedx == x && selectedy == y) {
		selectedx = -1;
		selectedy = -1;
		return;
	}
	selectedx = x;
	selectedy = y;
	let selectchess = get_chess_by_pos(x, y);
	console.log(selectchess);
	// if(selectedchess != -1 && chesses[selectedchess].team == nowmove && chesses[selectedchess].can_move(getDir()))
	if(selectedchess != -1 && chesses[selectedchess].team == nowmove) {
		player_move();
		selectedchess = -1;
		return;
	}
	if(selectedchess == -1) {
		selectedchess=selectchess;
	}
}