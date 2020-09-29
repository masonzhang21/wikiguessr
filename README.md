<p align="center"><img src="./assets/wikiguessr-logo.jpg" width=700px/></p>

<h1 align="center">Time Warden</h1>

<p align="center">
  <a href="#technologies">Technologies</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#project-design-and-organization">Project Design</a> •
  <a href="#building-the-project">Building the project</a> •
  <a href="#pending-features">Pending Features</a>
</p>

<p align="center">A Chrome extension designed to limit screen time on distracting sites by slowly fading them away as you spend time on them. It's highly customizable and also keeps track of your screen time.</p>

<p align="center"><img src="./assets/fadingsite.jpg"  width=1000px/></p>
<p align="center"> Get the extension <a href="https://chrome.google.com/webstore/detail/time-warden/hgfgbklancihgfpjaagdmhplaoklgeol?hl=en">here</a> on the Chrome Web Store! </p>

## Technologies
- React
- Javascript

## Key Features
- Group sites into buckets and customize how long it takes for sites in a bucket to fade away/regenerate
- Sites in the same bucket fade away together and come back together
- 'Watched' sites will gradually fade to black while they remain the active tab
- 'Watched' sites will slowly regenerate when closed
- Screen time tracker that graphs time spent on watched sites
- A couple more buttons and switches that do cool things!

### Buckets

<img src="./assets/buckets.png" width=220px/>

Buckets are containers for sites. You can place any
          number of sites in the same bucket, and they'll share time. All sites
          in the same bucket are synced - spending time on one will cause all to
          fade away. Use them to customize how long you're allowed to spend on
          different sites.
          
Each bucket has a decay rate and regeneration rate. The decay rate
          determines how fast time runs out, while the regeneration rate
          determines how fast you get time back. A decay rate of 10 means that
          you can spend 10 minutes on the sites in the bucket before they fully fade away. A
          regen rate of 10 means that you need to wait 10 minutes for a fully faded site
          to completely unfade.
          
Note that sites only decay when they're the active tab, and sites only
          regen while when every tab in the bucket is closed. If a site in a
          bucket is open but not the active tab, it's in limbo. Note that a site can only be in a single bucket.

### Spontaneous Combustion

If turned on, watched sites (sites in a bucket) will randomly close (with a greater and greater chance the more the site fades away).

### Operation: Total Blackout

If no watched sites are open in any Chrome tab, the extension badge will change green and the <i> Operation: Total Blackout </i> button will be shown on the Home page. Pressing this fully fades away all sites in all buckets. But have no fear, for they'll naturally regenerate back at the set regeneration rate for the bucket they're in. 

### Operation: Destroy Evil

If a watched site is open in any Chrome tab, the extension badge will change red and the <i> Operation: Destroy Evil </i> button will be shown on the Home page. Pressing this closes all watched sites. 

### Screen time

Time Warden keeps track of the time spent on watched sites and plots weekly screen times on a stacked bar chart. Time is accumulated when a watched site is focused (i.e. when ```document.visibilityState === "visible"```). It also calculates the average time spent per week and the total time spent today. The daily tracker resets at midnight local time, whereas the weekly tracker resets on Sunday at midnight.


## Project Design and Organization

### Backend
The primary aim of Time Warden was to fade-to-black user designated sites over a configurable period of time. To accomplish this, we use a background script that listens to web navigation events. If the user navigates to a page with the same domain name as a watched site, a content script is injected into the newly loaded site. 
```
chrome.webNavigation.onCompleted.addListener(async function (details) {
  const isMainTab = details.frameId === 0 && details.parentFrameId === -1;
  const isWatchedSite = await functions.isWatchedSite(details.url);
  if (isMainTab && isWatchedSite) {
    chrome.tabs.executeScript(details.tabId, {
      file: "content-script.js",
    });
  }
});
```
The content script initializes the state of the page (including the initial percentFaded value) from storage. It listens to when `document.visibilityState` changes and adds a timer that ticks once per second when the page is active. Every second, the timer increases the opacity of a 100vw/100vh overlay attached to the DOM. The content script also handles the storing the state of the page when the window is unloaded.  

Functions involving reading/writing to/from `chrome.storage.sync` are located in `storage.js`. Most program logic can be found in functions in `functions.js`. 

### Frontend
The extension UI is built with React. 

### Assets
Assets used in the Chrome Extension Store listing are located in the `assets` folder. Logos used in the extension itself are located in `public`.

### Manifest
The `manifest.json` for the extension is located in `public`. The `"https://*/*"` permission is needed. Time Warden assumes that all watched sites have the `https` protocol. 

## Building the Project
This project was bootstrapped with the following [live reloading for React Chrome Extensions kit](https://github.com/hk-skit/chrome-extension-starter-kit), which, as the name suggests, provides live reloading while developing Chrome Extensions. To start, run `npm run build` and load the `build` folder as the unpacked extension. Then run `npm run watch`. Any changes made will now instantly take into effect!

The extension is the zipped `build` folder. 

## Pending Features
- Configurable 'cooldown' period during which the closed watched site doesn't start regenerating
- Different images/colors to fade to
- Let friends keep tabs on each other. Get a notification when a friend is on a watched site, and have the ability to send a 'shame' notification that flashes on their screen. 




# wikiguessr
Play at www.wikiguessr.com!

A Wikipedia-based trivia game: try to guess words based on their Wikipedia article. Makes use of the MediaWiki API with a Node.js backend for retrieving random articles.

# How To Play
Choose one of the ten preset categories to get appropriately themed words, or pick random to learn about some super obscure people you've never heard of and never will!

Each round, you start with the first paragraph of the intro section. You get three additional hints—each hint unlocks an additional section or subsection of the article. Just click on the one you want in the table of contents.

Type your guess in the top bar. All non-alphabetical characters are given to you, and the guess checker isn't case sensitive. Whether your answer is right or wrong, the full Wikipedia article will load, in case you want to read more about whatever intriguing subject you were on. 

Bewarned: the preset categories are mostly safe, but if you're playing on random, certain articles may be too much for Wikiguessr. If an article is loading for more than 10s, give the page a quick refresh. 

# The Guts

This whole thing runs on boatloads of Javascript. The front-end sends a fetch request to a server somewhere in Iowa for an article blueprint. That server pulls data from a MongoDB database (if you're playing a category) or the MediaWiki API (if you're on random), formats it nicely in an article blueprint—a formulaic layout/map of the chosen Wikipedia article—and hands it over to the front-end. Then, we replace the words in the article title with blanks and initialize the page with words and buttons. When an enter is detected, the input in the top bar is submitted and checked. The correct answer is displayed if wrong and the full article is loaded using lots of Javascript and JQuery. If another enter is detected, the game resets and the next word is chosen.

The static website is hosted with Google Cloud Bucket, the backend server with Google App Engine, and the database with MongoDB Atlas.

# Bugs

Sadly there might be a couple of these. If you find one, let me know at mason_zhang@brown.edu!
