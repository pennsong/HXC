// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'angularMoment'])

    .run(function ($ionicPlatform, $cordovaDevice, $cordovaKeyboard, $cordovaToast, $rootScope, PPHttp) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            //$rootScope.r_serverRoot = "http://192.168.43.30:3000/";
            $rootScope.r_serverRoot = "https://pphx.herokuapp.com/";
            //$rootScope.r_serverRoot = "http://192.168.77.158:5000/";
            $rootScope.r_infoNeedUpdateTime = 0;

            $rootScope.r_curMeet = null;

            $rootScope.r_curChatFriendUsername = null;
            $rootScope.r_curChatFriendNickname = null;
            $rootScope.r_curChatMsg = null;

            $rootScope.r_searchMode = null;

            $rootScope.r_curOptions = [];
            $rootScope.r_curOptionName = null;

            $rootScope.r_mainInfo = null;

            $rootScope.r_imagePath = $rootScope.r_serverRoot + 'images/';
            $rootScope.r_sysImagePath = $rootScope.r_serverRoot + 'images/system/';

            $rootScope.r_curOptions = [];
            $rootScope.r_curOptionName = null;

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

            $rootScope.r_oldSpecial = {};

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


            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }

            window.navigator.geolocation.getCurrentPosition(function (location) {
                //console.log('Location from Phonegap');
            });

            $rootScope.r_bgGeo = window.plugins.backgroundGeoLocation;

            var yourAjaxCallback = function (location) {
                //alert('1[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
                ////
                // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
                //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                //
                //
                //console.log('===============');
                //console.log(location);
                PPHttp.do(
                    'p',
                    'updateLocation', {
                        lng: location.longitude,
                        lat: location.latitude,
                        token: $rootScope.r_mainInfo.token
                    },
                    //success
                    function (data, status) {
                        $rootScope.r_mainInfo.user.lastLocation = data.ppData.lastLocation;
                        $rootScope.r_mainInfo.user.lastLocationTime = data.ppData.lastLocationTime;
                        $cordovaToast.showShortCenter($rootScope.r_mainInfo.user.lastLocation[0] + "," + $rootScope.r_mainInfo.user.lastLocation[1]);
                        //console.log(data.ppData);
                    }
                )
                    .finally(
                    function () {
                        $rootScope.r_bgGeo.finish();
                    }
                );
            };


            var callbackFn = function (location) {
                //console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
                //$rootScope.r_lastLocation = {
                //    lng: location.longitude,
                //    lat: location.latitude
                //};

                //console.log(location);
                //$cordovaToast.showShortCenter('a:' + '[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
                // Do your HTTP request here to POST location to your server.
                //
                //
                //alert('2[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
                $cordovaToast.showShortCenter('callback');
                //console.log('---------------------------');
                //console.log(location);
                yourAjaxCallback.call(this, location);
            };

            var failureFn = function (error) {
                $cordovaToast.showShortCenter(error);
                //console.log(error);
                //$cordovaToast.showShortCenter('e:' + error);
                //alert('BackgroundGeoLocation error');
            }

            $rootScope.r_bgGeo.configure(callbackFn, failureFn, {
                //url: $rootScope.r_serverRoot + "users/updateLocation", // <-- Android ONLY:  your server url to send locations to
                //url: "http://192.168.1.15:3000/users/updateLocation",
                //params: {
                //    //auth_token: 'user_secret_auth_token',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                //    //foo: 'bar'                              //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                //    token: $rootScope.r_mainInfo.token
                //},
                // 			headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
                // 				"X-Foo": "BAR"
                // 			},
                desiredAccuracy: 5,
                stationaryRadius: 5,
                distanceFilter: 5,
                notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
                notificationText: 'ENABLED', // <-- android only, customize the text of the notification
                activityType: 'AutomotiveNavigation',
                debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
                stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
            });
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
            })
            .state('tab.meet.detail', {
                url: '/detail/{meetId}',
                views: {
                    'meet@tab': {
                        templateUrl: 'templates/meetDetail.html',
                        controller: 'meetDetailCtrl'
                    }
                }
            });
    });

