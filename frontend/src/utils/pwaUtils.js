const registerSW = async (navigator) => {
  if (navigator.serviceWorker) {
    let registeredWorker = await navigator.serviceWorker.getRegistrations();

    if (registeredWorker.length > 0) {
      for (let i = 0; i < registeredWorker.length; i++) {
        let unregisteredWorker = await registeredWorker[i].unregister();
        // let staticV = `static`;
        // let dynamicV = `dynamic`;
        // await caches.delete(staticV);
        // await caches.delete(dynamicV);
        console.log('Cleared old cache');
        if (unregisteredWorker) {
          console.log('removed older service worker.');
          const swReg = await navigator.serviceWorker.register(
            '/serviceWorker.js',
            {
              scope: '/',
            }
          );

          if (swReg.active) {
            console.log('registered service worker');
          }
        } else {
          console.log('could not remove older service worker.');
          break;
        }
      }
      return;
    } else {
      console.log('no service worker found');

      const swReg = await navigator.serviceWorker.register(
        '/serviceWorker.js',
        {
          scope: '/',
        }
      );

      if (swReg.active) {
        console.log('registered service worker');
      }
      return;
    }
  }
};

export { registerSW };
