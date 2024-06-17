let serverUrl = 'https://pwd-psymax-code-production.up.railway.app/api';

let addToIdb = async (storeName, key, data, type, idb) => {
  if (idb) {
    // clear db of old state.
    const db = await idb;
    const txDelete = db.transaction(storeName, 'readwrite');
    const storeToClear = txDelete.objectStore(storeName);
    await storeToClear.clear();
    txDelete.complete;

    // add new state.
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(data, key);
    await tx.complete;
  }

  return;
};

//
let getFromIdb = async (idb, storName) => {
  try {
    const db = await idb;
    const tx = db.transaction(storName, 'readonly');

    const store = tx.objectStore(storName);

    const data = await store.getAll();

    return data;
  } catch (error) {
    console.log(error.message, ': get idb data failed');
    return;
  }
};

//
const createStore = (idbObj, storeName, dbName) => {
  if (idbObj) {
    return idbObj.open(dbName, 1, (db) => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { KeyPath: 'id' });
      }
    });
  }
};

const fetchWrap = async (url, method, payload) => {
  try {
    let headers = {
      'Content-Type': 'application/json',
      reqType: 'vaultUpdate',
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
      let data = await fetch(url, {
        method: method,
        body: JSON.stringify(payload),
        headers,
      });
      data = await data.json();
      console.log(data);
      return data;
    }
    return;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const bgSynReq = async (e, idb) => {
  console.log('backOnline');
  console.log(e.tag, idb);
  if (e.tag === 'updateVaultRequest') {
    let storeName = 'updateVault';
    let db = createStore(idb, storeName, 'bgSync-store');
    let updateVaultData = await getFromIdb(db, storeName);
    console.log(updateVaultData);
    if (updateVaultData) {
      await fetchWrap(`${serverUrl}/api/vault/user/update/main`, 'POST', {
        userId: updateVaultData[0].userId,
        type: 'update',
        passwords: updateVaultData[0].files,
        vault: 'file',
        reqType: 'vaultUpdate',
      });
      await fetchWrap(`${serverUrl}/api/vault/user/update/main`, 'POST', {
        userId: updateVaultData[0].userId,
        type: 'update',
        clients: updateVaultData[0].clients,
        vault: 'client',
        reqType: 'vaultUpdate',
      });
    }
  } else {
    return;
  }
};
