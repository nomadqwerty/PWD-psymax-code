oninstall = async (e) => {
  console.log('[Service Worker] Installed...');
  e.waitUntil(
    (async () => {
      // await cacheOnRegister(staticV, dynamicV);
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

//////////////////////////////////////////////////////////////////////////////
// Background sync.
let serverUrl = 'http://localhost:4000/api';
const fetchWrap = async (url, method, payload) => {
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    if (method == 'GET') {
      let data = await fetch(url, {
        method: method,
        headers,
      });
      data = await data.json();
      return data;
    }
    if (method == 'POST') {
      if (!payload) {
        throw new Error('no payload attached');
      }
      let data = await fetch(url, {
        method: method,
        body: JSON.stringify(payload),
        headers,
      });
      data = await data.json();
      return data;
    }
    return;
  } catch (error) {
    console.log(error.message);
    return;
  }
};
const bgSynReq = async (e) => {
  console.log('backOnline');
  console.log(self);
  console.log(window);
  // if (e.tag === 'updateVaultRequest') {
  //   let encryptedFileUpdateVault = localStorage.getItem(
  //     'encryptedFileUpdateVault'
  //   );
  //   let encryptedClientUpdateVault = localStorage.getItem(
  //     'encryptedClientUpdateVault'
  //   );

  //   if (encryptedFileUpdateVault && encryptedClientUpdateVault) {
  //     encryptedFileUpdateVault = JSON.parse(encryptedFileUpdateVault);
  //     encryptedClientUpdateVault = JSON.parse(encryptedClientUpdateVault);
  //     console.log(encryptedFileUpdateVault);
  //     console.log(encryptedClientUpdateVault);
  //   }
  // } else {
  //   return;
  // }
};
onsync = (e) => {
  e.waitUntil(
    (async () => {
      await bgSynReq(e);
    })()
  );
};
