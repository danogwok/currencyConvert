$(document).ready(function (){
	fetchCurrencies();
});

//Warnings and Errors
if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB");
}

//fetch fetch Currencies
function fetchCurrencies()
{
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then(response => response.json())
    .then(data => {
      //console.log(data);
      //Convert the Objects into arrays
      const currencies_list = Object.keys(data.results).map(i => data.results[i]);
      //console.log(currencies_list);
      //loop through each of the currency arrays/objects then add the to drop down options
      for(let currency of currencies_list)
      {
        $("#from").append(`<option value="${currency.id}">${currency.id} (${currency.currencyName})</option>`);
        $("#to").append(`<option value="${currency.id}">${currency.id} (${currency.currencyName})</option>`);
      }
    })
    .catch(function(err) {
    	console.log("status: ", err.status);
    });
}

//Convert Currencies
function convertCurrencies()
{
    //initial variables
    let amount	= $("#currency").val();
    let from 	= $("#from").val();
    let to 		= $("#to").val();

    //Clear the alert incase still existant
    $(".alert").html("");
    //Make sure user is not converting the same currency
    if(from == to)
    {
      $(".alert").html(`
  				<span class="text-danger">
  					Can't convert same currency
  				</span>
  		`);
    }

    //Concatenate currencies to compare with API value
    let request  =   `${from}_${to}`;
    let url = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + request;
    //console.log(url);

    //Fetch conversion from api
    fetch(url)
    .then(response => response.json())
    .then(data => {
      //console.log(data.results);
      //Convert the Objects into arrays
      const currencies_list = Object.keys(data.results).map(i => data.results[i]);
      //console.log(currencies_list);
      //loop through each of the currency arrays/objects then add the to drop down options
      $.each(currencies_list, function(index, val) {
        console.log(val.val * amount);
        let total_amount = val.to + " " + (val.val * amount).toFixed(2);
      //  $(".result").append("Hi");
        //Clear div from DOM
        $(".result").html("");
        //Append to Div
        $(".result").append (`
          <div class="card-feel">
            <b>${total_amount}</b>
          </div>
        `);

        //Create data Object that will be used later
        let   currency = {
  				symbol: body,
  				value: val.val
  			};

        //Store the object to the openDatabase
        saveDB(currency);

    })
    .catch(function(err) {
      console.log("status: ", err.status);
        // fecth currency from indexDB
        getFromDB(body, amount);
    });
  });

  return false;
}

/**
* First create a database and then open it
*/
//Save to //
function saveDB(value)
{
    //instance variables
    const DATA_BASE = "myDB";
    const db_access = IndexedDB.open(DATA_BASE, 1);

    //Catch any errors that might occur
    db_access.onerror = (event) => {console.log("database has an error"); return false; };

    //Monitor changes and the versions
    db_access.onupgradeneeded = function(event) {
        // listen for the event response
        var upgradeDB = event.target.result;
        // create an objectStore for this database
        var objectStore = upgradeDB.createObjectStore("currencies");
    };

    // on success add user
  	db_access.onsuccess = (event) => {

  		// console.log('database has been openned !');
  		const query = event.target.result;

  	  	// check if already exist symbol
  		const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);

  		// wait for users to arrive
  	  	currency.onsuccess = (event) => {
  	  		const dbData = event.target.result;
  	  		const store  = query.transaction("currencies", "readwrite").objectStore("currencies");

  	  		if(!dbData){
  	  			// save data into currency object
  				store.add(data, data.symbol);
  	  		}else{
  	  			// update data existing currency object
  				store.put(data, data.symbol);
  	  		};
  	  	}
  	}
}

//get from the DATA_BASE
function getFromDB(symbol, amount)
{
    // init database
    const db = openDatabase();

    // on success add user
    db.onsuccess = (event) => {

      // console.log('database has been openned !');
      const query = event.target.result;

      // check if already exist symbol
      const currency = query.transaction("currencies").objectStore("currencies").get(symbol);

      // wait for users to arrive
        currency.onsuccess = (event) => {
          const data = event.target.result;
          // console.log(data);
          if(data == null){
            $(".error_msg").append(`
            <div class="card-feel">
                      <span class="text-danger">
                        You are currently offline... check internet connectivity and try again.
                      </span>
            </div>
          `);

          // hide error message
          setTimeout((e) => {
            $(".error_msg").html("");
          }, 1000 * 3);

          // void
          return;
          }

        // console.log(data);
        // console.log(data);
        let pairs = symbol.split('_');
        let fr = pairs[0];
        let to = pairs[1];

        $(".results").append(`
          <div class="card-feel">

            <hr />
          <b>${amount}</b> <b>${fr}</b> to <b>${to}</b> is:
            <b>${numeral(amount * data.value).format('0.000')}</b>
          </div>
        `);
        }
    }
}

//Service Workers

// Register Service Worker
if(navigator.serviceWorker){
	// register the services worker
	registerServiceWorker();

	// listen for controller change
	navigator.serviceWorker.addEventListener('controllerchange', function (){
		window.location.reload();
	});

}else{
	console.log('browser does not support Services Worker !');
}

// register sw
function registerServiceWorker() {
	// register the service worker
	navigator.serviceWorker.register('js/sw/index.js'/*, {scope: './public/'}*/).then(function(sw) {
		// check service worker controller
		if(!navigator.serviceWorker.controller) return;

		// on waiting state
		if(sw.waiting){
			// updateIsReady(sw.waiting);
			sw.postMessage('message', {action: 'skipWaiting'});
			return;
		}

		// on installing state
		if(sw.installing){
			trackInstalling(sw.installing);
		}

		// on updated found
		sw.addEventListener('updatefound', function (){
			trackInstalling(sw.installing);
		});
	});
}

// track sw state
function trackInstalling(worker) {
	worker.addEventListener('statechange', function(){
		if(worker.state == 'installed'){
			updateIsReady(worker);
		}
	});
}

// update app
function updateIsReady(sw){
	// console.log('a new SW is ready to take over !');
	// sw.postMessage('message', {action: 'skipWaiting'});
	pushUpdateFound();
}


// refresh page
function refreshPage() {
	window.location.reload();
}