app.controller('loginCtrl', function ($scope, $rootScope, $state, $cordovaToast, $ionicScrollDelegate, PPHttp, Push) {
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
            'p',
            'login', {
                username: user.username,
                password: user.password,
                cid: 't1' //$cordovaDevice.getUUID()
            },
            //success
            function (data, status) {
                //jpush
                document.addEventListener("jpush.setTagsWithAlias", function(event){
                    try{
                        var result="result code:"+event.resultCode+" ";
                        result+="tags:"+event.tags+" ";
                        result+="alias:"+event.alias+" ";
                        console.log("onTagsWithAlias" + result);
                        if (event.resultCode != 0)
                        {
                            $cordovaToast.showShortCenter('联系通知服务器未成功,您现在收不到推送通知,正在重试用中...');
                            Push.setAlias($rootScope.r_mainInfo.user.username);
                        }
                        else
                        {
                            $cordovaToast.showShortCenter('联系通知服务器成功!');
                        }
                    }
                    catch(exception){
                        console.log(exception)
                    }
                }, false);

                document.addEventListener("jpush.receiveNotification", function (event) {
                    $cordovaToast.showShortCenter(event.aps.alert);
                    console.log("jpush.receiveNotification");
                    //分析alert内容
                    var alertContent = event.aps.alert;
                    var commaIndex = alertContent.indexOf(',');
                    var colonIndex = alertContent.indexOf(':');
                    if (commaIndex > -1 && colonIndex > -1) {
                        //收到朋友消息提醒
                        var friendUsername = alertContent.substring(0, commaIndex);

                        if ($rootScope.r_curChatFriendUsername == friendUsername) {
                            //在对话中
                            PPHttp.do(
                                'p',
                                'getMsg', {
                                    token: $rootScope.r_mainInfo.token,
                                    friendUsername: friendUsername
                                },
                                function (data, status) {
                                    $rootScope.r_curChatMsg = data.ppData;
                                    $ionicScrollDelegate.scrollBottom(true);
                                }
                            );
                        } else {
                            //不在对话中
                            PPHttp.do(
                                'p',
                                'getFriendUnreadCount', {
                                    token: $rootScope.r_mainInfo.token,
                                    friendUsername: friendUsername
                                },
                                //success
                                function (data, status) {
                                    $rootScope.r_mainInfo.unreadMsgCounts[friendUsername] = data.ppData;
                                }
                            );
                        }
                    } else {
                        PPHttp.doRefreshAll();
                    }
                }, false);

                document.addEventListener("jpush.openNotification", function (event) {
                    $cordovaToast.showShortCenter(event.aps.alert);
                    console.log("jpush.openNotification");
                    //分析alert内容
                    var alertContent = event.aps.alert;
                    var commaIndex = alertContent.indexOf(',');
                    var colonIndex = alertContent.indexOf(':');
                    if (commaIndex > -1 && colonIndex > -1) {
                        //收到朋友消息提醒
                        var friendUsername = alertContent.substring(0, commaIndex);

                        if ($rootScope.r_curChatFriendUsername == friendUsername) {
                            //在对话中
                            PPHttp.do(
                                'p',
                                'getMsg', {
                                    token: $rootScope.r_mainInfo.token,
                                    friendUsername: friendUsername
                                },
                                function (data, status) {
                                    $rootScope.r_curChatMsg = data.ppData;
                                    $ionicScrollDelegate.scrollBottom(true);
                                }
                            );
                        } else {
                            //不在对话中
                            PPHttp.do(
                                'p',
                                'getFriendUnreadCount', {
                                    token: $rootScope.r_mainInfo.token,
                                    friendUsername: friendUsername
                                },
                                //success
                                function (data, status) {
                                    $rootScope.r_mainInfo.unreadMsgCounts[friendUsername] = data.ppData;
                                }
                            );
                        }
                    } else {
                        PPHttp.doRefreshAll();
                    }
                }, false);

                //// push notification callback
                //var notificationCallback = function(data) {
                //    console.log('pp received data :' + data);
                //    var notification = angular.fromJson(data);
                //    console.log(notification);
                //    //app 是否处于正在运行状态
                //    var isActive = notification.isActive;
                //
                //    // here add your code
                //
                //    //ios
                //    if (ionic.Platform.isIOS()) {
                //        $cordovaToast.showShortCenter(notification.aps.alert);
                //    } else {
                //        //非 ios(android)
                //    }
                //};

                Push.init();
                Push.setAlias(data.ppData.user.username);

                $rootScope.r_bgGeo.start();
                $cordovaToast.showShortCenter("ppstart");

                $rootScope.r_mainInfo = data.ppData;
                //console.log(data.ppData);
                window.localStorage['username'] = data.ppData.user.username;
                window.localStorage['nickname'] = data.ppData.user.nickname;
                window.localStorage['token'] = data.ppData.token;
                PPHttp.doRefreshAll();
                $state.go("tab.meet");
            }
        );
    }

});

