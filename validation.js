(function (angular) {
    'use strict';
    var app = angular.module('ngValidationForm', ['ui.bootstrap', 'ngMessages'])

    app.controller('validationController', ['$scope', function ($scope) {
        $scope.ValidationMessage = "";
        $scope.submit = function (isValid) {
            // check to make sure the form is completely valid
            if (isValid) {
                alert("Valid");
            }
            else {
                alert("Invalid fields found!");
               
            }

        };
    }]);
    //https://github.com/angular/angular.js/wiki/Understanding-Directives
    app.directive('myPasswordVerify', [function () {
        return {
            require: 'ngModel',
            scope:'true',
            link: function (scope, element, attributes, aController) {
                var verifyPasswd = function () {
                    // Get password from ng-model 
                    var passwd1 = scope.$eval(attributes.ngModel);
                    //get the value of the other password  
                    var passwd2 = scope.$eval(attributes.myPasswordVerify);

                    return passwd1 == passwd2;
                };
                scope.$watch(verifyPasswd, function (validity) {
                    aController.$setValidity("passverified", validity);
                });
            }
        }
    }]);



})(window.angular);
