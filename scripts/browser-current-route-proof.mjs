import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||(process.platform==='win32'?'msedge':undefined)});
const captures=fs.mkdtempSync(path.join(os.tmpdir(),'sunflower-current-'));
const results=[];
async function read(page){for(let i=0;i<25;i++){const line=page.locator('.spoken-line');if(!await line.count())return;const last=await line.getAttribute('aria-label')==='Finish reading';await line.click();if(last)return;}throw Error('Dialogue did not finish');}
async function close(page){for(const name of ['Close conversation','Close drawer','Close comic']){const b=page.getByRole('button',{name,exact:true});if(await b.count())await b.click();}}
async function look(page,name){
 await close(page);await page.getByRole('button',{name:'Reset harbour view',exact:true}).click();
 const target=page.getByRole('button',{name,exact:true});
 // Move the camera through real pointer input; DOM geometry only tells us which direction.
 for(let i=0;i<10;i++){
  const b=await target.boundingBox(),v=page.viewportSize(),x=b.x+b.width/2,y=b.y+b.height/2;
  if(x>40&&x<v.width-50&&y>80&&y<v.height-100)break;
  const dx=Math.max(-v.width*.6,Math.min(v.width*.6,v.width/2-x));
  const dy=Math.max(-v.height*.6,Math.min(v.height*.6,v.height*.45-y));
  const sx=dx>0?45:v.width-55,sy=dy>0?120:v.height-130;
  await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(sx+dx,sy+dy,{steps:12});await page.mouse.up();
 }
 await target.click();await read(page);
}
try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:name==='mobile'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(`${m.text()} ${m.location().url}`);});
  await page.goto(process.env.SUNFLOWER_URL||'http://127.0.0.1:5174/',{waitUntil:'networkidle'});
  assert.match(await page.locator('.harbour-guide').innerText(),/looking for a sunflower/);
  assert.doesNotMatch(await page.locator('body').innerText(),/one.?wheel|unicycle|race wager|sunflower field|steel rim/i);
  await page.screenshot({path:path.join(captures,`${name}-arrival.png`)});
  await look(page,'the older man carrying plants');
  assert(await page.locator('.conversation').isVisible());
  const forbidden=/Orgeat|one.?wheel|unicycle|race|cliff|steel rim|quick.link|brake cable|sunflower field/i;
  assert.doesNotMatch(await page.locator('.conversation').innerText(),forbidden);
  await page.getByRole('button',{name:'Hello. Can we keep in touch?',exact:true}).click();await read(page);
  assert.doesNotMatch(await page.locator('.conversation').innerText(),forbidden);
  await close(page);
  for(const drawer of ['Open phone','Open newspaper','Open money and notes']){
   await page.getByRole('button',{name:drawer,exact:true}).click();
   assert.doesNotMatch(await page.locator('.pocket-drawer').innerText(),forbidden);
   assert.doesNotMatch(await page.locator('.pocket-drawer').innerText(),/Joel|Wong|Aspen|Yasmin|Dima|Sonya/);
   await close(page);
  }
  assert.equal(await page.getByRole('button',{name:'Wheel parts',exact:true}).count(),0);
  await look(page,'the young man in the yellow waistcoat');
  assert.doesNotMatch(await page.locator('.conversation').innerText(),forbidden);
  await close(page);
  assert.doesNotMatch(await page.locator('.harbour-world').textContent(),/JOEL|Wong/);
  assert.deepEqual(errors,[]);results.push({name,viewport:{width,height},freshSave:true,entry:'Visible Juan interaction'});await page.close();
 }
 console.log(JSON.stringify({results,captures},null,2));
}catch(error){for(const page of browser.contexts().flatMap(c=>c.pages())){console.error(await page.locator('body').innerText());await page.screenshot({path:path.join(captures,'failure.png')});}console.error(captures);throw error;}finally{await browser.close();}