app.controller('registerCtrl', function ($scope, $rootScope, $state, PPHttp, $cordovaToast) {
    $rootScope.r_newUser = {
        username: null,
        password: null,
        sex: null,
        nickname: null,
        cid: null
    }

    $scope.register = function (newUser) {
        newUser.cid = 't2'; //$cordovaDevice.getUUID();
        if (!(newUser.username && newUser.password && newUser.sex && newUser.nickname && newUser.cid)) {
            $cordovaToast.showShortCenter('用户名, 密码, 性别, 昵称都不能为空!');
            return;
        }

        PPHttp.do(
            'p',
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

app.controller('meetCtrl', function ($scope, $rootScope, $state, $ionicModal, $ionicLoading, PPHttp) {
    $ionicModal.fromTemplateUrl(
        'templates/meetDetail.html',
        function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.unread = function (meet) {
        if (
            (meet.creater.username == $rootScope.r_mainInfo.user.username && meet.creater.unread == true) ||
            (meet.target && meet.target.username == $rootScope.r_mainInfo.user.username && meet.target.unread == true)
        ) {
            return true;
        } else {
            return false;
        }
    };

    $scope.readMeet = function (meet) {
        if (meet.creater.username == $rootScope.r_mainInfo.user.username && meet.creater.unread == true) {
            meet.creater.unread = false;
            PPHttp.do(
                'p',
                'readMeet', {
                    token: $rootScope.r_mainInfo.token,
                    meetId: meet._id
                }
            );
        } else if (meet.target && meet.target.username == $rootScope.r_mainInfo.user.username && meet.target.unread == true) {
            meet.target.unread = false;
            PPHttp.do(
                'p',
                'readMeet', {
                    token: $rootScope.r_mainInfo.token,
                    meetId: meet._id
                }
            );
        }
    };

    $scope.clickMeet = function (meet) {
        $scope.readMeet(meet);
        if (meet.status == '待确认') {
            $rootScope.r_meetCondition = {
                mapLoc: meet.mapLoc,
                specialInfo: meet.specialInfo
            };

            $rootScope.r_curMeet = meet;
            $rootScope.r_searchMode = '确认';

            //if (!($rootScope.r_meetTargetUpdated[meet._id])) //test
            //if ($rootScope.r_meetTargetUpdated[meet._id])
            //{
            //    PPHttp.do(
            //        'p',
            //        'confirmMeetSearchTarget', {
            //            token: $rootScope.r_mainInfo.token,
            //            meetId: meet._id
            //        },
            //        //success
            //        function (data, status) {
            //            $rootScope.r_targets = data.ppData;
            //            $state.go('tab.meet.condition.specialPic');
            //        }
            //    );
            //}
            //else
            //{
            $state.go('tab.meet.condition');
            //}
        } else if (meet.status == '待回复') {
            if (meet.target.username == $rootScope.r_mainInfo.user.username) {
                $rootScope.r_searchMode = '回复';
                $rootScope.r_meetCondition = {
                    mapLoc: meet.mapLoc,
                    specialInfo: {
                        sex: null,
                        clothesColor: null,
                        clothesStyle: null,
                        clothesType: null,
                        glasses: null,
                        hair: null
                    }
                };
                $rootScope.r_curMeet = meet;
                $state.go('tab.meet.condition');
            } else if (meet.creater.username == $rootScope.r_mainInfo.user.username) {
                $rootScope.r_curMeet = meet;
                //console.log(meet);
                $scope.modal.show();
            }
        }
    }

    $scope.doRefresh = function () {
        PPHttp
            .doRefreshAll()
            .finally(
            function () {
                $scope.$broadcast('scroll.refreshComplete');
                //$scope.$apply();
            }
        );
    };

    $scope.createMeet = function () {
        $rootScope.r_curMeet = null;
        $ionicLoading.show({
            template: 'Loading...'
        });
        PPHttp.do(
            'p',
            'sendMeetCheck', {
                token: $rootScope.r_mainInfo.token
            },
            function (data, status) {
                if (data.ppResult == 'ok') {
                    $rootScope.r_searchMode = '新建';
                    $rootScope.r_meetCondition = {
                        mapLoc: {
                            uid: null,
                            name: null,
                            address: null
                        },
                        specialInfo: {
                            sex: null,
                            clothesColor: null,
                            clothesStyle: null,
                            clothesType: null,
                            glasses: null,
                            hair: null
                        }
                    };
                    $state.go('tab.meet.condition');
                }
            }
        )
            .finally(
            function () {
                $ionicLoading.hide();
            }
        );
    };

    $scope.enterInfo = function () {
        if (!($rootScope.r_mainInfo.user.specialInfoTime &&
            moment($rootScope.r_mainInfo.user.specialInfoTime)
                .startOf('day')
                .isBefore(moment($rootScope.r_mainInfo.user.specialInfoTime))
            )) {
            //console.log($rootScope.r_mainInfo.user.specialInfoTime);
            //console.log(moment().startOf('day').add(4, 'hours').isBefore($rootScope.r_mainInfo.user.specialInfoTime));

            $rootScope.r_mainInfo.user.specialInfo.hair = null;
            $rootScope.r_mainInfo.user.specialInfo.glasses = null;
            $rootScope.r_mainInfo.user.specialInfo.clothesType = null;
            $rootScope.r_mainInfo.user.specialInfo.clothesColor = null;
            $rootScope.r_mainInfo.user.specialInfo.clothesStyle = null;
            $rootScope.r_mainInfo.user.specialPic = null;
        } else {
            $rootScope.r_oldSpecial = {
                hair : $rootScope.r_mainInfo.user.specialInfo.hair,
                glasses : $rootScope.r_mainInfo.user.specialInfo.glasses,
                clothesType : $rootScope.r_mainInfo.user.specialInfo.clothesType,
                clothesColor : $rootScope.r_mainInfo.user.specialInfo.clothesColor,
                clothesStyle : $rootScope.r_mainInfo.user.specialInfo.clothesStyle,
                specialPic : $rootScope.r_mainInfo.user.specialPic
            };

        }
        //console.log($rootScope.r_mainInfo);
        $state.go('tab.meet.info');
    };
});

app.controller('meetConditionCtrl', function ($scope, $rootScope, $state, $ionicModal, $timeout, $http, $cordovaToast, $ionicLoading, PPHttp) {
    $scope.bLng = null;
    $scope.bLat = null;

    $scope.searchTargets = function () {
        if (!(
            $rootScope.r_meetCondition.specialInfo.sex && $rootScope.r_meetCondition.specialInfo.clothesColor && $rootScope.r_meetCondition.specialInfo.clothesStyle && $rootScope.r_meetCondition.specialInfo.clothesType && $rootScope.r_meetCondition.specialInfo.glasses && $rootScope.r_meetCondition.specialInfo.hair && $rootScope.r_meetCondition.mapLoc.uid
            )) {
            $cordovaToast.showShortCenter('请把条件填写完整');
            return;
        }
        if (!($rootScope.r_mainInfo.user.lastLocation[0] && $rootScope.r_mainInfo.user.lastLocation[1])) {
            $cordovaToast.showShortCenter('未能获取您的当前位置,请调整位置后重试');
            return;
        }
        $ionicLoading.show({
            template: '努力搜索中...'
        });
        if ($rootScope.r_searchMode == '回复') {
            PPHttp.do(
                'p',
                'replyMeetSearchTarget', {
                    token: $rootScope.r_mainInfo.token,
                    sex: $rootScope.r_meetCondition.specialInfo.sex,
                    hair: $rootScope.r_meetCondition.specialInfo.hair,
                    glasses: $rootScope.r_meetCondition.specialInfo.glasses,
                    clothesType: $rootScope.r_meetCondition.specialInfo.clothesType,
                    clothesColor: $rootScope.r_meetCondition.specialInfo.clothesColor,
                    clothesStyle: $rootScope.r_meetCondition.specialInfo.clothesStyle,
                    meetId: $rootScope.r_curMeet._id
                },
                function (data, status) {
                    if (data.ppResult == 'ok') {
                        if (!data.ppData) {
                            //特征信息不匹配
                            $cordovaToast.showShortCenter(data.ppMsg);
                        } else {
                            $rootScope.r_targets = data.ppData;
                            $state.go('tab.meet.condition.specialPic');
                        }
                    }
                }
            )
                .finally(
                function () {
                    $ionicLoading.hide();
                }
            );
        } else {
            PPHttp.do(
                'p',
                'createMeetSearchTarget', {
                    token: $rootScope.r_mainInfo.token,
                    sex: $rootScope.r_meetCondition.specialInfo.sex,
                    hair: $rootScope.r_meetCondition.specialInfo.hair,
                    glasses: $rootScope.r_meetCondition.specialInfo.glasses,
                    clothesType: $rootScope.r_meetCondition.specialInfo.clothesType,
                    clothesColor: $rootScope.r_meetCondition.specialInfo.clothesColor,
                    clothesStyle: $rootScope.r_meetCondition.specialInfo.clothesStyle
                },
                function (data, status) {
                    if (data.ppResult == 'ok') {
                        $rootScope.r_targets = data.ppData;
                        $state.go('tab.meet.condition.specialPic');
                    }
                }
            )
                .finally(
                function () {
                    $ionicLoading.hide();
                }
            );
        }
    };

    $ionicModal.fromTemplateUrl(
        'templates/option.html',
        function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.changeKeyword = function (keyword) {
        if ($scope.timer) {
            clearInterval($scope.timer);
        }
        $scope.timer = setInterval(function () {
            if ($scope.timer) {
                clearInterval($scope.timer);
            }
            $scope.searchLoc(keyword);
        }, 300);
    };

    $scope.searchLoc = function (keyword) {
        var ak = "F9266a6c6607e33fb7c3d8da0637ce0b";
        var output = "json";
        var radius = "2000";
        var scope = "1";
        var data = "query=" + encodeURIComponent(keyword);
        data += "&ak=" + ak;
        data += "&output=" + output;
        data += "&radius=" + radius;
        data += "&scope=" + scope;
        data += "&location=" + $scope.bLat + "," + $scope.bLng;
        data += "&filter=sort_name:distance";

        $http.jsonp("http://api.map.baidu.com/place/v2/search?callback=JSON_CALLBACK&" + data)
            .
            success(function (data, status, headers, config) {
                //查询结果
                $rootScope.r_curOptions = data.results;
            })
            .error(function (err) {
                console.log(err);
                $cordovaToast.showShortCenter(err);
            });
    };

    $scope.clickInfoItem = function (item) {
        if ($rootScope.r_searchMode == '确认') {
            //确认meet时条件不可调整
            return;
        }
        if (item == '地点') {
            if ($rootScope.r_searchMode == '回复') {
                //回复meet时地点不可调整
                return;
            }
            $rootScope.r_curOptions = [];
            if (!($rootScope.r_mainInfo.user.lastLocation[0] && $rootScope.r_mainInfo.user.lastLocation[1])) {
                console.log('未能获取您的当前位置,请调整位置后重试!');
                $cordovaToast.showShortCenter('未能获取您的当前位置,请调整位置后重试!');
                return;
            }
            $http.jsonp("http://api.map.baidu.com/geoconv/v1/?callback=JSON_CALLBACK&ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $rootScope.r_mainInfo.user.lastLocation[0] + "," + $rootScope.r_mainInfo.user.lastLocation[1])
                .
                success(function (data, status, headers, config) {
                    //转换为百度坐标
                    $scope.bLng = data.result[0].x;
                    $scope.bLat = data.result[0].y;
                    $rootScope.r_curOptionName = item;

                    $scope.modal.show();
                })
                .error(function (err) {
                    console.log(err);
                    $cordovaToast.showShortCenter(err);
                });
            return;
        }

        switch (item) {
            case "性别":
                $rootScope.r_curOptions = $rootScope.r_sex;
                break;
            case "发型":
                $rootScope.r_curOptions = $rootScope.r_hair;
                break;
            case "眼镜":
                $rootScope.r_curOptions = $rootScope.r_glasses;
                break;
            case "衣服类型":
                $rootScope.r_curOptions = $rootScope.r_clothesType;
                break;
            case "衣服颜色":
                $rootScope.r_curOptions = $rootScope.r_clothesColor;
                break;
            case "衣服花纹":
                $rootScope.r_curOptions = $rootScope.r_clothesStyle;
                break;
            default:
        }
        $rootScope.r_curOptionName = item;
        $scope.modal.show();
    };

    $scope.clickItem = function (item) {
        switch ($rootScope.r_curOptionName) {
            case "地点":
                $rootScope.r_meetCondition.mapLoc = item;
                break;
            case "性别":
                $rootScope.r_meetCondition.specialInfo.sex = item;
                break;
            case "发型":
                $rootScope.r_meetCondition.specialInfo.hair = item;
                break;
            case "眼镜":
                $rootScope.r_meetCondition.specialInfo.glasses = item;
                break;
            case "衣服类型":
                $rootScope.r_meetCondition.specialInfo.clothesType = item;
                break;
            case "衣服颜色":
                $rootScope.r_meetCondition.specialInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $rootScope.r_meetCondition.specialInfo.clothesStyle = item;
                break;
            default:

        }
        $scope.modal.hide();
    }
});

app.controller('meetInfoCtrl', function ($scope, $rootScope, $state, $ionicModal, $cordovaCamera, PPHttp, $cordovaToast, $cordovaFileTransfer, $ionicLoading) {
    $scope.myGoBack = function () {
        if (!(
            $rootScope.r_mainInfo.user.specialInfo.clothesColor && $rootScope.r_mainInfo.user.specialInfo.clothesStyle && $rootScope.r_mainInfo.user.specialInfo.clothesType && $rootScope.r_mainInfo.user.specialInfo.glasses && $rootScope.r_mainInfo.user.specialInfo.hair && $rootScope.r_mainInfo.user.specialPic
            )) {
            console.log('请填写完整!');
            $cordovaToast.showShortCenter('请填写完整!');
            return;
        }
        //if unchanged, just go back
        if (
            $rootScope.r_oldSpecial.hair == $rootScope.r_mainInfo.user.specialInfo.hair &&
            $rootScope.r_oldSpecial.glasses == $rootScope.r_mainInfo.user.specialInfo.glasses &&
            $rootScope.r_oldSpecial.clothesType == $rootScope.r_mainInfo.user.specialInfo.clothesType &&
            $rootScope.r_oldSpecial.clothesColor == $rootScope.r_mainInfo.user.specialInfo.clothesColor &&
            $rootScope.r_oldSpecial.clothesStyle == $rootScope.r_mainInfo.user.specialInfo.clothesStyle &&
            $rootScope.r_oldSpecial.specialPic == $rootScope.r_mainInfo.user.specialPic
        ) {
            $state.go('tab.meet');
            return;
        }
        //update info

        $ionicLoading.show({
            template: '上传中...'
        });
        PPHttp.do(
            'p',
            'updateSpecialInfo', {
                token: $rootScope.r_mainInfo.token,
                hair: $rootScope.r_mainInfo.user.specialInfo.hair,
                glasses: $rootScope.r_mainInfo.user.specialInfo.glasses,
                clothesType: $rootScope.r_mainInfo.user.specialInfo.clothesType,
                clothesColor: $rootScope.r_mainInfo.user.specialInfo.clothesColor,
                clothesStyle: $rootScope.r_mainInfo.user.specialInfo.clothesStyle,
                specialPic: $rootScope.r_mainInfo.user.specialPic
            },
            function (data, status) {
                if (data.ppResult == 'ok') {
                    $rootScope.r_mainInfo.user.specialInfoTime = data.ppData;
                    $state.go('tab.meet');
                }
            }
        )
            .finally(
            function () {
                $ionicLoading.hide();
            }
        );
    };

    $ionicModal.fromTemplateUrl(
        'templates/option.html',
        function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.clickInfoItem = function (item) {
        switch (item) {
            case "发型":
                $rootScope.r_curOptions = $rootScope.r_hair;
                break;
            case "眼镜":
                $rootScope.r_curOptions = $rootScope.r_glasses;
                break;
            case "衣服类型":
                $rootScope.r_curOptions = $rootScope.r_clothesType;
                break;
            case "衣服颜色":
                $rootScope.r_curOptions = $rootScope.r_clothesColor;
                break;
            case "衣服花纹":
                $rootScope.r_curOptions = $rootScope.r_clothesStyle;
                break;
            default:
        }
        $rootScope.r_curOptionName = item;
        $scope.modal.show();
    };

    $scope.clickItem = function (item) {
        switch ($rootScope.r_curOptionName) {
            case "发型":
                $rootScope.r_mainInfo.user.specialInfo.hair = item;
                break;
            case "眼镜":
                $rootScope.r_mainInfo.user.specialInfo.glasses = item;
                break;
            case "衣服类型":
                $rootScope.r_mainInfo.user.specialInfo.clothesType = item;
                break;
            case "衣服颜色":
                $rootScope.r_mainInfo.user.specialInfo.clothesColor = item;
                break;
            case "衣服花纹":
                $rootScope.r_mainInfo.user.specialInfo.clothesStyle = item;
                break;
            default:

        }
        $scope.modal.hide();
    };

    $scope.takePhoto = function () {
        try {
            var options = {
                quality: 30,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };

            $cordovaCamera.getPicture(options)
                .then(function (fileURL) {
                    //$rootScope.r_mainInfo.user.specialPicDisplay = fileURL;

                    var params = new Object();
                    params.token = $rootScope.r_mainInfo.token;

                    var options = {
                        fileKey: "specialPic",
                        fileName: "image.png",
                        chunkedMode: false,
                        mimeType: "image/png",
                        params: params
                    };

                    $cordovaFileTransfer.upload($rootScope.r_serverRoot + 'users/uploadSpecialPic', fileURL, options, true)
                        .then(function (result) {
                            $rootScope.r_mainInfo.user.specialPic = (JSON.parse(result.response))["ppResult"];
                            $rootScope.r_mainInfo.user.specialPicDisplay = $rootScope.r_mainInfo.user.specialPic;
                            //console.log($rootScope.r_mainInfo.user.specialPic);
                        }, function (err) {
                            console.log(err);
                            $cordovaToast.showShortCenter(err);
                        }, function (progress) {
                            // constant progress updates
                        });
                }, function (err) {
                    // error
                    console.log(err);
                    $cordovaToast.showShortCenter(err);
                    $rootScope.r_mainInfo.user.specialPic = "tbd.jpeg";
                    $rootScope.r_mainInfo.user.specialPicDisplay = $rootScope.r_mainInfo.user.specialPic;
                });
        } catch (err) {
            console.log(err);
            $cordovaToast.showShortCenter(err);
        }
    }

});

app.controller('profileCtrl', function ($scope, $rootScope, $state, $ionicHistory, $timeout, $ionicLoading, $http, $cordovaToast, $cordovaGeolocation, PPHttp, Push) {
    $scope.test = function(){

    };

    $scope.getCurMapPosition = function () {
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                console.log(position);
                PPHttp.do(
                    'p',
                    'updateLocation', {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude,
                        token: $rootScope.r_mainInfo.token
                    },
                    //success
                    function (data, status) {
                        $rootScope.r_mainInfo.user.lastLocation = data.ppData.lastLocation;
                        $rootScope.r_mainInfo.user.lastLocationTime = data.ppData.lastLocationTime;
                        $scope.lastLocation = data.ppData.lastLocation;
                        $scope.lastLocationTime = data.ppData.lastLocationTime;
                        $http.jsonp("http://api.map.baidu.com/geoconv/v1/?callback=JSON_CALLBACK&ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $scope.lastLocation[0] + "," + $scope.lastLocation[1])
                            .
                            success(function (data, status, headers, config) {
                                //转换为百度坐标
                                if (data.status == 0) {
                                    $scope.bLng = data.result[0].x;
                                    $scope.bLat = data.result[0].y;
                                } else {
                                    console.log(data.message);
                                    $cordovaToast.showShortCenter(data.message);
                                }
                            })
                            .
                            error(function (err) {
                                console.log(err);
                                $cordovaToast.showShortCenter(err);
                            });
                    }
                );
            }, function(err) {
                $cordovaToast.showShortCenter(err);
            });
    }

    $scope.mapLocs = [];

    $scope.logout = function () {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });

        $ionicLoading.show({
            template: '退出中...'
        });

        //取消jpush alias
        Push.setAlias("");

        $state.go('login');
        $timeout(function () {
            window.location.reload();
            $ionicLoading.hide();
            //暂停位置追踪
            $rootScope.r_bgGeo.stop();
        }, 300);

    }
});

app.controller('conditionSpecialCtrl', function ($scope, $rootScope, $state, $ionicModal, $ionicHistory, $ionicLoading, $cordovaToast, PPHttp) {
    $ionicModal.fromTemplateUrl(
        'templates/bigSpecialPic.html',
        function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        }
    );

    $scope.getBigPic = function (targetUsername, targetSpecialPic) {
        $scope.targetUsername = targetUsername;
        $scope.targetSpecialPic = targetSpecialPic;
        $scope.modal.show();
    }

    $scope.yes = function (targetUsername) {
        if ($rootScope.r_searchMode == '回复') {
            if (targetUsername == 'fake') {
                PPHttp.do(
                    'p',
                    'createOrConfirmClickFake', {
                        token: $rootScope.r_mainInfo.token
                    },
                    //success
                    function (data, status) {
                        $cordovaToast.showShortCenter('没猜对,请仔细选择图片!');
                    }
                );
            } else {
                PPHttp.do(
                    'p',
                    'replyMeetClickTarget', {
                        token: $rootScope.r_mainInfo.token,
                        username: targetUsername,
                        meetId: $rootScope.r_curMeet._id
                    },
                    //success
                    function (data, status) {
                        PPHttp.doRefreshAll();
                        $cordovaToast.showShortCenter('恭喜你!已加入好友列表,赶紧行动吧!');
                    }
                );
            }
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go('tab.meet');
            $scope.modal.hide();

        }
        //searchMode == '新建' || '确认'
        else {
            if (targetUsername == 'fake') {
                $http.put(
                    $rootScope.serverRoot + 'fakeSelect', {
                        username: $rootScope.user.username
                    }
                )
                    .success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $rootScope.showPopup('请仔细选择图片!');
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true,
                            historyRoot: true
                        });
                        $state.go('tab.meet');
                        $scope.modal.hide();
                    })
                    .
                    error($rootScope.ppError);
            } else {
                $ionicLoading.show({
                    template: '处理中...'
                });
                if ($rootScope.r_searchMode == '确认') {
                    PPHttp.do(
                        'p',
                        'confirmMeetClickTarget', {
                            token: $rootScope.r_mainInfo.token,
                            username: targetUsername,
                            meetId: $rootScope.r_curMeet._id
                        },
                        //success
                        function (data, status) {
                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true,
                                historyRoot: true
                            });
                            $state.go('tab.meet');
                            $scope.modal.hide();
                        }
                    )
                        .finally(
                        function () {
                            $ionicLoading.hide();
                        }
                    );
                } else if ($rootScope.r_searchMode == '新建') {
                    console.log($rootScope.r_meetCondition.mapLoc);
                    PPHttp.do(
                        'p',
                        'createMeetClickTarget', {
                            token: $rootScope.r_mainInfo.token,
                            username: targetUsername,
                            mapLocName: $rootScope.r_meetCondition.mapLoc.name,
                            mapLocUid: $rootScope.r_meetCondition.mapLoc.uid,
                            mapLocAddress: $rootScope.r_meetCondition.mapLoc.address
                        },
                        //success
                        function (data, status) {
                            PPHttp.doRefreshAll();
                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true,
                                historyRoot: true
                            });
                            $state.go('tab.meet');
                            $scope.modal.hide();
                        }
                    )
                        .finally(
                        function () {
                            $ionicLoading.hide();
                        }
                    );
                }
            }
        }
    }

    $scope.no = function () {
        if ($rootScope.r_searchMode == '回复' || $rootScope.r_searchMode == '确认') {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });
            $state.go('tab.meet');
            $scope.modal.hide();
        } else {
            $ionicLoading.show({
                template: '处理中...'
            });
            PPHttp.do(
                'p',
                'createMeetNo', {
                    token: $rootScope.r_mainInfo.token,
                    mapLocName: $rootScope.r_meetCondition.mapLoc.name,
                    mapLocUid: $rootScope.r_meetCondition.mapLoc.uid,
                    mapLocAddress: $rootScope.r_meetCondition.mapLoc.address,
                    sex: $rootScope.r_meetCondition.specialInfo.sex,
                    hair: $rootScope.r_meetCondition.specialInfo.hair,
                    glasses: $rootScope.r_meetCondition.specialInfo.glasses,
                    clothesType: $rootScope.r_meetCondition.specialInfo.clothesType,
                    clothesColor: $rootScope.r_meetCondition.specialInfo.clothesColor,
                    clothesStyle: $rootScope.r_meetCondition.specialInfo.clothesStyle
                },
                //success
                function (data, status) {
                    PPHttp.doRefreshAll();
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true,
                        historyRoot: true
                    });
                    $state.go('tab.meet');
                    $scope.modal.hide();
                }
            )
                .finally(
                function () {
                    $ionicLoading.hide();
                }
            );
        }
    }

});

