export const CHARACTER_PRESENTATION = Object.freeze({
 juan:{file:'/art/characters/juan.png',width:415,height:834,standingHeight:166},
 joel:{file:'/art/characters/joel.png',width:327,height:846,standingHeight:205},
 aspen:{file:'/art/characters/aspen.png',width:325,height:855,standingHeight:185},
 yasmin:{file:'/art/characters/yasmin.png',width:364,height:856,standingHeight:190},
 dima:{file:'/art/characters/dima.png',width:316,height:850,standingHeight:194},
 wong:{file:'/art/characters/wong.svg',width:70,height:56,standingHeight:52},
 sonya:{file:'/art/characters/sonya.svg',width:48,height:60,standingHeight:68},
});
export const LOCATION_CHARACTER_SCALE={viewing_room:.92,sonyas_kitchen:.92,back_room:.94,joels_bar:1,nursery:1,harbour_berth:1,cliff_path:1};
export function characterGeometry(id,scale=1){
 const c=CHARACTER_PRESENTATION[id];if(!c)return null;
 const height=c.standingHeight*scale,width=height*c.width/c.height;
 return {...c,renderWidth:width,renderHeight:height,feet:[.5,1],hit:id==='wong'?`M${-width*.46} -${height*.7}H${width*.46}V0H${-width*.46}Z`:`M-11 -${height}H11L18 -${height*.78}L25 -${height*.65}V0H-25V-${height*.65}L-18 -${height*.78}Z`};
}
