export const HARBOUR_WORLD = Object.freeze({
  width: 2000,
  height: 1200,
  legacy: Object.freeze({x:220,y:80,width:1400,height:900}),
});

export function legacyPoint(x,y) {
  return {x:x+HARBOUR_WORLD.legacy.x,y:y+HARBOUR_WORLD.legacy.y};
}

export function legacyBounds([x1,y1,x2,y2]) {
  const {x,y}=HARBOUR_WORLD.legacy;
  return [x1+x,y1+y,x2+x,y2+y];
}
