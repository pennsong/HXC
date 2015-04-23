// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova'])

    .run(function ($ionicPlatform, $cordovaDevice, $cordovaKeyboard) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            $cordovaKeyboard.hideAccessoryBar(true)

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'registerCtrl'
            })
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tab.html'
            })
            .state('tab.meet', {
                url: '/meet',
                views: {
                    'meet': {
                        templateUrl: 'templates/tab-meet.html',
                        controller: 'meetCtrl'
                    }
                }
            })
            .state('tab.contact', {
                url: '/contact',
                views: {
                    'contact': {
                        templateUrl: 'templates/tab-contact.html',
                        controller: 'contactCtrl'
                    }
                }
            })
            .state('tab.meet.info', {
                url: '/info',
                views: {
                    'meet@tab': {
                        templateUrl: 'templates/meet-info.html',
                        controller: 'meetInfoCtrl'
                    }
                }
            })
            .state('tab.profile', {
                url: '/profile',
                views: {
                    'profile': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })
            .state('tab.contact.chat', {
                url: '/chat/{meetId}',
                views: {
                    'contact@tab': {
                        templateUrl: 'templates/contact-chat.html',
                        controller: 'chatCtrl'
                    }
                }
            })
            .state('tab.meet.condition', {
                url: '/condition',
                views: {
                    'meet@tab': {
                        templateUrl: 'templates/meet-condition.html',
                        controller: 'meetConditionCtrl'
                    }
                }
            })
            .state('tab.meet.condition.specialPic', {
                url: '/specialPic',
                views: {
                    'meet@tab': {
                        templateUrl: 'templates/condition-specialPic.html',
                        controller: 'conditionSpecialCtrl'
                    }
                }
            }).state('tab.meet.detail', {
                url: '/detail/{meetId}',
                views: {
                    'meet@tab': {
                        templateUrl: 'templates/meetDetail.html',
                        controller: 'meetDetailCtrl'
                    }
                }
            });
    });

app.controller('baseCtrl', function ($scope, $rootScope, $state, $ionicPopup, $http) {
    $rootScope.r_token = null;

    $rootScope.r_username = window.localStorage['username'] || '';

    $rootScope.r_lastLocation = {
        lng: null,
        lat: null
    }

    $rootScope.r_curMeet = null;

    $rootScope.r_searchMode = null;

    $rootScope.r_curOptions = [];
    $rootScope.r_curOptionName = null;

    $rootScope.r_mainInfo = null;

    $rootScope.r_serverRoot = "http://192.168.1.20:3000/";
    $rootScope.r_imagePath = $rootScope.r_serverRoot + 'images/';
    $rootScope.r_sysImagePath = $rootScope.r_serverRoot + 'images/system/';

    $rootScope.r_curOptions = [];
    $rootScope.r_curOptionName = null;

    $rootScope.r_curChatFriendUsername = null;

    $rootScope.r_myLocation = {
        lng: null,
        lat: null
    }

    $rootScope.r_myInfo = {
        "specialInfo": {
            "sex": null,
            "clothesColor": null,
            "clothesStyle": null,
            "clothesType": null,
            "glasses": null,
            "hair": null
        },
        specialPic: null,
        specialPicDisplay: null
    }

    $rootScope.r_meetCondition = {
        mapLoc: {
            uid: '',
            name: '',
            address: ''
        },
        specialInfo: {
            sex: '',
            clothesColor: '',
            clothesStyle: '',
            clothesType: '',
            glasses: '',
            hair: ''
        }
    };

    $rootScope.r_meetTargetUpdated = {};

    $rootScope.r_targets = [];

    $rootScope.r_sex = [
        "男",
        "女"
    ];

    $rootScope.r_hair = [
        "竖起",
        "躺下",
        "辫子/盘发",
        "短发(齐肩,不过肩)",
        "长发(过肩)",
        "戴帽子"
    ];

    $rootScope.r_glasses = [
        "带",
        "不带"
    ];

    $rootScope.r_clothesType = [
        "风衣/大衣/夹克",
        "西装/套装",
        "运动外套/卫衣",
        "T恤长袖",
        "T恤短袖",
        "马甲/背心",
        "长袖衬衫",
        "短袖衬衫",
        "毛衣/羊毛绒/线衫/针织"
    ];

    $rootScope.r_clothesColor = [
        "红/紫/粉",
        "黄",
        "蓝/绿",
        "白",
        "黑",
        "灰",
        "无法分辨主要颜色"
    ];

    $rootScope.r_clothesStyle = [
        "纯色",
        "线条/格子/色块",
        "图案(抽象,卡通,画等)"
    ];
});

