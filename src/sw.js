importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log('workbox');
  workbox.precaching.precacheAndRoute([]);
  
  // cache first files
  workbox.routing.registerRoute(
    /images(.*)\.(?:png|gif|jpg|svg)/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24* 60 * 60,
        })]
    }));
  // staleWhileRevalidate files
  // workbox.routing.registerRoute(
  //   /images\/icon\/(.*)/,
  //   workbox.strategies.staleWhileRevalidate({
  //     cacheName: 'icon-cache',
  //     plugins: [
  //       new workbox.expiration.Plugin({
  //         maxEntries: 5
  //       })]
  //   }));
    
    //network first files
  // const articleHandler = workbox.strategies.networkFirst({
  //   cacheName: 'articles-cache',
  //   plugins: [
  //     new workbox.expiration.Plugin({
  //       maxEntries: 50,
  //   })]
  // });
  
  // workbox.routing.registerRoute(/(.*)article(.*)\.html/, args => {
  //   return articleHandler.handle(args)
  //     .then(response => {
  //       if (!response) {
  //         return caches.match('pages/offline.html');
  //       } else if (response.status === 404) {
  //         return caches.match('pages/404.html');
  //       } 
  //       return response;
  //     });
  // });
  workbox.routing.registerRoute(/(.*)\.js$/, 
    workbox.strategies.networkFirst({
      cacheName: 'js-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 2 * 24 * 60 * 60
        })]
  }));
  
  // workbox.routing.registerRoute(/(.*)pages\/(.*)\.html/,args => {
  //   workbox.strategies.cacheFirst({
  //     cacheName: 'posts-cache',
  //     plugins: [
  //       new workbox.expiration.Plugin({
  //         maxEntries: 50
  //       })]
  //   }).then(response => {
  //       if (response.status === 404) {
  //         return caches.match('pages/404.html');
  //       } 
  //       return response;
  //   }).catch(() => {
  //     return caches.match('pages/offline.html');
  //   });
  // });
}  else {
  console.log('no workbox');
}