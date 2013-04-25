/**
 * @author mlakhara
 * wrapper class for the autoSuggest plugin by code.drewwilson.com (plugin modified to be used with this code)
 * It gives various functions which make the handling of the tag input easier.
 *
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */
var coSuggest = function(options) {
	this.selector = options.selector;
	this.options = options;
	this.valuesField = options.valuesFields;

	//if type is not defined , default type will be people

	if ( typeof (options.type) === 'undefined') {
		this.type = 'people';
	} else {
		this.type = options.type;
	}

	// if as_options are not defined, as_options will be a empty object

	if ( typeof (options.as_options) === 'undefined') {
		this.as_options = {};
	} else {
		this.as_options = options.as_options;
	}

	//the initData field will be an array of object containing {id,value} of prefilled items initially
	//the addData field will be an array of object containing {id,value} of new selected items from the suggestions
	//the newData field will be an array of strings [values] containing the new values added
	//the removeData field will be an array of objects containing {id,value} of the items from data to be removed
	if ( typeof (options.initData) !== 'undefined') {
		this.initData = options.initData;
		this.as_options.preFill = this.initData;
	}
	//newData contains the new items to be added to the database (Just created tags)
	this.newData = [];

	//addData contains tags present in the database
	this.addData = [];

	//removeData will contain items that are present in the database and are to be removed

	this.removeData = [];

	this.as_options.wrapperObj = this;

	// callback function to be added in as_options as selectionAdded
	this.as_options.selectionRemoved = function(elem, last, wrapperObj) {
		var that = wrapperObj;
		$(elem).fadeOut('fast');
		$(elem).remove();
		if (last !== "") {
			deleteItemIndex = that.find(that.initData, last);
			if ( typeof deleteItemIndex === 'undefined') {
				deleteItemIndex = that.find(that.addData, last);
				if ( typeof deleteItemIndex === 'undefined') {
					deleteItemIndex = that.find(that.newData, last);
					that.newData.splice(deleteItemIndex, 1);
				} else {
					that.addData.splice(deleteItemIndex, 1);
				}
			} else {
				that.removeData.push(that.initData[deleteItemIndex]);
			}
		}
	}
	var that = this;

	//bind function binds the autoSuggest with the selected item
	this.bind = function(options) {
		$(this.selector).autoSuggest(base_url + this.urlConf[this.type], this.as_options);
	}
};

// function finf finds the object in array and returns index
coSuggest.prototype.find = function(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].id == value) {
			return i;
		}
	}
}
//urlConf for searching the items sitewide
coSuggest.prototype.urlConf = {
	cat1 : 'abc',
	cat2 : "xyz",
	cat3 : 'xyz',
	cat4 : 'xyz',

};


// function subtract first array from second
coSuggest.prototype.realAddData = function(){
	var that = this;
	var len = that.addData.length;
	var spliceIndices = [];
	for (var i = 0;i < len;i++){
		for(var j= 0;j<that.initData.length;j++){
			if(that.addData[i].id == that.initData[j].id){
				
				spliceIndices.push(i);
				//that.addData.splice(i,1);
				//i=i-1;
			}
		}
	}
	//console.log(spliceIndices);
	for(var i = 0; i<spliceIndices.length; i++){
		that.addData.splice(spliceIndices[i] -i,1);
	}
}

coSuggest.prototype.realRemoveData = function(){
	var that = this;
	var len = that.removeData.length;
	var spliceIndices = [];
	for (var i = 0;i < len;i++){
		for(var j= 0;j<that.addData.length;j++){
			if(that.removeData[i].id == that.addData[j].id){
				
				spliceIndices.push(i);
				//that.addData.splice(i,1);
				//i=i-1;
			}
		}
	}
	//console.log(spliceIndices);
	for(var i = 0; i<spliceIndices.length; i++){
		that.removeData.splice(spliceIndices[i] -i,1);
	}
}

coSuggest.prototype.values = function(){
	console.log(this);
	this.realRemoveData();
	this.realAddData();
	return {
		addData : this.addData,
		newData : this.newData,
		removeData : this.removeData,
	}
}

// callback function to be added in as_options as selectionAdded

//bind function to bind the autoSuggest plugin with the selector provided

