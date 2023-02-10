function switchToPage(newPage){
	model.app.currentPage = newPage;
	console.log('switcher side...');
	updateView();
}

function numberToMoney(number_){
	return number_.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

}