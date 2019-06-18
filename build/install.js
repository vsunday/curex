let deferredPrompt;
const installbtn = document.getElementById('install-btn');
installbtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', e=>{
  e.preventDefault();
  deferredPrompt = e;
  installbtn.style.display = 'block';
  
  installbtn.addEventListener('click', e => {
    installbtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('accepted');
      } else {
        console.log('dismissed');
      }
      // installbtn.style.display = 'block';
      deferredPrompt = null;
    });
  });
})