app.controller('contactCtrl', function ($scope, $rootScope, $state, $timeout, $ionicScrollDelegate, PPHttp) {
    $scope.clickChat = function (friend) {
        $scope.readFriend(friend);
        $rootScope.r_curChatFriendUsername = friend.friendUsername;
        $rootScope.r_curChatFriendNickname = friend.friendNickname;
        PPHttp.do(
            'p',
            'getMsg', {
                token: $rootScope.r_mainInfo.token,
                friendUsername: friend.friendUsername
            },
            function (data, status) {
                $rootScope.r_curChatMsg = data.ppData;
                $state.go('tab.contact.chat');
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true, true);
                }, 300);
            }
        );
    }

    $scope.readFriend = function (friend) {
        friend.unread = false;
        PPHttp.do(
            'p',
            'readFriend', {
                token: $rootScope.r_mainInfo.token,
                friendId: friend._id
            }
        );
    };

    $scope.doRefresh = function () {
        PPHttp
            .doRefreshAll()
            .finally(
            function () {
                $scope.$broadcast('scroll.refreshComplete');
                //$scope.$apply();
            }
        );
    };
});

app.controller('chatCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicScrollDelegate, PPHttp) {
    $scope.data = {};
    $scope.inputMessage = null;
    $scope.showTime = false;

    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.myGoBack = function () {
        PPHttp.do(
            'p',
            'readMsg', {
                token: $rootScope.r_mainInfo.token,
                friendUsername: $rootScope.r_curChatFriendUsername
            },
            function (data, status) {
                $rootScope.r_mainInfo.unreadMsgCounts[$rootScope.r_curChatFriendUsername] = 0;
            }
        )
            .finally(
            function () {
                $rootScope.r_curChatFriendUsername = null;
                $rootScope.r_curChatFriendNickname = null;
                $rootScope.r_curChatMsg = null;
                $state.go('tab.contact');
            }
        );
    };

    $scope.sendMessage = function () {
        if (!$scope.inputMessage) {
            return;
        }

        PPHttp.do(
            'p',
            'sendMsg', {
                token: $rootScope.r_mainInfo.token,
                friendUsername: $rootScope.r_curChatFriendUsername,
                content: $scope.inputMessage
            },
            function (data, status) {
                PPHttp.do(
                    'p',
                    'getMsg', {
                        token: $rootScope.r_mainInfo.token,
                        friendUsername: $rootScope.r_curChatFriendUsername
                    },
                    function (data, status) {
                        $rootScope.r_curChatMsg = data.ppData;
                        $scope.inputMessage = '';
                        $timeout(function () {
                            $ionicScrollDelegate.scrollBottom(true, true);
                        }, 300);
                    }
                );
            }
        );
    };


    $scope.inputUp = function () {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function () {
            $ionicScrollDelegate.scrollBottom(true, true);
        }, 300);
    };

    $scope.inputDown = function () {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.onSwipeRight = function () {
        $scope.showTime = false;
    };

    $scope.onSwipeLeft = function () {
        $scope.showTime = true;
    };

});

