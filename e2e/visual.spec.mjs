import { test, expect } from "@playwright/test";

test.describe("@visual approved surface snapshots",()=>{
  for(const entry of[
    {name:"home",path:"/",width:1440,height:1000},
    {name:"services",path:"/research-services",width:1440,height:1000},
    {name:"request-mobile",path:"/request-research",width:390,height:844},
    {name:"market-data",path:"/market-explorer",width:1440,height:1000},
  ]){
    test(`${entry.name} @visual`,async({page})=>{
      await page.setViewportSize({width:entry.width,height:entry.height});
      await page.goto(entry.path);
      await expect(page).toHaveScreenshot(`${entry.name}.png`,{fullPage:true,animations:"disabled"});
    });
  }
});
