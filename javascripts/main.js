"use strict";

$(document).ready(function(){
	var dataArray=[];
	var selectedTypes=[];
	var chosenCategory;
	var categoryId;
	var counter;

	function writeToDom(productArray){
		var productPageString = " ";
		productPageString+=`<div class="row">`
		for (var m=0; m<productArray.length; m++){
			productPageString+=`<div class="col-sm-6 col-md-4">`;
			productPageString+=`<div class="thumbnail">`;
			productPageString+=`<img src="https://thumbs.dreamstime.com/t/wand-gold-sparkles-3-29192037.jpg" alt="fairy sparkler">`;
			productPageString+=`<div class="caption">`;
			productPageString+=`<h3>${productArray[m].name}</h3>`;
			productPageString+=`<p>Category: ${chosenCategory}</p>`;
			productPageString+=`<p>Type: ${productArray[m].typeName}</p>`;
			productPageString+=`<p>${productArray[m].description}</p>`;
			productPageString+=`</div></div></div>`;
		}
		productPageString+=`</div>`;
		$("#products").html(productPageString);
		productArray=[];
	}

	var productsToPrint;
	function selectedProducts(){
		productsToPrint=[];
		selectedTypes=[];
		for (var k=0; k<dataArray.length; k++){
			if (dataArray[k].value==="categories" && dataArray[k].name===chosenCategory){
				categoryId = dataArray[k].id;
			}
			if (dataArray[k].value==="type" && dataArray[k].category ===categoryId){
				selectedTypes.push(dataArray[k]);
			}
			for (var z=0; z<selectedTypes.length; z++){
				if (dataArray[k].value==="product" && dataArray[k].type===selectedTypes[z].id){
					dataArray[k].typeName = selectedTypes[z].name;
					productsToPrint.push(dataArray[k]);
				}
			}
		}
			writeToDom(productsToPrint);
		

	}
	function getData(){
		counter=0;
		chosenCategory = this.id;
		var categoriesJSON = function (){
			return new Promise (function(resolve, reject){
				$.ajax("./db/categories.json").done(function(categoryData){
					resolve(categoryData.categories);
				}).fail(function(categoryError){
					reject(categoryError);
				});
			});	
		};
		categoriesJSON().then(function(categoryJSONData){
			dataArray=categoryJSONData;
			for (var x=0; x<dataArray.length; x++){
				dataArray[x].value = "categories";
			}
		});
		var typesJSON = function (){
			return new Promise (function(resolve, reject){
				$.ajax("./db/types.json").done(function(typeData){
					resolve(typeData.types);
				}).fail(function(typeError){
					reject(typeError);
				});
			});	
		};
		typesJSON().then(function(typeJSONData){
			var oldArrayLength = dataArray.length;
			for (var i=0; i<typeJSONData.length; i++){
				dataArray.push(typeJSONData[i]);
				dataArray[i+oldArrayLength].value = "type";
			}
		});
		var productsJSON = function (){
			return new Promise (function(resolve, reject){
				$.ajax("./db/products.json").done(function(productData){
					resolve(productData.products);
				}).fail(function(productError){
					reject(productError);
				});
			});	
		};
		productsJSON().then(function(productJSONData){
			var oldArrayLength = dataArray.length;
			for (var j=0; j<productJSONData.length; j++){
				dataArray.push(productJSONData[j]);
				dataArray[j+oldArrayLength].value = "product";
			}
			selectedProducts();
		});
	}
	$("#fireworks").click(getData);
	$("#demolition").click(getData);
});