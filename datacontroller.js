(function (angular) {
    'use strict';

    var app = angular.module('ngSMSCodingChallenge', ['ui.bootstrap', 'ui.bootstrap.datetimepicker'])
    var sortingOrder = 'id';
    // JSON File related settings
    // Date string format, decimal separator and thousands separator in data.json file
    var jsonDateFileFormat = "MM/dd/yyyy";
    var jsonDecimalSeparator = ".";
    var jsonThousandsSeparator = ",";
    // Create mapping for status field
    var mapArray = { "Never": 0, "Once": 1, "Seldom": 2, "Often": 3, "Daily": 4, "Weekly": 5, "Monthly": 6, "Yearly": 7 };

    // General Javascript functions

    // Convert string to float object
    // Remove thousand separator and replace decimal separator ALWAYS with "."
    function StringToFloat(myFloat, myDecimalSeparator, myThousandsSeparator) {
        var _floatstr = myFloat.replace(' ', '').replace(myThousandsSeparator, '').replace(myDecimalSeparator, ".")
        return parseFloat(_floatstr);
    }
    // Sort function for color columns
    // Get R,G,B from hexCode
    function hexRGB(rgbChar, hexCode) {

        var _hexCode = hexCode.trim();

        // if code starts with #
        if (_hexCode.charAt(0) == '#') {
            _hexCode = _hexCode.substring(1, 7);
        }

        if (rgbChar == 'R') {
            return parseInt(_hexCode.substring(0, 2), 16);
        }
        else if (rgbChar == 'G') {
            return parseInt(_hexCode.substring(2, 4), 16);
        }
        else if (rgbChar == 'B') {
            return parseInt(_hexCode.substring(4, 6), 16);
        }
    }
    // Convert RGB To HSL
    // https://en.wikipedia.org/wiki/Hue
    // https://en.wikipedia.org/wiki/HSL_and_HSV
    // Hue(h), Saturation(s) and lightness(l)
    // https://github.com/mjackson/mjijackson.github.com/blob/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.txt
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    }
    // Wrap functions to convert HEX directly to HSL
    function HEXtoHSL(hexCode) {
        var R = hexRGB('R', hexCode);
        var G = hexRGB('G', hexCode);
        var B = hexRGB('B', hexCode);

        return rgbToHsl(R, G, B);
    }
    // Converts string to javascript Date object
    function StringToDate(dateString, dateFormat, delimiter) {

        var _format = dateFormat;
        var _formatItems = _format.split(delimiter);

        var _dateItems = dateString.split(delimiter);

        var _monthIndex = _formatItems.indexOf("MM");
        var _dayIndex = _formatItems.indexOf("dd");
        var _yearIndex = _formatItems.indexOf("yyyy");

        var _month = parseInt(_dateItems[_monthIndex]) - 1;
        var _day = parseInt(_dateItems[_dayIndex]);
        var _year = parseInt(_dateItems[_yearIndex]);

        return new Date(_year, _month, _day);
    }
    // %KW_SORT_LEXICOGRAPHICAL%
    // See: https://scotch.io/tutorials/building-custom-angularjs-filters
    // Custom filter for special characters
    app.filter('customOrderBy', function () {
        return function (array, sortingOrder, reverseOrder) {
            // Declare different sorting function for the different types of fields
            // Test type 
            // Sort function for numbers | string (lexicographical for special characters) | dates and booleans 
            function mySort(a,b) 
            {
                var valueA = a[sortingOrder];
                var valueB = b[sortingOrder];

                if (isString(valueA))
                    return !reverseOrder ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);

                if (isNumber(valueA) || isBoolean(valueA) )
                    return !reverseOrder ? valueA - valueB : valueB - valueA;
                if (isDate(valueA)) {
                    return !reverseOrder ? new Date(valueA) - new Date(valueB) : new Date(valueB) - new Date(valueA);
                }

                return 0;
            }
            // %KW_SORT_MAP_ARRAY%
            // Sort by status
            function mySortArrayCompare(a, b) {

                var valueA = a[sortingOrder];
                var valueB = b[sortingOrder];
                
                return !reverseOrder ? mapArray[valueA] - mapArray[valueB] : mapArray[valueB] - mapArray[valueA];
            }
            //%KW_SORT_HUE%
            // Sorting colors by hue
            function mySortColors(a, b) {
                var valueA = a[sortingOrder];
                var valueB = b[sortingOrder];

                var RA = hexRGB('R', valueA);
                var GA = hexRGB('G', valueA);
                var BA = hexRGB('B', valueA);

                var RB = hexRGB('R', valueB);
                var GB = hexRGB('G', valueB);
                var BB = hexRGB('B', valueB);

                var hslA = HEXtoHSL(valueA);
                var hslB = HEXtoHSL(valueB);
                return !reverseOrder ? hslA[0] - hslB[0] : hslB[0] - hslA[0];
            }
            
            if (!Array.isArray(array)) return array;
            if (!sortingOrder) return array;
            
            var isString = function (value) {
                return (typeof value === "string");
            };

            var isNumber = function (value) {
                return (typeof value === "number");
            };

            var isBoolean = function (value) {
                return (typeof value === "boolean");
            };

            var isDate = function (value) {
                
                return (value instanceof Date);
            };

            var arrayCopy = [];
            angular.forEach(array, function (item) {
                arrayCopy.push(item);
            });
            if (sortingOrder == 'id' || sortingOrder =='city' || sortingOrder == 'start_date' || sortingOrder == 'end_date' || sortingOrder == 'price' ) {
                arrayCopy.sort(mySort);
            }
            else if (sortingOrder == 'status') {
                arrayCopy.sort(mySortArrayCompare);
            }
            else if (sortingOrder == 'color') {
                arrayCopy.sort(mySortColors);
            }

            return arrayCopy;
        }
    });
    
    app.filter('priceFormat', function () {
        return function (price, decimalSeparator) {
            return price.toFixed(2).replace(".", decimalSeparator);
        }
    });

    app.controller('DataController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

        var myApp = this;

        $scope.cities = []; //declare an empty array
        $scope.IDtitle = "Id";
        $scope.CityTitle = "City";
        $scope.StartDateTitle = "Start date";
        $scope.EndDateTitle = "End date";
        $scope.FromTitle = "From";
        $scope.ToTitle = "To";
        $scope.PriceTitle = "Price";
        $scope.StatusTitle = "Status";
        $scope.ColorTitle = "Color";
        $scope.PageTitle = "Pagesize";
        $scope.LocaleTitle = "Locale";

        // DATE PICKERS
        this.pickerfrom = {

            datepickerOptions: {
                showWeeks: true,
                startingDay: 1,
                saveAs: "number",
                dateFormat: 'yyyy-MM-dd',
                html5Types: {
                    date: 'yyyy-MM-dd'
                },
                // All dates should be available
                //dateDisabled: function (data) {
                //    return (data.mode === 'day' && (new Date().toDateString() == data.date.toDateString()));
                //}
            }
        };
        // date picker
        this.pickerto = {
            //date: new Date('2015-03-01T00:00:00Z'),
            datepickerOptions: {
                showWeeks: false,
                startingDay: 1,
                
            }
        };
       
        this.openCalendar = function (e, picker) {
            myApp[picker].open = true;
        };

        // Read JSON file 

        $http.get("data.json")
            .success(function (data, status, headers, config) {
                //alert("data loaded");
                $scope.cities = data;  //ajax request to fetch data into $scope.cities
                // Convert string to Javascript Objects
                $scope.cities.forEach(function (value, key) {
                    value.color2 = HEXtoHSL(value.color)[0]; // Get hue value for testing purposes
                    value.start_date = StringToDate(value.start_date, jsonDateFileFormat, "/"); // converting into date
                    value.end_date = StringToDate(value.end_date, jsonDateFileFormat, "/"); // converting into date
                    value.price = StringToFloat(value.price, jsonDecimalSeparator, jsonThousandsSeparator);
                });

                $scope.sortingOrder = sortingOrder;
                $scope.pageSizes = [50,100,200,300,400,500,1000];
                $scope.localeList = ["EN","DE"];
                $scope.reverse = false;
                $scope.filteredItems = [];
                $scope.groupedItems = [];
                $scope.itemsPerPage = 100;
                $scope.appLocale = "EN";
                $scope.decimalDelimiter = ".";
                $scope.thousandsDelimiter = ",";
                $scope.pagedItems = [];
                $scope.currentPage = 0;
                $scope.query = "";
                $scope.startDateFilter = "";
                $scope.endDateFilter = "";

                // Filter cities
                $scope.search = function () {

                    $scope.filteredItems = $filter('filter')($scope.cities, function (item) {

                        // - Check if dates within range
                        // find minimum and maximum dates 

                        var minDate = item.start_date;
                        var maxDate = item.end_date;
                        if (minDate > maxDate) {
                            var tmpDate = minDate;
                            minDate = maxDate;
                            maxDate = tmpDate;
                        }
 

                        var startFilter = !$scope.startDateFilter ? true : $scope.startDateFilter <= minDate;
                        var endFilter = !$scope.endDateFilter ? true : (startFilter ? $scope.endDateFilter >= maxDate : false);


                        if (startFilter == true && endFilter == true) return true;
                        else return false;

                    });

                    // Sort results
                    if ($scope.sortingOrder !== '') {

                        //Add custom Order by
                        $scope.filteredItems = $filter('customOrderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                    }
                    $scope.currentPage = 0;
                    // Paging time ...
                    $scope.applyPagination();
                };
                // Search again when new date entered
                $scope.onDateChanged = function () {
                    $scope.search();
                };
                // Set locale (same old "comma and dot" story)
                $scope.setLocale = function (localeString) {
                    if (localeString == "DE") {
                        $scope.IDtitle = "Id";
                        $scope.CityTitle = "Stadt";
                        $scope.FromTitle = "Von";
                        $scope.ToTitle = "Bis";
                        $scope.StartDateTitle = "Startdatum";
                        $scope.EndDateTitle = "Enddatum";
                        $scope.PriceTitle = "Preis";
                        $scope.StatusTitle = "Status";
                        $scope.ColorTitle = "Farbe";
                        $scope.PageTitle = "Pagesize";
                        $scope.LocaleTitle="Locale"
                        $scope.decimalDelimiter = ",";
                        $scope.thousandsDelimiter = ".";
                        $scope.dateFormat = 'dd.MM.yyyy';
                        $scope.dateFormatDelimiter = '.';
                        
                    }
                    // default language is english
                    else {
                        $scope.IDtitle = "Id";
                        $scope.CityTitle = "City";
                        $scope.FromTitle = "From";
                        $scope.ToTitle = "To";
                        $scope.StartDateTitle = "Start date";
                        $scope.EndDateTitle = "End date";
                        $scope.PriceTitle = "Price";
                        $scope.StatusTitle = "Status";
                        $scope.ColorTitle = "Color";
                        $scope.PageTitle = "Pagesize";
                        $scope.LocaleTitle = "Locale"
                        $scope.decimalDelimiter = ".";
                        $scope.thousandsDelimiter = ",";
                        $scope.dateFormat = 'MM/dd/yyyy';
                        $scope.dateFormatDelimiter = '/';
                    }
                }
                $scope.range = function (start, end, maxElements) {
                    var range = [];
                    
                    // check if current page in range
                    // do not include option for gaps 
                    // list is relative small
                    // %IMPROVE%
                    var before = $scope.currentPage - maxElements;
                    var after = $scope.currentPage + maxElements;
                    var mystart =start;
                    var myend = end;

                    for (var i = mystart; i < myend  ; i += 1) {
                        range.push(i);
                    }
                    

                    return range;
                };
                $scope.firstPage = function () {
                    $scope.currentPage = 0;
                };
                $scope.lastPage = function () {
                    $scope.currentPage = $scope.pagedItems.length-1;
                };
                
                // Set page
                $scope.setPage = function () {
                    $scope.currentPage = this.n;
                };
                // Next page
                $scope.nextPage = function () {
                    if ($scope.currentPage < $scope.pagedItems.length - 1) {
                        $scope.currentPage++;
                    }
                };
                // Previous page
                $scope.prevPage = function () {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                    }
                };

                // show items per page
                $scope.changeLocale = function () {
                    $scope.setLocale($scope.appLocale);
                }
                $scope.perPage = function () {
                    $scope.applyPagination();
                    // go to first page
                    $scope.currentPage = 0;
                };
                // calculate page in place
                $scope.applyPagination = function () {
                    $scope.pagedItems = [];

                    for (var i = 0; i < $scope.filteredItems.length; i++) {
                        if (i % $scope.itemsPerPage === 0) {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
                        } else {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                        }
                    }

                };
                $scope.setLocale($scope.appLocale);
                $scope.search();
                // change sorting order
                $scope.sort = function (newSortingOrder) {
                    
                    if ($scope.sortingOrder == newSortingOrder)
                        $scope.reverse = !$scope.reverse;

                    $scope.sortingOrder = newSortingOrder;
                    $scope.search();
                    
                };



            })
            // Show error when unable to read json data
            .error(function (data, status, headers, config) {
                $scope.cities = "error while loading data"; //return if error on fetch
                alert("cannot load data (errnum: "+status+")");
            });

        
    }])
})(window.angular);