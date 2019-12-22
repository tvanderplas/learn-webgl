
var main=function() {
    var canvas = document.getElementById("game");
    var gl;
    try {
        gl = canvas.getContext("experimental-webgl", {antialias: true});
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
    var simple_vs = document.getElementById('simple_vs').innerHTML;
    var simple_fs = document.getElementById('simple_fs').innerHTML;
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
    var animate=function() {
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
        gl.vertexAttribPointer(_position, 2, gl.FLOAT, false, 4*(2+3), 0);
        gl.vertexAttribPointer(_color, 3, gl.FLOAT, false, 4*(2+3), 2*4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        gl.flush();
        window.requestAnimationFrame(animate);
    };
    animate();
};
var fullscreen=function() {
    CANVAS = document.getElementById("game");
    CANVAS.requestFullscreen();
    CANVAS.requestPointerLock();
};
