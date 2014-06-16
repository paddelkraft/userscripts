// ==UserScript==
// @name       Hitta Adress
// @namespace  http://hitta.se
// @version    0.1
// @description  Adds Name at the top of the Address in hitta.se details page so it is easy to copy a full address
// @match      http://www.hitta.se/*/person/*
// @copyright  2014+, You
// ==/UserScript==
function address(){
	var name = getElementByXpath("//div[@class ='details-header']//h1").textContent;
	var div = document.createElement("div");
    div.innerHTML= "<span>"+ name +"</span>";
    var addressDiv = document.getElementsByClassName("left-content")[0];
    addressDiv.insertBefore(div,addressDiv.firstChild );
}

var getElementByXpath = function (path) {
    return document.evaluate(path, document, null, 9, null).singleNodeValue;
};

setTimeout(address, 1000);
