$(document).ready(function (){
	fetchCurrencies();
});


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

    //Make sure user is not converting the same currency
    if(from == to)
    {
      $(".alert").html(`
  			<div class="card-feel">
  				<span class="text-danger">
  					Ops!, you can't convert the same currency
  				</span>
  			</div>
  		`);
    }

    //Concatenate currencies to compare with API value
    let request  =   `${from}_${to}`;
    let api_request = {
      q: request
    };

    //Fetch conversion from api
    fetch('https://free.currencyconverterapi.com/api/v5/convert', api_request)
    .then(response => response.json())
    .then(data => {
      console.log(api_request);
      console.log(data);
      //Convert the Objects into arrays
      const currencies_list = Object.keys(data.results).map(i => data.results[i]);

      //loop through each of the currency arrays/objects then add the to drop down options
      $.each(currencies_list, function(index, val) {
        $(".result").append (`
          <div class="card-feel">
                                <hr />
             <b>${amount}</b> <b>${val.fr}</b> to <b>${val.to}</b> is:
            <b>${numeral(amount * val.val).format('0.000')}</b>
          </div>
        `);

        //Create data Object that will be used later
        let object = {
  				symbol: body,
  				value: val.val
  			};

        //Store the object to the openDatabase

    })
    .catch(function(err) {
      console.log("status: ", err.status);
      // fecth currency from indexDB
      //fetchFromDatabase(body, amount);
    });
  });
}

// refresh page
function refreshPage() {
	window.location.reload();
}
