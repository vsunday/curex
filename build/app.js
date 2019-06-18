const dbName = 'curex';
const dbVersion = '1';
const storeName = 'rate';
let db;

const request = indexedDB.open(dbName, dbVersion);
request.onerror = (event) => {console.log('error')};
request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore(storeName, {keyPath: ['from','to']});
  console.log('updated');
};

request.onsuccess = event => {
  db = event.target.result;
  console.log('success');
  
  getAllRateInCache().then(datas => {
    for (let i=datas.length-1; i>=0; i--) {
      let {from, to, ..._} =datas[i];
      showCard(datas[i]);
      getRate(from, to).then(rate => showCard(rate));
    }
  });
};

function openDialog() {
  document.getElementById('addDialogContainer').classList.toggle('visible');
}


function putRateToCache(data) {
  return db.transaction(storeName,'readwrite')
    .objectStore(storeName)
    .put(data);
}

async function getRateFromNetwork(from, to) {
  return await fetch(`/rate?from=${from}&to=${to}`)
    .then(resp => resp.json())
    .then(data => {
      putRateToCache(data);
      // return data;
      setTimeout(()=>{data}, 1000);
    })
    .catch(err => console.error(err));
}

function getRateFromCache(from, to) {
  return new Promise((resolve, reject) => {
    db.transaction(storeName,'readonly')
      .objectStore(storeName)
      .get([from,to]).onsuccess = event => {
        resolve(event.target.result);
      };
  });
}

async function getRate(from, to) {
  const rate = await getRateFromNetwork(from, to);
  if (rate) {
    return rate;
  } else {
    return await getRateFromCache(from, to);
  }
}

function getAllRateInCache() {
  return new Promise((resolve, reject) => {
    db.transaction(storeName, 'readonly')
      .objectStore(storeName)
      .getAll().onsuccess = event => {
        resolve(event.target.result);
      };
   });
}

async function addCard() {
  const fromList = document.getElementById('fromList');
  const from = fromList.options[fromList.selectedIndex].value;
  
  const toList = document.getElementById('toList');
  const to = toList.options[toList.selectedIndex].value;
   
  // const newCard = getCard(data['from'], data['to'], data['rate'], data['time'], data['timezone']);
  // const newCard = getCard(data);
  // newCard.querySelector("div[id='toValue']").value = data['rate'];
  // newCard.removeAttribute('hidden');
  // document.getElementById('container').appendChild(newCard);
  
  document.getElementById('addDialogContainer').classList.toggle('visible');
  showCard(await getRate(from, to));
}

function showCard(data) {
  const newCard = getCard(data);
  newCard.querySelector("div[id='toValue']").value = data['rate'];
  newCard.removeAttribute('hidden');
  document.getElementById('container').appendChild(newCard);
}

function cancelAddCard() {
  document.getElementById('addDialogContainer').classList.toggle('visible');
}

function removeCard(evt) {
  const parent = evt.srcElement.parentElement.parentElement.parentElement;
  parent.setAttribute('hidden', true);
}

// function getCard(from, to, rate, time, timezone) {
function getCard(data) {
  const {from, to, rate, time, timezone} = data;
  const id = `${from}-${to}`;
  const card = document.getElementById(id);
  let newCard;
  
  if (card) {
    newCard = card;
  } else {
    newCard = document.getElementById('template').cloneNode(true);
  }
  
  newCard.querySelector("div[id='fromValue']").textContent = `1 ${from}`;
  newCard.querySelector("div[id='toValue']").textContent = `${rate} ${to}`;
  newCard.querySelector("small[id='reftime']").textContent = time;
  newCard.setAttribute('id', id);
  newCard.removeAttribute('hidden');
  newCard.querySelector('.btn').addEventListener('click',removeCard);
  return newCard;
}


(() => {
  document.getElementById('open').addEventListener('click', openDialog);
  document.getElementById('add').addEventListener('click', addCard);
  document.getElementById('cancel').addEventListener('click', cancelAddCard);
  
  
})();