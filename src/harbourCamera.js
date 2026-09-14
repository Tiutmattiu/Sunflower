const widthOf=value=>value?.w ?? value?.width ?? 0;
const heightOf=value=>value?.h ?? value?.height ?? 0;
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export function coverScale(viewport,world) {
  const vw=widthOf(viewport),vh=heightOf(viewport),ww=widthOf(world),wh=heightOf(world);
  if(vw<=0||vh<=0||ww<=0||wh<=0)return 1;
  return Math.max(vw/ww,vh/wh);
}

export function clampCamera(camera,viewport,world) {
  const base=coverScale(viewport,world);
  const z=clamp(Number.isFinite(camera?.z)?camera.z:1,1,4.8);
  const vw=widthOf(viewport),vh=heightOf(viewport);
  const sw=widthOf(world)*base*z,sh=heightOf(world)*base*z;
  const minX=Math.min(0,vw-sw),minY=Math.min(0,vh-sh);
  const x=sw<=vw?(vw-sw)/2:clamp(Number.isFinite(camera?.x)?camera.x:0,minX,0);
  const y=sh<=vh?(vh-sh)/2:clamp(Number.isFinite(camera?.y)?camera.y:0,minY,0);
  return {x,y,z};
}

export function centeredCamera(viewport,world,z=1) {
  const base=coverScale(viewport,world);
  const nextZ=clamp(z,1,4.8);
  return clampCamera({
    x:(widthOf(viewport)-widthOf(world)*base*nextZ)/2,
    y:(heightOf(viewport)-heightOf(world)*base*nextZ)/2,
    z:nextZ,
  },viewport,world);
}

export function zoomCamera(camera,factor,pivot,viewport,world) {
  const current=clampCamera(camera,viewport,world);
  const nextZ=clamp(current.z*factor,1,4.8);
  const ratio=nextZ/current.z;
  const px=pivot?.x ?? widthOf(viewport)/2;
  const py=pivot?.y ?? heightOf(viewport)/2;
  return clampCamera({
    x:px-(px-current.x)*ratio,
    y:py-(py-current.y)*ratio,
    z:nextZ,
  },viewport,world);
}

export function focusCamera(point,viewport,world,z=2.15) {
  const base=coverScale(viewport,world);
  const nextZ=clamp(z,1,4.8);
  return clampCamera({
    x:widthOf(viewport)/2-point.x*base*nextZ,
    y:heightOf(viewport)*.48-point.y*base*nextZ,
    z:nextZ,
  },viewport,world);
}
