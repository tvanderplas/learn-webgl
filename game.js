
var main=function() {
    var CANVAS = document.getElementById("game");
    var fullscreen=function() {
        try {
            CANVAS.requestFullscreen();
            CANVAS.requestPointerLock();
        } catch (e) {
            alert(e.toString());
        }
    };    
    var GL;
    try {
        GL = CANVAS.getContext("experimental-webgl", {antialias: true});
    } catch (e) {
        alert("You are not webgl compatible =[");
        return false;
    }
    var get_shader=function(source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("Error in " + typeString + " shader: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };
    var simple_vs = document.getElementById('simple_vs').innerHTML;
    var simple_fs = document.getElementById('simple_fs').innerHTML;
    var vertex_shader = get_shader(simple_vs, GL.VERTEX_SHADER, "VERTEX");
    var fragment_shader = get_shader(simple_fs, GL.FRAGMENT_SHADER, "FRAGMENT");
    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, vertex_shader);
    GL.attachShader(SHADER_PROGRAM, fragment_shader);
    GL.linkProgram(SHADER_PROGRAM);
    GL.useProgram(SHADER_PROGRAM);

    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);

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
    var TRIANGLE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(triangle_vertex),
        GL.STATIC_DRAW
    );

    var triangle_faces = [
        0, 1, 2,
        0, 2, 3
    ];
    var TRIANGLE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(triangle_faces),
        GL.STATIC_DRAW
    );

    var animate=function() {
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
        GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4*(2+3), 0);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(2+3), 2*4);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);

        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate();
};
