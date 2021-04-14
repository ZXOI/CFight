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
			if(px<=0 || py<=0 || px>boardh || py>boardw){
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
		let chess_cnt = 0;
		let i = this.x, j = this.y;
		let dis = 0;
		let lst = -1;
		for(let _i = i+dir[d][0], _j = j+dir[d][1]; get_chess_by_pos(_i,_j)!=-1; _i+=dir[d][0], _j+=dir[d][1], chess_cnt+=1);
		// console.log(chess_cnt);
		for(let _d=1; _d<=chess_cnt; _d+=1) {
			let _i = i + dir[d][0] * chess_cnt;
			let _j = j + dir[d][1] * chess_cnt;
			if((map[_i][_j] & (1<<d)) != 0) {
				return 0;
			}
		}
		for(;; i += dir[d][0],j += dir[d][1], dis += 1){
			if((map[i][j] & (1<<d)) != 0) {
				return dis;
			}
			let k = get_chess_by_pos(i + dir[d][0], j + dir[d][1]);
			if(k!=-1){
				chess_cnt += 1;
				lst = k;
			}
			let _i = i + dir[d][0] * chess_cnt;
			let _j = j + dir[d][1] * chess_cnt;
			// if(k!=-1)console.log(d,chesses[k].x,chesses[k].y);
			if(_i < 1 || _i > boardh || _j < 1 || _j > boardw){
				// if(lst!=-1)console.log(">",d,chesses[lst].team==this.team);
				return dis - (chess_cnt == 0) - (lst!=-1 && chesses[lst].team==this.team && !chesses[lst].at_border[d]);
			}
			// console.log(d);
			if((map[_i][_j] & (1<<d)) != 0) {
				return dis;
			}
		}
	}
	this.check_alive = () => {
		let k = this.alive;
		if(this.x < 1 || this.y < 1 || this.x > boardh || this.y > boardw){
			this.alive = 0;
		}
		if(k==1 && !this.alive) {
			chess_cnt[this.team] -= 1;
			if(chess_cnt[this.team] == 0) {
				losing.push(this.team);
			}
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
		for(let mvcnt = 0; mvcnt < dis; mvcnt += 1) {
			let last = get_chess_by_pos(this.x, this.y);
			let i = this.x + dir[d][0], j = this.y + dir[d][1];
			let cnt = 0;
			while(get_chess_by_pos(i,j)!=-1){
				let tmp = get_chess_by_pos(i,j);
				chesses[last].x += dir[d][0];
				chesses[last].y += dir[d][1];
				last = tmp;
				i += dir[d][0];
				j += dir[d][1];
				cnt += 1;
			}
			chesses[last].x += dir[d][0];
			chesses[last].y += dir[d][1];
			//console.log(cnt);
		}
	}
	this.move_to = (x, y) => {
		let dx=x-this.x, dy=y-this.y;
		let d = getDir(this.x, this.y, x, y);
		if(d == -1) {
			return 0;
		}
		//console.log("Chess move dir ",d," ,dis ", Math.abs(dx+dy)," to ",x,y);
		if(this.can_move(d) >= Math.abs(dx+dy)) {
			this.move(d, Math.abs(dx+dy));
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
		drawcirc(y, x, chessr1, chessr2, colors.teams[this.team][0] + toHex(Math.max(this.tprc,1)), colors.teams[this.team][1] + toHex(Math.max(this.tprc - toDec("CC"),1)));
	}
	this.update = () => {
		this.update_atborder();
		this.check_alive();
		if(!this.alive) {
			this.tprc -= 2;
			this.tprc = Math.max(this.tprc,0);
		}
		if(!this.tprc) {
			let k = get_chess_by_pos(this.x,this.y);
			chesses[k] = chesses[chesses.length - 1];
			chesses.pop();
		}
	}
	this.check_get = () => {
		if(chessmap[this.x][this.y] != this.team+10 && chessmap[this.x][this.y] > 10)
		{
			return chessmap[this.x][this.y] - 10;
		}
		return 0;
	}
}
function Flag (_x, _y) {
	this.x = _x;
	this.y = _y;

	this.update = () => {
	}

	this.update_flagpoints = () => {
		let k = get_chess_by_pos(this.x,this.y);
		if(k != -1) {
			let cnt = 0;
			for(let i = 1; i <= team_cnt ;i+= 1) {
				if(i != chesses[k].team && flag_points[i] > 0) {
					cnt += 1;
					flag_points[i] -= 1;
				}
			}
			flag_points[chesses[k].team] += cnt;
		}
	}

	this.draw = () => {
		drawfillrect(this.y*blockw, this.x*blockw, blockw, blockw, 3, colors.flag, colors.flag+"33");
	}
}

function Message(from, text) {
	this.from = from;
	this.text = text;
}

function add_chess() {
	for(let i = 0; i <= boardh; i+= 1) {
		for(let j = 0; j <= boardw; j+= 1) {
			if(chessmap[i][j] != 0 && chessmap[i][j] <= 10) {
				chesses.push(new Chess(i, j, chessmap[i][j]));
				chess_cnt[chessmap[i][j]] += 1;
			}
		}
	}
}

function add_flag() {
	for(let i = 0; i <= boardh; i+= 1) {
		for(let j = 0; j <= boardw; j+= 1) {
			if(spclmap[i][j] == 1) {
				flags.push(new Flag(i, j));
			}
		}
	}
	for(let i = 0; i <= team_cnt; i+= 1) {
		flag_points.push(20);
	}
}

function add_player() {
	survive.push(1);
	chess_cnt.push(0);
	for(let i = 1; i <= team_cnt; i += 1) {
		survive.push(1);
		chess_cnt.push(0);
	}
}

function update_chess() {
	for(let i in chesses) {
		chesses[i].update();
	}
	for(let i in chesses) {
		if(chesses[i].check_get()) {
			losing.push(chesses[i].check_get());
		}
	}
}

function update_flag_points() {
	for(let i in flags) {
		flags[i].update_flagpoints();
	}
	for(let i=1; i <= team_cnt; i+= 1) {
		if(flag_points[i] == 20*team_cnt) {
			win = i;
		}
	}
}

function update_lose() {
	let alivecnt = 0,alive = 0;
	for(let i=0; i<losing.length; i += 1) {
		if(survive[losing[i]]) {
			messages.push(new Message(losing[i],"Out of game."))
			survive[losing[i]] = 0;
		}
	}
	for(let i = 1; i <= team_cnt; i += 1) {
		if(survive[i]) {
			alivecnt += 1;
			alive = i;
		}
	}
	if(alivecnt == 1) {
		messages.push(new Message(alive, "Win."));
		return alive;
	}
	return 0;
}

function player_move(){
	if(chesses[selectedchess].move_to(selectedx,selectedy))
	{
		nowmove = (nowmove % team_cnt) + 1;
		while(!survive[nowmove]){
			nowmove = (nowmove % team_cnt) + 1;
		}
		round += 1;
		update_flag_points();
		return 1;
	}
	return 0;
}

function mouse_select(x, y) {
	if(selectedx == x && selectedy == y) {
		selectedx = -1;
		selectedy = -1;
		selectedchess = -1;
		return;
	}
	selectedx = x;
	selectedy = y;
	let selectchess = get_chess_by_pos(x, y);
	if(selectedchess != -1 && chesses[selectedchess].team == nowmove) {
		let k = player_move();
		if(k) {
			selectedchess = -1;
			return;
		}
	}
	selectedchess=selectchess;
}