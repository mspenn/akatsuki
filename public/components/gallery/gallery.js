/**
 * Created by v_chenqianming on 2015/11/5.
 */
'use strict';
/* Controllers */
app
    .controller('GalleryCtrl', ['$scope', '$http', function ($scope, $http) {
        $http({
            url: '/gallery',
            method: 'GET'
        }).success(function (data) {
            $scope.galleryList = data;
        }).error(function (data, header, config, status) {
        });

    }]);