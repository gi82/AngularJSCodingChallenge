# angularjs-coding-challenge
Coding challenge

#etventure Front-End Challenge
// Tested on Google Chrome and Microsoft Edge

1.Create a responsive bootstrap using the `data.json` file to cgrid with headers  **city**, **start date**, **end date**, **price**, **status**, **color**.  
All the Columns should be sortable.  

SMSJsonData.html
a) Reading the .json file
*********************************
Define input data format:
var jsonDateFileFormat = "MM/dd/yyyy";
var jsonDecimalSeparator = ".";
var jsonThousandsSeparator = ",";
b) Change locale without using i18n function of angularJS 

Sorting
**************************************************************************************************************
(See Building Custom AngularJS Filters: https://scotch.io/tutorials/building-custom-angularjs-filters)
-> ID: Simple numerical sorting
-> City: Handle special characters (e.g ł,í,Č,ö) using lexicographical sorting (%KW_SORT_LEXICOGRAPHICAL%)
-> Start date, end date: Date sorting depending on locale
-> Price: float ordering
-> Status: introduce map array %KW_SORT_MAP_ARRAY%
	"Never"
	"Once"
	"Seldom"
	"Often"
	"Daily" 
	"Weekly"
	"Monthly"
	"Yearly"
-> Color: sorting by calculating hue %KW_SORT_HUE%

2. Insert two date pickers to filter the object by date range.

Date Filtering
****************************************************************************************************************
1) Find minimum date  (End date can be earlier than start date)
2) Compare "From"-date with minimum date and "To"-date with maximum date. No filtering takes places if a date
is given in wrong format.

Improvements:
*************
- Paging: too many pages when pagesize <50
- Localization for calendarpicker
- Validation of date field using regular expression
- Allow date input d/m/yyyy e.g 2/4/2014 => 02/04/2014

3. Create a form with validation of the following fields **email**, **password**, **confirm password**. 
All fields are required, password fields have to match and at least 8 characters. If a field is not valid, 
highlight it and show a corresponding message.

Validation.html


