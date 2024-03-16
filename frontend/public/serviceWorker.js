oninstall = async (e) => {
  console.log('[Service Worker] Installed...');
  e.waitUntil(
    (async () => {
      //   await cacheOnRegister(staticV, dynamicV);
    })()
  );
};

// activate:
onactivate = (e) => {
  // console.log(cacheRes, cacheOnRegister, fetchRes, offlineRes, removeOldCache);
  console.log('[Service Worker] Activated....');
  e.waitUntil(
    (async () => {
      // await removeOldCache(staticV, dynamicV);
    })()
  );
  return self.clients.claim();
};
