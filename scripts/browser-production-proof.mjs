import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const url=process.env.SUNFLOWER_URL||'http://127.0.0.1:5174/';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||(process.platform==='win32'?'msedge':undefined)});
const captures=fs.mkdtempSync(path.join(os.tmpdir(),'sunflower-play-'));
const results=[];
async function read(page){
 for(let n=0;n<16;n++){
  const next=page.getByRole('button',{name:'Read next line',exact:true});
  if(await next.count()){await next.click();continue;}
  const last=page.getByRole('button',{name:'Finish reading',exact:true});
  if(await last.count())await last.click();
  return;
 }
 throw Error('Dialogue did not reach a choice');
}
async function look(page,name){
 const close=page.getByRole('button',{name:'Close conversation',exact:true});if(await close.count())await close.click();
 await page.getByRole('button',{name:'See whole harbour',exact:true}).click();
 await page.getByRole('button',{name,exact:true}).click();
 await read(page);
}
async function act(page,name){await page.getByRole('button',{name,exact:true}).click();await read(page);}
async function next(page){await page.getByRole('button',{name:'Next day',exact:true}).click();}
async function through(page,day){while(Number((await page.locator('.pocket-top>span').innerText()).replace(/\D/g,''))<day)await next(page);}
try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  await page.screenshot({path:path.join(captures,`${name}-arrival.png`)});
  await page.getByRole('button',{name:'Open phone'}).click();assert(await page.getByText('No numbers yet.',{exact:false}).count());await page.getByRole('button',{name:'Close drawer'}).click();
  await page.getByRole('button',{name:'Open newspaper'}).click();assert(!/Wong|Sonya/.test(await page.getByRole('region',{name:'Newspaper',exact:true}).innerText()));await page.getByRole('button',{name:'Close drawer'}).click();
  await look(page,'the older man carrying plants');await act(page,'Hello. Can we keep in touch?');
  const forbidden=/cliff|one.?wheel|race|what is up|up the path/i;
  assert(!forbidden.test(await page.locator('.conversation').innerText()));
  assert.equal(await page.getByRole('button',{name:'Wheel parts',exact:true}).count(),0);
  assert.equal(await page.getByRole('button',{name:'Path',exact:true}).count(),0);
  await act(page,'Stay a moment.');
  assert(!forbidden.test(await page.locator('body').innerText()));
  const close=page.getByRole('button',{name:'Close conversation',exact:true});if(await close.count())await close.click();
  for(const drawer of ['Open money and notes','Open phone','Open newspaper']){
   await page.getByRole('button',{name:drawer,exact:true}).click();
   if(drawer==='Open phone'){
    await page.locator('.contact-line').filter({hasText:'Juan'}).click();
    await act(page,'Can we talk when you are free?');
   }
   assert(!forbidden.test(await page.locator('.pocket-drawer').innerText()));
   await page.getByRole('button',{name:'Close drawer',exact:true}).click();
  }
  await through(page,2);await look(page,'Juan');
  assert(!forbidden.test(await page.locator('.conversation').innerText()));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(captures,`${name}-early-juan.png`)});
  await through(page,9);assert(!forbidden.test(await page.locator('body').innerText()));
  results.push({name,viewport:{width,height},routes:['early acquaintance','repeat encounter','phone and paper','negative route knowledge','hidden premature props'],pageErrors:errors});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(url);
 await look(page,'Posted offers');await act(page,'I’ll pay 6 for one.');
 assert(await page.getByText(/Bought 1 Fresh Mackerel for 6 tins/).count());
 await page.getByRole('button',{name:'Close drawer'}).click();await through(page,3);
 await look(page,'Bowl');await act(page,'May I look?');
 await look(page,'Yasmin');
 await act(page,'Could you advance eight?');await act(page,'Yes, on those terms.');
 await page.getByRole('button',{name:'Close conversation'}).click();
 await page.getByRole('button',{name:'Open money and notes'}).click();assert(await page.getByText(/You owe 9 tins/).count());
 await page.getByRole('button',{name:'Close drawer'}).click();await look(page,'Yasmin');
 await act(page,'Here is what I owe.');
 const close=page.getByRole('button',{name:'Close conversation'});if(await close.count())await close.click();
 await page.getByRole('button',{name:'Open money and notes'}).click();assert(await page.getByText(/paid/).count());
 await page.screenshot({path:path.join(captures,'mobile-repayment.png')});await page.close();
 results.push({name:'mobile money',routes:['public purchase','secured advance','manual repayment']});
 const tired=await browser.newPage({viewport:{width:390,height:844}});await tired.goto(url);await look(tired,'Posted offers');
 await tired.getByLabel('Tins for one').fill('1');
 for(let n=0;n<5&&await tired.getByRole('button',{name:'I’ll pay 1 for one.',exact:true}).count();n++)await act(tired,'I’ll pay 1 for one.');
 assert(await tired.getByText('There is not enough time left for that today.',{exact:true}).count());
 await act(tired,'Keep looking around.');assert.equal(await tired.locator('.pocket-top>span').innerText(),'Day 1');
 await look(tired,'Posted offers');await act(tired,'I’ll pay 1 for one.');await act(tired,'Start tomorrow.');
 assert.equal(await tired.locator('.pocket-top>span').innerText(),'Day 2');await tired.close();
 results.push({name:'mobile time',routes:['repeated commitments','exhaustion prompt','continue looking','choose tomorrow']});
 console.log(JSON.stringify({results,captures},null,2));
}catch(e){for(const page of browser.contexts().flatMap(c=>c.pages())){console.error((await page.locator('body').innerText()).slice(-6500));await page.screenshot({path:path.join(captures,'failure.png')});}console.error('Captures:',captures);throw e;}finally{await browser.close();}
