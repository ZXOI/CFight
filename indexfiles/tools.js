function pop_front(a) {
	for(let i in a) {
		if(i != 0) {
			a[i-1] = a[i];
		}
	}
	a.pop();
}

function drawfillrect(x, y, a, b, d, col, fillcol) {
	ctx.fillStyle = col;
	ctx.fillRect(x, y, a, d);
	ctx.fillRect(x, y, d, b);
	ctx.fillRect(x+a-d, y, d, b);
	// console.log(x+a-d,y,a,d);
	ctx.fillRect(x, y+b-d, a, d);
	ctx.fillStyle = fillcol;
	ctx.fillRect(x+d, y+d, a-d*2, b-d*2);
}
function drawcirc(ox, oy, r1, r2, col, fillcol) {
	ctx.beginPath();
	ctx.lineWidth = r2-r1;
	ctx.strokeStyle = col;
	ctx.arc(ox, oy, (r1+r2)/2, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.lineWidth = r1;
	ctx.strokeStyle = fillcol;
	ctx.arc(ox, oy, r1/2, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
}

var mousex = 0, mousey = 0;
var selectedx = -1, selectedy = -1;
document.addEventListener('click', getmousepos);

var cvs = document.getElementById('board');

function getmousepos(e) {
	mousex = e.clientX - 6;
	mousey = e.clientY - 6;
	mouse_select(Math.floor(mousey/blockw),Math.floor(mousex/blockw));
}

function updatefps() {
	let d = new Date();
	let val = d.getMilliseconds() + 1000*d.getSeconds() + 60000*d.getMinutes() + 3600000*d.getHours();
	fpsqueue.push(val);
	while(val - fpsqueue[0] >= 1000) {
		pop_front(fpsqueue);
	}
	if(clock % 10 == 0)FPS = fpsqueue.length;
}

function toHex_by_digit(dgt) {
	if(dgt <= 9) {
		return dgt.toString();
	}
	if(dgt == 10) { return "A"; }
	if(dgt == 11) { return "B"; }
	if(dgt == 12) { return "C"; }
	if(dgt == 13) { return "D"; }
	if(dgt == 14) { return "E"; }
	if(dgt == 15) { return "F"; }
}
function toDec_by_digit(dgt) {
	if(dgt == "0") { return 0; }
	if(dgt == "1") { return 1; }
	if(dgt == "2") { return 2; }
	if(dgt == "3") { return 3; }
	if(dgt == "4") { return 4; }
	if(dgt == "5") { return 5; }
	if(dgt == "6") { return 6; }
	if(dgt == "7") { return 7; }
	if(dgt == "8") { return 8; }
	if(dgt == "9") { return 9; }
	if(dgt == "A") { return 10; }
	if(dgt == "B") { return 11; }
	if(dgt == "C") { return 12; }
	if(dgt == "D") { return 13; }
	if(dgt == "E") { return 14; }
	if(dgt == "F") { return 15; }
}
function toHex(a) {
	let ans = "";
	while(a != 0) {
		let x = a % 16;
		a = Math.floor(a / 16);
		ans = toHex_by_digit(x) + ans;
	}
	if(ans.length <= 1) {
		ans = "0" + ans;
	}
	return ans;
}
function toDec(a) {
	let ans = 0;
	for(let i = 0; i < a.length; i+=1) {
		ans *= 16;
		ans+= toDec_by_digit(a[i]);
	}
	return ans;
}

function getDir(sx, sy, ex, ey) {
	let dx = ex-sx, dy = ey-sy;
	if(dx == 0 && dy > 0){ return 0; }
	if(dx < 0 && dy == 0){ return 1; }
	if(dx == 0 && dy < 0){ return 2; }
	if(dx > 0 && dy == 0){ return 3; }
	return -1;
}

function swap(a,b) {
	let c = a;
	a = b;
	b = c;
}

function get_random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand_one(a) {
	return a[get_random(0, a.length-1)];
}

function get_map(a) {
	let str = "Choose a map from :\n";
	for(let i in a) {
		str += "    " + a[i].toString() + " : " +maps[a[i]].name + "\n";
	}
	let ret = prompt(str,rand_one(a));
	return ret;
}

function get_msg_line(str) {
	return Math.ceil(str.length/max_msg_chars_per_line);
}

function get_all_msg_line() {
	let ans = 0;
	for(let i = 0; i < messages.length; i += 1) {
		ans += get_msg_line(messages[i]);
	}
	return ans;
}

function add_msg(str) {
	let thline = get_msg_line(str);
	if(thline >= max_msg_line) {
		return 0;
	}
	while(get_all_msg_line() + thline > max_msg_line) {
		pop_front(messages);
	}
	messages.push(str);
}

function split_msg(str) {
	let ans = new Array();
	let i = 0;
	while(i + max_msg_chars_per_line < str.length) {
		ans.push(str.substr(i,max_msg_chars_per_line));
		i += max_msg_chars_per_line;
	}
	ans.push(str.substr(i));
	return ans;
}