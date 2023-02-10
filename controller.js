

//fetchDataAsync('https://eodhistoricaldata.com/api/real-time/AAPL.US?fmt=json&api_token=demo');
//https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=demo





function getStocks() {
	console.log('getting stocks...');
	let obj = null;

	model.inputs.stocks = [];
	for (ticker of model.data.tickers) {
		let url = 'https://eodhistoricaldata.com/api/real-time/' + ticker + '.US?fmt=json&api_token=demo';
		fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				console.log(data);
				console.log(data.close);
				obj = JSON.parse(JSON.stringify(data));//objekt kopireres. er det nødvending??
				model.inputs.stocks.push(obj);


			})
			.then(sortInputAfterCode)
			.then(updateView)
			.catch(error => console.error(error));

	}
	getFundamentals();


}

function sortInputAfterCode(){
	console.log('sorterer...');
	model.inputs.stocks.sort(((a, b) => a.code.localeCompare(b.code, 'en')));
}

function sortInputList(attribute) {
	console.log('sorterer...');
	if (attribute == 'code') {
		model.inputs.stocks.sort(((a, b) => a.code.localeCompare(b.code, 'en')));
	}
	else if (attribute == 'change_p') {
		model.inputs.stocks.sort((a, b) => b.change_p - a.change_p);
	}
	else if(attribute == 'close'){
		model.inputs.stocks.sort((a, b) => b.close - a.close);

	}
	else if(attribute == 'change'){
		model.inputs.stocks.sort((a, b) => b.change - a.change);
	}
	updateView();
}


function getFundamentals(){
	
	let obj = null;

	model.inputs.fundamentals = [];
	for (ticker of model.data.tickers) {
		let url = 'https://eodhistoricaldata.com/api/fundamentals/'+ ticker +'.US?api_token=demo';
		fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				console.log(data);
				obj = JSON.parse(JSON.stringify(data));//objekt kopireres. er det nødvending??
				model.inputs.fundamentals.push(obj);


			})
			.then(sortFundamentalAfterCode)
			.then(updateView)
			.catch(error => console.error(error));
	}


}

function sortFundamentalAfterCode() {
	console.log('sorterer...');
	if(model.inputs.fundamentals.length > 1){
		model.inputs.fundamentals.sort(((a, b) => a.General.Code.localeCompare(b.General.Code, 'en')));
	}
	else console.log('ikke mange nok til å sortere..');	

}

function sortFundamentals(attribute) {
	console.log('sorterer...');
	if (attribute == 'code') {
		model.inputs.fundamentals.sort(((a, b) => a.General.Code.localeCompare(b.General.Code, 'en')));
	}
	else if (attribute == 'name') {
		model.inputs.fundamentals.sort(((a, b) => a.General.Name.localeCompare(b.General.Name, 'en')));
	}
	else if (attribute == 'ForwardPE') {
		model.inputs.fundamentals.sort((a, b) => b.Valuation.ForwardPE - a.Valuation.ForwardPE);
	}
	else if (attribute == 'TrailingPE') {
		model.inputs.fundamentals.sort((a, b) => b.Valuation.TrailingPE - a.Valuation.TrailingPE);
	}
	else if (attribute == 'Beta') {
		model.inputs.fundamentals.sort((a, b) => b.Technicals.Beta - a.Technicals.Beta);
	}
	else if (attribute == 'WSUpsidePotential') {
		model.inputs.fundamentals.sort((a, b) => parseFloat(getWSUpsidePotential(b.General.Code)) - parseFloat(getWSUpsidePotential(a.General.Code)));
	}
	else if (attribute == 'PEGRatio') {
		model.inputs.fundamentals.sort((a, b) => b.Highlights.PEGRatio - a.Highlights.PEGRatio);
	}


	else console.log('feil parameter i sortFundamentals');
	
	updateView();
}

function getCurrentCloseFromTicker(ticker){
	//console.log('getCurrentCloseFromTicker' + ticker);
	
	for(stock of model.inputs.stocks){
		let code = stock.code;
		let indexOfDot = code.indexOf(".");
		code = code.substring(0, indexOfDot);
		if (code == ticker){
			//console.log(ticker +'Stock.close:' + stock.close);
			return stock.close;
		}
	}
	return null;

}

function getStockByTicker(ticker){
	for(stock of model.inputs.stocks){
		let code = stock.code;
		let indexOfDot = code.indexOf(".");
		code = code.substring(0, indexOfDot);
		if (code == ticker){
			return JSON.parse(JSON.stringify(stock));
		}
	}
	return null;

}

function getStockFromFundamentalsByTicker(ticker){
	//console.log('getStockFromFundamentalsByTicker');
	for(stock of model.inputs.fundamentals){
		if(stock.General.Code == ticker){
			//console.log('returnerer '+ ticker);
			return JSON.parse(JSON.stringify(stock));
		}
	}
}

function getWSUpsidePotential(ticker){
	let stock = getStockFromFundamentalsByTicker(ticker);
	let wallStreetTargetPrice = stock.Highlights.WallStreetTargetPrice;
	//console.log(ticker + 'wstp: '+ wallStreetTargetPrice);
	let close = getCurrentCloseFromTicker(ticker);
	//console.log(ticker + 'close:' + close);
	let upsidePotential = ((wallStreetTargetPrice / close) -1) * 100;
	return upsidePotential.toFixed(2) + ' %';
	//wallStreetTargetPrice / close
	//() minus 1 ganger 100
}

function clickOnCode(ticker){
	
	console.log(ticker);
	model.inputs.selectedStock = getStockFromFundamentalsByTicker(ticker);
	console.log('bytter side til single stock...');
	switchToPage('singleStockPage');
	//updateView();
}

function epsInPercent(eps){
	let stockValue =  getCurrentCloseFromTicker(model.inputs.selectedStock.General.Code);
	return (eps/stockValue * 100).toFixed(2) + ' %';

}






function checkIfArrayContainsGicSector(arrayOfGicSectors, sectorToCompare){
	for(sector of arrayOfGicSectors){
		if(sector ==  sectorToCompare)
		return true;
	}
	return false;

}


//returnerere array med forskjellige sektorer
function getGicSectors(){
	let sectors = [];
	for(company of model.inputs.fundamentals){
		console.log('selskap:'+ company.General.Code + 'sector' + company.General.GicSector);
		if(!checkIfArrayContainsGicSector(sectors, company.General.GicSector)){
			
			sectors.push(company.General.GicSector);
		}
	}
	return sectors;

}