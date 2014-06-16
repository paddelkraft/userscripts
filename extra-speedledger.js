// ==UserScript==
// @name       eXtra speed Ledger
// @namespace  https://secure.speedledger.com/
// @version    0.1
// @description  Paste full address, Ex VAT calculator, Totals with VAT
// @match      https://secure.speedledger.com/*
// @copyright  2012+, Magnus Siverbrant
// ==/UserScript==

var style = ".siven{position:fixed; bottom:0;right:0;}";
//var style = ".siven{position:static; bottom:0;right:0;}";



//Set up
function enhance(){
    var container;
    if (null == divForCalculatorInsertion() && null == document.getElementById("inc")){
        setTimeout(enhance , 2000);
        return;
    }
    try{
        addExVATCalculator();
        totalsIncVAT();
        addAddressTextArea();
        console.log("Enhancement Setup Success");
    }catch(e){
        console.log("Enhancement Setup failed");
    }
}


function addAddressTextArea(){
    var container;
    container = document.createElement("div");
    //container.setAttribute("class", "siven");
    container.innerHTML = "Klistra in adress här: <textarea rows='1' cols='40' id = 'address'/>" ;
    //document.body.appendChild(container);
    divForPasteAddressInsertion().appendChild(container);
    document.getElementById("address").onchange= function(){insertAddresInForm();};
    document.getElementById("address").onfocus= function(){document.getElementById("address").value = "";};
}



function addExVATCalculator(){
    
    container = document.createElement("div");
    container.innerHTML = "____________________________________  inc moms: <input type='number' name='inc' id = 'inc' value = '' > ex moms: <input type='number' name='ex' id = 'ex'>" ;
    divForCalculatorInsertion().appendChild(container);
    document.getElementById("inc").onchange= function(){calcExVAT();};
    document.getElementById("inc").onfocus= function(){document.getElementById("inc").value = "";};
    
    
}



//Event triggered & worker methods

function totalsIncVAT(){
    setTimeout(totalsIncVAT , 1000);
    var sum = document.getElementsByClassName("x-grid3-cell x-grid3-footer-cell x-grid3-td-sum")[0].textContent;
    sum = parseFloat(sum.replace(",",".").replace(" ", "")) * 1.25;
    document.getElementsByClassName("x-grid3-cell x-grid3-footer-cell x-grid3-td-moreColumnId")[0].firstChild.innerHTML = sum   ;
}

function insertAddresInForm(){
    /*
     * Parsing standard swedish Addresses and adds the components to the right form fields.
     * Example:
     * 		Erik Andersson
     * 		Brogatan 13
     * 		44235 Kullbacka 
    */
    console.log("parse pasted address");
    var address = parseAddress(document.getElementById("address").value);
    custNameInput().value = address[0];
    custStreetAddressInput().value = address[1]; 
    var postnr =  address[2];//.match(/^\d{3}\s?\d{2}/); 
    //document.getElementById("x-auto-113-input").value = postnr; 
    custPostalCodeInput().value = postnr;
    //document.getElementById("x-auto-114-input").value = address[2].replace(postnr , "").trim(); //City
    custCityInput().value = address[3];//.replace(postnr , ""); //City
    console.log("address parsing Successfull");
}

function calcExVAT(){
    console.log("Calculate Ex VAT");
    var inc = document.getElementById("inc").value;
    document.getElementById("ex").value = inc * 0.8;
    document.getElementById("ex").select();
}

//Utility methods

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    console.log("Style Appended"); 
}

function setStyle(){
    addGlobalStyle(style);
}

var getElementByXpath = function (path) {
    return document.evaluate(path, document, null, 9, null).singleNodeValue;
};

function invoiceingAddressInput(labelText){
    return getElementByXpath("//div[label/text()='Fakturaadress']//div[label/text()='"+labelText+"']//input");
}

function custNameInput(){
    return getElementByXpath("//div[@class ='x-panel-bwrap']//div[contains(.,'Kundnamn')]//input");
}

function custStreetAddressInput(){
    return invoiceingAddressInput("Adress");
}

function custPostalCodeInput(){
    return invoiceingAddressInput("Postnummer");
}

function custCityInput(){
    return invoiceingAddressInput("Postort");
}

function divForCalculatorInsertion(){
    return getElementByXpath("//div[span/text()='Fakturarader']");
}

function divForPasteAddressInsertion(){
    return getElementByXpath("//div[span/text()='Fakturahuvud']");
}

function parseAddress(input){
    console.log(input);
    var address = input.split("\n");
    var i=0;
    var output = new Array();
    console.log(address.length);
    for( i=0; i < address.length ; i++){
        console.log(i);
        if(0 < address[i].trim().length){
            console.log("Adding line "+ i + " to output");
            if(null != address[i].match(/^\d{3}\s?\d{2}/)){
                var match =address[i].match(/^\d{3}\s?\d{2}/); 
                output.push(match);
                address[i]=address[i].replace(match , "").trim();
                i--;
            } else{
                output.push(address[i].trim());
            }
        }
    }
    
    console.log(output);
    return output;
}


//Start

setTimeout(setStyle,2000);
setTimeout(enhance,3000);
