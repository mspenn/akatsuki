/**
 * Created by v_chenqianming on 2015/11/5.
 */
'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
    .config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .otherwise('/app/gallery');
            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: '/components/app.html'
                })
                .state('app.gallery', {
                    url: '/gallery',
                    templateUrl: '/components/gallery/gallery.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(["/components/gallery/gallery.js"]);
                            }]
                    }
                })
                .state('app.player', {
                    url: '/player/:id',
                    templateUrl: '/components/player/player.html',
                    controller: ['$scope', '$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {
                        if ($stateParams.id) {
                            $scope.resId = $stateParams.id;
                        }
                    }],
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "/javascripts/video.js/ie8/videojs-ie8.min.js",
                                    "/javascripts/video.js/video.min.js",
                                    "/components/player/player.js"
                                ]);
                            }]
                    }
                })
        }
    ]
);