app.filter("objectIDtoDate", function () {
    return function (objectID) {
        moment.locale('zh-cn');
        return moment(new Date(parseInt(("" + objectID)
            .substr(0, 8), 16) * 1000));
    };
})

app.filter("stringToDate", function () {
    return function (dateString) {
        moment.locale('zh-cn');
        return moment(new Date(dateString));
    };
})

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

        if (data.ppMsg == "认证错误!") {
            //todo logout
        }
    };

    return {
        do: function (methord, path, paramObj, success, err) {
            var s = success || handleSuccess;
            var e = err || handleErr;
            var p = paramObj || {};
            switch (methord) {
                case 'g':
                    return $http.get($rootScope.r_serverRoot + "users/" + path, p)
                        .success(s)
                        .error(e);
                    break;
                case 'p':
                    return $http.post($rootScope.r_serverRoot + "users/" + path, p)
                        .success(s)
                        .error(e);
                    break;
                default:
                    return $http.post($rootScope.r_serverRoot + "users/" + path, p)
                        .success(s)
                        .error(e);
            }
        },
        doRefreshAll: function () {
            return $http.post($rootScope.r_serverRoot + "users/" + "getAll", {
                token: $rootScope.r_mainInfo.token
            })
                .success(
                function (data, status) {
                    $rootScope.r_mainInfo.meets = data.ppData.meets;
                    $rootScope.r_mainInfo.friends = data.ppData.friends.main;
                    $rootScope.r_mainInfo.friendPics = data.ppData.friends.pics;
                    $rootScope.r_mainInfo.unreadMsgCounts = data.ppData.friends.unreadMsgCounts;
                    console.log($rootScope.r_mainInfo);
                }
            )
                .error(handleErr);
        }
    };
});

