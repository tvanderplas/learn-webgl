
function fibonacci(n) {
	var phi = (1 + Math.sqrt(5)) / 2;
	f = (Math.pow(phi, n) - Math.pow((-phi), -n)) / (2 * phi - 1);
	return Math.round(f);
}

for (var i = 15; i <= 100; i++) {
	var answer = document.createElement('a');
	answer.innerHTML = fibonacci(i);
	document.body.appendChild(answer);
	line = document.createElement('br');
	document.body.appendChild(line);
}
