function frontPageView() {
    let html = '<div>';

    console.log('test1');

    html += /*html*/`<button onclick="getStocks()">Hent kurser</button>`;
    html += /*html*/`<button onclick="switchToPage('fundamentalsPage')">Se fundamentale data</button>`;



    if (model.inputs.stocks.length > 0) {

        html += '<table>';
        html += /*html*/`
            <th><button class="table-button" onclick="sortInputList('code')"><b>Code:</b></button></th>
            <th><button class="table-button" onclick="sortInputList('close')"><b>Close:</b></button></th>
            <th><button class="table-button" onclick="sortInputList('change')"><b>Change:</b></button></th>
            <th><button class="table-button" onclick="sortInputList('change_p')"><b>Change %:</b></button></th>
            <th>High:</th>
            <th>Low:</th>
            <th>Volume:</th></tr>`;
        for (stock of model.inputs.stocks) {
            html += /*html*/`
                <tr><td>${stock.code}</td>
                <td>${stock.close}</td>
                <td>${stock.change}</td>
                <td>${stock.change_p}</td>
                <td>${stock.high}</td>
                <td>${stock.low}</td>
                <td>${stock.volume}</td></tr>`;
        }
        html += '</table>';

    }


    html += '</div>';
    return html;
}

function fundamentalsView() {
    let html = '<div>';
    html += /*html*/`<button onclick="switchToPage('frontPage')">Til forsiden</button>`;
    html += /*html*/`<button onclick="getFundamentals()">Hent fundamentale data</button>`;

    if (model.inputs.fundamentals.length > 0) {

        html += '<table>';
        html += /*html*/`
            <th onclick="sortFundamentals('code')"><b>Code:</b></button></th>
            <th><button class="table-button" onclick="sortFundamentals('name')"><b>Name:</b></button></th>
            <th><button class="table-button" onclick="sortFundamentals('ForwardPE')"><b>Trailing PE:</b></button></th>
            <th><button class="table-button" onclick="sortFundamentals('TrailingPE')"><b>Forward PE:</b></button></th>
            <th><button class="table-button" onclick="sortFundamentals('Beta')"><b>Beta:</b></button></th>
            <th><button class="table-button" onclick="sortFundamentals('PEGRatio')"><b>PEG Ratio</b></button></th>
            <th>Market cap:</th>
            <th><button class="table-button" onclick="sortFundamentals('WSUpsidePotential')"><b>WSUpsidePotential:</b></button></th>
            
            
            </tr>`;
        for (stock of model.inputs.fundamentals) { //clickOnCode(${stock.General.Code}), 
            html += /*html*/`
                <tr><td style="cursor: pointer;" onclick="clickOnCode('${stock.General.Code}')">${stock.General.Code}</td>
                <td>${stock.General.Name}</td>
                <td>${stock.Valuation.ForwardPE}</td>
                <td>${stock.Valuation.TrailingPE}</td>
                <td>${stock.Technicals.Beta}</td>
                <td>${stock.Highlights.PEGRatio}</td>
                <td>${numberToMoney(stock.Highlights.MarketCapitalization)}</td>
                <td>${getWSUpsidePotential(stock.General.Code)}</td>
                
                </tr>`;                                                                                     
        }
        html += '</table>';                     //${stock.Highlights.PEGRatio}

    }

    //insert code for watching different sectors
    html +=/*html*/`<h3>Se mest handlede innenfor sektorer:</h3>`;

    for(sector of getGicSectors()){
        html += /*html*/`<button>${sector}</button>`;
    }
    console.log(getGicSectors());


    html += '</div>';
    return html;
}


//Highlights.WallStreetTargetPrice
//Highlights.PEGRatio

function singleStockView() {
    let stock = model.inputs.selectedStock;
    let html = '<div>';
    html += /*html*/`<button onclick="switchToPage('frontPage')">Til forsiden</button>`;
    html += /*html*/`<button onclick="switchToPage('fundamentalsPage')">Til fundamentale data oversikt</button>`;
    html += /*html*/`<h1>${stock.General.Name} (${stock.General.Code})</h1>`;
    html += /*html*/`${currentTradingData()}`;
    html += /*html*/`${fundamentalData()}`;
    html += /*html*/`${lastInsideTrades()}`;
    html += /*html*/`${eSGView()}`;
    html += /*html*/`${earningsView()}`;


    html += '</div>';
    return html;

}