app.factory('Push', function () {
    var push;

    return {
        setBadge: function (badge) {
            if (push) {
                console.log('jpush: set badge', badge);
                plugins.jPushPlugin.setBadge(badge);
            }
        },
        setAlias: function (alias) {
            if (push) {
                console.log('jpush: set alias', alias);
                plugins.jPushPlugin.setAlias(alias);
            }
        },
        init: function () {
            console.log('jpush: start init-----------------------');
            push = window.plugins && window.plugins.jPushPlugin;
            if (push) {
                console.log('jpush: init');
                plugins.jPushPlugin.init();
                plugins.jPushPlugin.setDebugMode(true);
                //plugins.jPushPlugin.openNotificationInAndroidCallback = notificationCallback;
                //plugins.jPushPlugin.receiveNotificationIniOSCallback = notificationCallback;
                //plugins.jPushPlugin.receiveMessageIniOSCallback = notificationCallback;
            }
        }
    };
});

// All this does is allow the message
// to be sent when you tap return
app.directive('input', function ($timeout, $ionicScrollDelegate) {
    return {
        restrict: 'E',
        scope: {
            'returnClose': '=',
            'onReturn': '&',
            'onFocus': '&',
            'onBlur': '&'
        },
        link: function (scope, element, attr) {
            element.bind('focus', function (e) {
                if (scope.onFocus) {
                    $timeout(function () {
                        scope.onFocus();
                    });
                }
            });
            element.bind('blur', function (e) {
                if (scope.onBlur) {
                    $timeout(function () {
                        scope.onBlur();
                    });
                }
            });
            element.bind('keydown', function (e) {
                if (e.which == 13) {
                    if (scope.returnClose) element[0].blur();
                    if (scope.onReturn) {
                        $timeout(function () {
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }
});
//app.factory('Unread', function() {
//    return {
//        do: function(oldArray, unreadArray) {
//            var oldIdArray = oldArray.map(function(item){
//                return item._id;
//            });
//            for (var i = 0; i < unreadArray.length; i++)
//            {
//                var tmpIndex = oldIdArray.indexOf(unreadArray[i]._id);
//                if (tmpIndex > -1)
//                {
//                    oldArray[tmpIndex] = unreadArray[i];
//                }
//                else
//                {
//                    oldArray.push(unreadArray[i]);
//                }
//            }
//        }
//    };
//});
