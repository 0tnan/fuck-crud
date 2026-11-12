import{a as e,n as t,u as n}from"./kit-s-XE6egu.js";import{C as r,D as i,E as a,M as o,O as s,P as c,S as l,a as u,f as d,k as f,l as p,o as m,v as h,y as g}from"./index-MIEi2PD9.js";var _={az:0,el:.5,dist:9,sway:.3},v=`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,y=`precision highp float; varying vec2 vUv; uniform sampler2D tex; uniform vec2 px; uniform float f, k;
void main(){
  vec2 c = texture2D(tex, vUv).xy;
  vec2 lap = texture2D(tex, vUv + vec2(px.x, 0.)).xy + texture2D(tex, vUv - vec2(px.x, 0.)).xy
           + texture2D(tex, vUv + vec2(0., px.y)).xy + texture2D(tex, vUv - vec2(0., px.y)).xy - 4. * c;
  float r = c.x * c.y * c.y;
  gl_FragColor = vec4(c.x + lap.x * .2097 - r + f * (1. - c.x), c.y + lap.y * .105 + r - (f + k) * c.y, 0., 1.);
}`,b=`precision highp float; varying vec2 vUv; uniform sampler2D tex; uniform vec3 ink;
void main(){
  float v = texture2D(tex, vUv).y;
  float edge = smoothstep(.12, .2, v) - smoothstep(.24, .34, v) * .75;
  gl_FragColor = vec4(ink, edge);
}`;function x(_,{renderer:x,onDispose:S}){let C={type:d,minFilter:h,magFilter:h,wrapS:i,wrapT:i,depthBuffer:!1},w=new c(256,256,C),T=new c(256,256,C),E=new Float32Array(262144);for(let e=0;e<65536;e++)E[e*4]=1;for(let e=0;e<26;e++){let e=20+Math.random()*216|0,t=20+Math.random()*216|0;for(let n=-4;n<=4;n++)for(let r=-4;r<=4;r++){let i=((t+n)*256+e+r)*4;E[i]=.5,E[i+1]=.25}}let D=new m(E,256,256,a,p);D.needsUpdate=!0;let O=new f({vertexShader:v,fragmentShader:y,uniforms:{tex:{value:D},px:{value:new o(1/256,1/256)},f:{value:.0367},k:{value:.0649}}}),k=new g(new r(2,2),O),A=new l(-1,1,1,-1,0,1),j=new s().add(k),M=new f({vertexShader:v,fragmentShader:b,transparent:!0,side:2,depthWrite:!1,uniforms:{tex:{value:null},ink:{value:new u(t)}}}),N=new g(new r(6,6),M);N.rotation.x=-Math.PI/2,_.add(N,n([e(-3,0,-3),e(3,0,-3),e(3,0,3),e(-3,0,3)],t,.5,!0)),S(()=>{w.dispose(),T.dispose(),D.dispose(),k.geometry.dispose(),O.dispose()});let P=!0;return(e,t,n)=>{if(t===0&&!P)return;O.uniforms.f.value=.03+.0067*n;let r=x.getRenderTarget();for(let e=0;e<(P?1800:10);e++){x.setRenderTarget(T),x.render(j,A),O.uniforms.tex.value=T.texture;let e=w;w=T,T=e}P=!1,x.setRenderTarget(r),M.uniforms.tex.value=w.texture}}export{x as default,_ as view};