app.controller('loginCtrl', function ($scope, $rootScope, $state, PPHttp, $cordovaToast) {
    $scope.user = {};

    $scope.goRegister = function () {
        $rootScope.r_newUser = {
            username: null,
            password: null,
            sex: null,
            nickname: null,
            cid: null
        }

        $state.go("register");
    }

    $scope.login = function (user) {
        if (!user.username || !user.password) {
            $cordovaToast.showShortCenter('用户名和密码都不能为空!');
            return;
        }

        PPHttp.do(
            'login', {
                username: user.username,
                password: user.password,
                cid: 't1' //$cordovaDevice.getUUID()
            },
            //success
            function (data, status) {
                $rootScope.r_mainInfo = data.ppData;
                window.localStorage['username'] = user.username;
                window.localStorage['token'] = data.ppData.token;
                $state.go("tab.meet");
            }
        );
    }

});

app.controller('registerCtrl', function($scope, $rootScope, $state, PPHttp, $cordovaToast) {
    $rootScope.r_newUser = {
        username: null,
        password: null,
        sex: null,
        nickname: null,
        cid: null
    }

    $scope.register = function(newUser){
        newUser.cid = 't2';//$cordovaDevice.getUUID();
        if (!(newUser.username && newUser.password && newUser.sex && newUser.nickname && newUser.cid))
        {
            $cordovaToast.showShortCenter('用户名, 密码, 性别, 昵称都不能为空!');
            return;
        }

        PPHttp.do(
            'register', {
                username: newUser.username,
                password: newUser.password,
                nickname: newUser.nickname,
                cid: newUser.cid,
                sex: newUser.sex
            },
            //success
            function (data, status) {
                $rootScope.r_mainInfo = data.ppData;
                window.localStorage['username'] = newUser.username;
                window.localStorage['token'] = data.ppData.token;
                $state.go("tab.meet");
            }
        );
    }
});