function currentTradingData() {
    const stockFundamentalsData = model.inputs.selectedStock;
    const stockTradingData = getStockByTicker(model.inputs.selectedStock.General.Code);
    let html = '';
    html += '<table>';
    html += /*html*/`
        <th>Code:</th>
        <th>Close:</th>
        <th>Change:</th>
        <th>Change %:</th>
        <th>High:</th>
        <th>Low:</th>
        <th>Volume:</th></tr>`;
    html += /*html*/`
            <tr><td>${stockTradingData.code}</td>
            <td>${stockTradingData.close}</td>
            <td>${stockTradingData.change}</td>
            <td>${stockTradingData.change_p}</td>
            <td>${stockTradingData.high}</td>
            <td>${stockTradingData.low}</td>
            <td>${stockTradingData.volume}</td></tr>`;

    html += '</table>';
    return html;
}

function lastInsideTrades() {

    const stock = model.inputs.selectedStock;
    const nubmerOfTradesToShow = 10;
    let html = '<div><h3>Siste 10 innsidehandler:</h3>';
    html += '<table class="inside-trades-table">';
    html += /*html*/`
        <th>Dato:</th>
        <th>Eier:</th>
        <th>Antall aksjer:</th>
        <th>Transaksjonskode:</th>
        <th>Pris:</th>
        </tr>`;
    console.log('transaksjoner:' + stock.InsiderTransactions[0].date);
    for (let i = 0; i < nubmerOfTradesToShow; i++) {
        //console.log(transaction.date);
        html += /*html*/`
            <tr><td>${stock.InsiderTransactions[i].date}</td>
            <td>${stock.InsiderTransactions[i].ownerName}</td>
            <td>${stock.InsiderTransactions[i].transactionAmount}</td>
            <td>${stock.InsiderTransactions[i].transactionCode}</td>
            <td>${stock.InsiderTransactions[i].transactionPrice}</td>
            </tr>`;

    }
    html += '</table></div>';
    return html;

}

function eSGView() {
    const eSGScores = model.inputs.selectedStock.ESGScores;
    let html = '<div><h3>ESG DATA:</h3>';
    html += '<table>';
    html += /*html*/`
        <th>Controversy Level:</th>
        <th>Environment score:</th>
        <th>Governance score:</th>
        <th>Social score:</th>
        <th>Total ESG:</th>
        <th>Total ESG percentile:</th>
        </tr>`;
    html += /*html*/`
            <tr><td>${eSGScores.ControversyLevel}</td>
            <td>${eSGScores.EnvironmentScore}</td>
            <td>${eSGScores.GovernanceScore}</td>
            <td>${eSGScores.SocialScore}</td>
            <td>${eSGScores.TotalEsg}</td>
            <td>${eSGScores.TotalEsgPercentile}</td>
            </tr>`;

    html += '</table></div>';
    return html;


}

function earningsView() {
    const annualEarnings = model.inputs.selectedStock.Earnings.Annual;
    let html = '<div><h3>Inntjening:</h3>';
    html += '<table>';
    html += /*html*/`
        <th>Dato:</th>
        <th>Inntjening per aksje:</th>
        <th>Inntjening i % av dagens aksjeverdi:</th>
        </tr>`;
    for (let date in annualEarnings)
        html += /*html*/`
            <tr><td>${annualEarnings[date].date}</td>
            <td>${annualEarnings[date].epsActual}</td>
            <td>${epsInPercent(annualEarnings[date].epsActual)}</td>
            </tr>`;

    html += '</table></div>';
    return html;


}

function fundamentalData() {
    const stock = model.inputs.selectedStock;
    let html = '<div>';
    html += /*html*/`<h3>Fundamentale data:</h3>`;



    html += '<table>';
    html += /*html*/`
            <th><b>Trailing PE:</b></button></th>
            <th><b>Forward PE:</b></button></th>
            <th><b>Beta:</b></button></th>
            <th><b>PEG Ratio</b></button></th>
            <th><b>WSUpsidePotential:</b></button></th>
            <th><b>Market cap:</b></button></th>
            
            </tr>`;

    html += /*html*/`
                <tr>
                <td>${stock.Valuation.ForwardPE}</td>
                <td>${stock.Valuation.TrailingPE}</td>
                <td>${stock.Technicals.Beta}</td>
                <td>${stock.Highlights.PEGRatio}</td>
                <td>${getWSUpsidePotential(stock.General.Code)}</td>
                <td>${numberToMoney(stock.Highlights.MarketCapitalization )}</td>
                </tr>`;

    html += '</table>';     //numberToMoney(number_)    stock.Highlights.MarketCapitalization            


    html += '</div>';
    return html;

}

//veien videre?? - sammenligne selskaper, velge selskap fra dropdown-meny? - 


function compareStocksView(){


}