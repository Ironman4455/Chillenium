class Material
{
	constructor(gl, vs, fs)
	{
		this.gl = gl;
		
		let vsShader = this.getShader(vs, gl.VERTEX_SHADER);
		let fsShader = this.getShader(fs, gl.FRAGMENT_SHADER);
		
		if(vsShader && fsShader)
		{
			this.program = gl.createProgram();
			gl.attachShader(this.program, vsShader);
			gl.attachShader(this.program, fsShader);
			gl.linkProgram(this.program);
			
			if(!gl.getProgramParameter(this.program, gl.LINK_STATUS))
			{
				console.error("Cannot load shader \n"+gl.getProgramInfoLog(this.program));
				return null;
			}
			
			this.gatherParameters();
			
			gl.detachShader(this.program, vsShader);
			gl.detachShader(this.program, fsShader);
			gl.deleteShader(vsShader);
			gl.deleteShader(fsShader);
			
			gl.useProgram(null);
		}
	}
	
	getShader(script, type)
	{
		let gl = this.gl;
		var output = gl.createShader(type);
		gl.shaderSource(output, script);
		gl.compileShader(output);
		
		if(!gl.getShaderParameter(output, gl.COMPILE_STATUS))
		{
			console.error("Shader error: \n:" + gl.getShaderInfoLog(output));
			return null;
		}
		
		return output;
	}
	
	gatherParameters()
	{
		let gl = this.gl;
		let isUniform = 0;
		
		this.parameters = {};
		
		while(isUniform < 2 )
		{
			let paramType = isUniform ? gl.ACTIVE_UNIFORMS : gl.ACTIVE_ATTRIBUTES;
			let count = gl.getProgramParameter(this.program, paramType);
			
			for(let i = 0; i < count; i++)
			{
				let details;
				let location;
				if(isUniform)
				{
					details = gl.getActiveUniform(this.program, i);
					location = gl.getUniformLocation(this.program, details.name);
				}
				else
				{
					details = gl.getActiveAttrib(this.program, i);
					location = gl.getAttribLocation(this.program, details.name);
				}
				
				this.parameters[details.name] =
				{
					location : location,
					uniform : !!isUniform,
					type : details.type
				}
			}
			isUniform++;
		}
	}
	
	set(name, a, b, c, d, e)
	{
		let gl = this.gl;
		
		if (name in this.parameters)
		{
			let param = this.parameters[name];
			if(param.uniform)
			{
				switch(param.type)
				{
					case gl.FLOAT: gl.uniform1f(param.location, a); break;
					case gl.FLOAT_VEC2: gl.uniform2f(param.location, a, b); break;
					case gl.FLOAT_VEC3: gl.uniform3f(param.location, a, b, c); break;
					case gl.FLOAT_VEC4: gl.uniform4f(param.location, a, b, c, d); break;
					case gl.FLOAT_MAT3: gl.uniformMatrix3fv(param.location, false, a); break;
					case gl.FLOAT_MAT4: gl.uniformMatrix4fv(param.location, false, a); break;
					case gl.SAMPLER_2D: gl.uniform1i(param.location, a); break;
					
				}
			}
			else
			{
				gl.enableVertexAttribArray(param.location);
				
				if(a == undefined) a = gl.FLOAT;
				if(b == undefined) b = false;
				if(c == undefined) c = 0;
				if(d == undefined) d = 0;
					
				switch(param.type)
				{
					case gl.FLOAT: gl.vertexAttribPointer(param.location, 1, a, b, c, d); break;
					case gl.FLOAT_VEC2: gl.vertexAttribPointer(param.location, 2, a, b, c, d); break;
					case gl.FLOAT_VEC3: gl.vertexAttribPointer(param.location, 3, a, b, c, d); break;
					case gl.FLOAT_VEC4: gl.vertexAttribPointer(param.location, 4, a, b, c, d); break;
				}
			}
		}
	}
}

class Sprite
{
	constructor(gl, img_url, vs, fs, opts={})
	{
		this.gl = gl;
		this.isLoaded = false;
		this.material = new Material(gl,vs,fs);
		
		this.size = new Point(64, 64);
		if ("width" in opts)
		{
			this.size.x = opts.width * 1;
		}
		if ("height" in opts)
		{
			this.size.y = opts.height * 1;
		}
		
		this.image = new Image();
		this.image.src = img_url;
		this.image.sprite = this;
		this.image.onload = function()
		{
			this.sprite.setup();
		}
		
		
	}
	
	static createRectArray(x=0, y=0, w=1, h=1)
	{
		return new Float32Array
		([
			x, y,
			x+w, y,
			x, y+h,
			x, y+h,
			x+w, y,
			x+w, y+h
		]);
	}
	
	setup()
	{
		let gl = this.gl;
		
		gl.useProgram(this.material.program);
		this.gl_tex = gl.createTexture();
		
		gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		this.uv_x = this.size.x / this.image.width;
		this.uv_y = this.size.y / this.image.height;
		
		this.tex_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.uv_x, this.uv_y), gl.STATIC_DRAW);
		
		this.geo_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.size.x, this.size.y), gl.STATIC_DRAW);
		
		gl.useProgram(null);
		this.isLoaded = true;
		
	}
	
	render(position, frames, mirrored)
	{
		if(this.isLoaded)
		{
			let gl = this.gl;
			
			let frame_x = Math.floor(frames.x) * this.uv_x;
			let frame_y = Math.floor(frames.y) * this.uv_y;
			
			//console.log(" rendering ... \n" );
			
			let obj_mat = new M3x3().transition(position.x, position.y).scale(mirrored, 1);
			
			gl.useProgram(this.material.program);
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
			this.material.set("u_image", 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
			this.material.set("a_texCoord");
						
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
			this.material.set("a_position");
			
			this.material.set("u_frame", frame_x, frame_y);
			this.material.set("u_world", window.game.worldSpaceMatrix.getFloatArray());
			this.material.set("u_object", obj_mat.getFloatArray());
			
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
			
			gl.useProgram(null);
		}
	}
}