
function loadTextFile(url) {
    return fetch(url).then(response => response.text());
}
const urls = [
    './simple.vs',
    './simple.fs',
    // './sky.obj',
    // './sky.mtl',
    // './sky.png',
];

async function main() {
    var canvas = document.getElementById("game");
    var gl;
    try {
        gl = canvas.getContext("webgl", {antialias: true});
    } catch (e) {
        alert("You are not webgl compatible =[");
        canvas.style.background = "red";
        return false;
    }
    var get_shader=function(source, type, typeString) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("Error in " + typeString + " shader: " + gl.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };
    const files = await Promise.all(urls.map(loadTextFile));
    var simple_vs = files[0];
    var simple_fs = files[1];
    var vertex_shader = get_shader(simple_vs, gl.VERTEX_SHADER, "VERTEX");
    var fragment_shader = get_shader(simple_fs, gl.FRAGMENT_SHADER, "FRAGMENT");
    var SHADER_PROGRAM = gl.createProgram();
    gl.attachShader(SHADER_PROGRAM, vertex_shader);
    gl.attachShader(SHADER_PROGRAM, fragment_shader);
    gl.linkProgram(SHADER_PROGRAM);
    gl.useProgram(SHADER_PROGRAM);

    var _color = gl.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = gl.getAttribLocation(SHADER_PROGRAM, "position");
    gl.enableVertexAttribArray(_color);
    gl.enableVertexAttribArray(_position);

    var triangle_vertex = [
        -1, -1,
        0, 1, 1,
        1, -1,
        0, 0, 0,
        1, 1,
        1, 1, 0,
        -1, 1,
        1, 1, 1
    ];
    var TRIANGLE_VERTEX = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(triangle_vertex),
        gl.STATIC_DRAW
    );

    var triangle_faces = [
        0, 1, 2,
        0, 2, 3
    ];
    var TRIANGLE_FACES = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(triangle_faces),
        gl.STATIC_DRAW
    );
    function resize() {
        var width = gl.canvas.clientWidth;
        var height = gl.canvas.clientHeight;
        if (gl.canvas.width != width || gl.canvas.height != height) {
            gl.canvas.width = width;
            gl.canvas.height = height;
        }
    };
    var animate=function() {
        resize();
        gl.viewport(0.0, 0.0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
        gl.vertexAttribPointer(_position, 2, gl.FLOAT, false, 4*(2+3), 0);
        gl.vertexAttribPointer(_color, 3, gl.FLOAT, false, 4*(2+3), 2*4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        gl.flush();
        requestAnimationFrame(animate);
    };
    animate();
};
var fullscreen=function() {
    canvas = document.getElementById("game");
    canvas.requestFullscreen();
    canvas.requestPointerLock();
};
