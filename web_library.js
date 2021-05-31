// JavaScript Document

// CONSTANTS

var ORDER = 'IVXLCDM'
var SERIES = ['IVX', 'XLC', 'CDM', ['M', 'MMM', '']]
var FIVES = 'VLD'
var ONES = 'IXCM'
var ROMAN_TO_ARABIC = {
	'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
}

// IE8 and earlier does not have the Array methods indexOf or filter
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i += 1) {
            if (this[i] == obj) {return i}}
        return -1;
    }
}

// Javascript does not have a multiply string function
String.prototype.repeat = function(num)
{
    return new Array(num+1).join(this);
}

// Javascript has no great way to test numbers
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// VALIDITY

function determine_system(number)
{
	if (!number) {return 0}
	if (isNumber(number)) {return 1}
	for (var i=0; i < number.length; i++) {
		if (ORDER.indexOf(number[i]) == -1) {return -1}}
	return 2
}

function valid_arabic(arabic)
{
	if (arabic <= 0) {return false}
	if (arabic >= 5000) {return false}
	return true
}

function valid_roman(groups)
{
	var temp = groups.join('')
	for (var i=0; i < ORDER.length; i++) {
		if ((ONES.indexOf(ORDER[i]) == -1 && temp.indexOf(ORDER[i].repeat(2)) != -1) || (ONES.indexOf(ORDER[i]) != -1 && temp.indexOf(ORDER[i].repeat(5)) != -1)) {return false}}
	
	var i = 0
	while (i < groups.length) {
		if (groups[i].length == 2) {
			
			if (FIVES.indexOf(groups[i][0]) != -1) {return false}
			if (ORDER.indexOf(groups[i][0]) +2 < ORDER.indexOf(groups[i][1])) {return false}
			if (i > 0) {
				if(groups[i][0] == groups[i-1][0]) {return false}
				if (FIVES.indexOf(groups[i][1]) != -1 && groups[i-1].indexOf(groups[i][1]) != -1) {return false}
			}
		}
		
		if (i > 0) {
			if (groups[i-1].length == 2) {
				if (ORDER.indexOf(groups[i][0]) >= ORDER.indexOf(groups[i-1][0])) {return false}}}
			
		i++
	}
	return true
}

// ROMAN TO ARABIC

function roman_to_groups(roman)
{
	var groups = []
	
	var i = 0
	while (i < roman.length) {
		if (i < roman.length - 1) {
			if (ORDER.indexOf(roman[i]) < ORDER.indexOf(roman[i+1])) {
				groups.push(roman[i] + roman[i+1]); i += 2}
			else {groups.push(roman[i]) ; i++ }
		}
		else {groups.push(roman[i]) ; i++ }
	}
	return groups
}

function roman_to_arabic(groups)
{
	var arabic = 0
	
	for (var i=0; i < groups.length; i++) {
		if (groups[i].length == 1) {arabic += ROMAN_TO_ARABIC[groups[i][0]]}
		else {
			arabic += (ROMAN_TO_ARABIC[groups[i][1]] - ROMAN_TO_ARABIC[groups[i][0]])
			}
	}
	
	return arabic
}

// ARABIC TO ROMAN

function arabic_to_roman(arabic)
{
	var roman = ''
	var arabic = arabic.toString()
	
	var i = 0
	while (i < arabic.length) {
		
		var spelling = {
			'0': '',
            '1': SERIES[i][0],
            '2': SERIES[i][0].repeat(2),
            '3': SERIES[i][0].repeat(3),
            '4': SERIES[i][0] + SERIES[i][1],
            '5': SERIES[i][1],
            '6': SERIES[i][1] + SERIES[i][0],
            '7': SERIES[i][1] + SERIES[i][0].repeat(2),
            '8': SERIES[i][1] + SERIES[i][0].repeat(3),
            '9': SERIES[i][0] + SERIES[i][2]
		}
		
		roman = spelling[arabic[arabic.length - (i+1)]] + roman
		i++
	}
	return roman
}

// PROGRAM

function get_result(number)
{
	var system = determine_system(number)
	
	if (system == -1) {return 'Invalid'}
	if (system == 0) {return ''}
	if (system == 1) {
		var arabic = Number(number)
		if (!valid_arabic(arabic)) {return 'Arabic out of range'}
		else {return arabic_to_roman(arabic)}
	}
	else {
		var groups = roman_to_groups(number)
		if (!valid_roman(groups)) {return 'Faulty Roman syntax'}
		else {return roman_to_arabic(groups)}
	}
}