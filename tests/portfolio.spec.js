import {test,expect} from '@playwright/test';
import {projects} from '../data.js';

test('English landing page, real assets, three languages and persistence',async({page,request})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toContainText('Tenghui');
  await expect(page.locator('#selected-work .project-card')).toHaveCount(3);
  await expect(page.locator('header button')).toHaveCount(1);
  await page.locator('#language-toggle').click();
  await page.locator('[data-language="zh-Hans"]').click();
  await expect(page.locator('h1')).toContainText('涂腾辉');
  await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','zh-Hans');
  await page.goto('/');await expect(page.locator('html')).toHaveAttribute('lang','zh-Hans');
  await page.goto('/#/en');await expect(page.locator('html')).toHaveAttribute('lang','en');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('.hero-links a[download]').click();
  expect((await downloadPromise).suggestedFilename()).toBe('resume-en.pdf');
  for(const lang of ['en','zh-Hans','zh-Hant']){
    const response=await request.get(`/assets/resumes/resume-${lang}.pdf`);
    expect(response.ok()).toBeTruthy();expect(response.headers()['content-type']).toBe('application/pdf');
  }
  for(const font of ['cormorant.ttf','cormorant-italic.ttf','noto-sc.woff2','noto-tc.woff2'])expect((await request.get(`/assets/fonts/${font}`)).ok()).toBeTruthy();
  expect(errors).toEqual([]);
});

test('All project details in all languages, valid assets and deep-link refresh',async({page,request})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['en','zh-Hans','zh-Hant']){
    for(const project of projects){
      await page.goto(`/#/${lang}/projects/${project.id}`);
      await expect(page.locator('h1')).toHaveText(project.title[lang]);
      await expect(page.locator('#contribution li').first()).toBeVisible();
      const local=await page.locator('img,video source').evaluateAll(els=>els.map(el=>el.getAttribute('src')));
      for(const url of local)expect((await request.head(url)).ok(),url).toBeTruthy();
    }
  }
  await page.goto('/#/en/projects/bed-cleaning-robot');
  await expect(page.locator('#implementation')).toContainText('ADRC');
  await page.locator('#language-toggle').click();await page.locator('[data-language="zh-Hant"]').click();
  await expect(page).toHaveURL(/zh-Hant\/projects\/bed-cleaning-robot/);
  await page.reload();await expect(page.locator('h1')).toHaveText('掃床機器人');
  await page.goto('/#/en/projects/tabletop-device');
  await expect(page.locator('a[href*="BOARD-MIND"]')).toHaveCount(0);
  await page.goto('/#/en/projects');await expect(page.locator('.archive-grid .project-card')).toHaveCount(9);
  expect(errors).toEqual([]);
});

test('Desktop/mobile layout, keyboard selector and video playback',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.goto('/#/en');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
  await page.locator('#language-toggle').focus();await page.keyboard.press('ArrowDown');
  await expect(page.locator('#language-options')).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.locator('#language-toggle')).toBeFocused();
  await page.locator('#experience').scrollIntoViewIfNeeded();
  const before=await page.locator('#experience').evaluate(el=>el.getBoundingClientRect().top);
  await page.locator('#language-toggle').click();await page.locator('[data-language="zh-Hans"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-Hans');
  await expect.poll(async()=>Math.abs((await page.locator('#experience').evaluate(el=>el.getBoundingClientRect().top))-before)).toBeLessThan(8);
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const path of ['en','zh-Hans','zh-Hant/projects','en/projects/line-following-robot']){
      await page.goto('/#/'+path);await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${path}`).toBeTruthy();
    }
  }
  await page.setViewportSize({width:375,height:812});await page.goto('/#/zh-Hans');await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
  await page.goto('/#/en/projects/emotion-screen');
  const video=page.locator('video');await video.scrollIntoViewIfNeeded();
  await video.evaluate(async el=>{el.muted=true;await el.play();});
  await expect.poll(()=>video.evaluate(el=>el.currentTime)).toBeGreaterThan(0);
  await page.goto('/#/en/does-not-exist');await expect(page.locator('h1')).toContainText('This page has moved');
});

test('Production output works under a repository subpath',async({page,request})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/dist/#/en/projects/emotion-screen');
  await expect(page.locator('h1')).toHaveText('Interactive electronic badge');
  await expect.poll(()=>page.locator('.detail-hero img').evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);
  await page.reload();await expect(page.locator('h1')).toHaveText('Interactive electronic badge');
  const sources=await page.locator('img,video source').evaluateAll(els=>els.map(el=>el.src));
  for(const url of sources){expect(new URL(url).pathname).toContain('/dist/assets/');expect((await request.head(url)).ok()).toBeTruthy();}
  await page.goto('/dist/#/en');await page.evaluate(()=>document.fonts.ready);
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'test-results/preview-desktop.png'});
  await page.setViewportSize({width:390,height:844});await page.goto('/dist/#/en');
  await page.screenshot({path:'test-results/preview-mobile.png'});
  expect(errors).toEqual([]);
});