app.controller('meetCtrl', function($scope, $rootScope, $state, $ionicModal, PPHttp) {
    $scope.doRefresh = function() {
        PPHttp.do(
            'p',
            'getMeets',
            function(data, status)
            {
                $rootScope.r_mainInfo.meets = data.ppData;
                //清理$rootScope.meetTargetUpdated
                $rootScope.r_meetTargetUpdated = {};
            }
        ).finally(
            function() {
                $scope.$broadcast('scroll.refreshComplete');
                //$scope.$apply();
            }
        );
    };

    $scope.createMeet = function(){
        $rootScope.r_curMeet = null;
        $http.get($rootScope.serverRoot + "existInfo?username=" + $rootScope.r_user.username).
            success(function(data, status, headers, config) {
                if (data.result == 'yes')
                {
                    $rootScope.r_searchMode = '发起';
                    $rootScope.r_meetCondition = {
                        meetId: null,
                        mapLoc: {
                            uid: '',
                            name: '',
                            address: ''
                        },
                        specialInfo: {
                            sex : '',
                            clothesColor : '',
                            clothesStyle : '',
                            clothesType : '',
                            glasses : '',
                            hair : ''
                        }
                    };
                    $state.go('tab.meet.condition');
                }
                else
                {
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                if (status == 0)
                {
                    $rootScope.r_showPopup('网络不给力哦!'+ "(" + status + ")");
                }
                else
                {
                    if (data.result == '请先完善特征信息!')
                    {
                        $rootScope.r_showPopup(data.result + "(" + status + ")");
                        $scope.enterInfo();
                    }
                    else
                    {
                        $rootScope.r_showPopup(data.result + "(" + status + ")");
                    }
                }
            });
    }

    $scope.enterInfo = function(){
        $http.get($rootScope.serverRoot + "getInfo?username=" + $rootScope.r_user.username).
            success(function(data, status, headers, config) {
                $rootScope.r_myInfo = data.result;
                if ($rootScope.myInfo.specialPic)
                {
                    $rootScope.r_myInfo.specialPicDisplay = $rootScope.r_serverRoot + "images/normal/" + $rootScope.r_myInfo.specialPic;
                }

                $state.go('tab.meet.info');
            }).
            error($rootScope.ppError);
    }

    $ionicModal.fromTemplateUrl(
        'templates/meetDetail.html',
        function($ionicModal) {
            $scope.modal = $ionicModal;
        },
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.clickMeet = function(meet){
        if (meet.status=='待确认')
        {
            ppCopyObj(meet, $rootScope.r_meetCondition);
            $rootScope.r_curMeet = meet;
            $rootScope.r_searchMode = '确认';

            if ($rootScope.meetTargetUpdated[meet._id])
            {
                $http.post(
                    $rootScope.r_serverRoot + 'searchTargets',
                    {
                        username: $rootScope.r_user.username,
                        meetCondition: $rootScope.r_meetCondition,
                        meetId: $rootScope.r_curMeet ? $rootScope.r_curMeet._id : null,
                        searchMode: $rootScope.r_searchMode,
                        sendLoc: {
                            lng: $rootScope.r_latestLocation.lng,
                            lat: $rootScope.r_latestLocation.lat
                        }
                    }
                )
                    .success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $rootScope.r_targets = data.result;
                        $state.go('tab.meet.condition.specialPic');
                    }).
                    error($rootScope.ppError);
            }
            else
            {
                $state.go('tab.meet.condition');
            }
        }
        else if (meet.status == '待回复')
        {
            if (meet.target.username == $rootScope.r_user.username)
            {
                $rootScope.r_searchMode = '回复';
                $rootScope.r_meetCondition = {
                    mapLoc: meet.mapLoc,
                    specialInfo: {
                        sex : '',
                        clothesColor : '',
                        clothesStyle : '',
                        clothesType : '',
                        glasses : '',
                        hair : ''
                    }
                };
                $rootScope.r_curMeet = meet;
                $state.go('tab.meet.condition');
            }
            else if (meet.creater.username == $rootScope.r_user.username)
            {
                $rootScope.r_curMeet = meet;
                $scope.modal.show();
            }
        }
    }
});

app.factory('PPHttp', function ($rootScope, $http, $cordovaToast) {
    var handleSuccess = function (data, status) {
        console.log(data);
    };

    var handleErr = function (data, status, headers, config) {
        console.log(data);
        console.log(status);
        $cordovaToast
            .show(data.ppMsg + '(' + status + ')', 'long', 'center')
            .then(function (success) {
                // success
            }, function (error) {
                // error
            });
    };

    return {
        do: function (methord, path, paramObj, success, err) {
            var s = success || handleSuccess;
            var e = err || handleErr;
            var p = paramObj || {};

            switch(methord) {
                case 'g':
                    return $http.get($rootScope.serverRoot + "users/" + path, p)
                        .success(s)
                        .error(e);
                    break;
                case 'p':
                    return $http.post($rootScope.serverRoot + "users/" + path, p)
                        .success(s)
                        .error(e);
                    break;
                default:
                    return $http.post($rootScope.serverRoot + "users/" + path, p)
                        .success(s)
                        .error(e);
            }
        }
    };
});
