importScripts('swUtil.js', 'idb.js');
oninstall = async (e) => {
  console.log('[Service Worker] Installed...');
  e.waitUntil(
    (async () => {
      return;
    })()
  );
};

// activate:
onactivate = (e) => {
  console.log('[Service Worker] Activated....');
  e.waitUntil(
    (async () => {
      return;
    })()
  );
  return self.clients.claim();
};

//////////////////////////////////////////////////////////////////////////////
// Background sync.

onsync = (e) => {
  console.log('[Service Worker] BG-Task Running....');
  e.waitUntil(
    (async () => {
      await bgSynReq(e, idb);
    })()
  );
};
