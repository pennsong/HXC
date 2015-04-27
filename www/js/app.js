function ppCopyObj(source, destination) {
    for (var property in destination) {
        if (typeof destination[property] === "object") {
            ppCopyObj(source[property], destination[property]);
        } else {
            destination[property] = source[property];
        }
    }
};
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'angularMoment'])

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
    $rootScope.r_infoNeedUpdateTime = 0;

    $rootScope.r_lastLocation = {
        lng: null,
        lat: null
    }

    $rootScope.r_curMeet = null;

    $rootScope.r_searchMode = null;

    $rootScope.r_curOptions = [];
    $rootScope.r_curOptionName = null;

    $rootScope.r_mainInfo = null;

    $rootScope.r_serverRoot = "http://192.168.1.15:3000/";
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

        PPHttp.do
        (
            'p',
            'login', {
                username: user.username,
                password: user.password,
                cid: 't1' //$cordovaDevice.getUUID()
            },
            //success
            function (data, status) {
                $rootScope.r_mainInfo = data.ppData;
                console.log($rootScope.r_mainInfo);
                window.localStorage['username'] = data.ppData.user.username;
                window.localStorage['nickname'] = data.ppData.user.nickname;
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

app.controller('meetCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicLoading, PPHttp) {
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

            if (!($rootScope.r_meetTargetUpdated[meet._id]))
            //if ($rootScope.r_meetTargetUpdated[meet._id])
            {
                PPHttp.do(
                    'p',
                    'confirmMeetSearchTarget', {
                        token: $rootScope.r_mainInfo.token,
                        meetId: meet._id
                    },
                    //success
                    function (data, status) {
                        $rootScope.r_targets = data.ppData;
                        $state.go('tab.meet.condition.specialPic');
                    }
                );
            }
            else
            {
                $state.go('tab.meet.condition');
            }
        }
        else if (meet.status == '待回复')
        {
            if (meet.target.username == $rootScope.r_mainInfo.user.username)
            {
                $rootScope.r_searchMode = '回复';
                $rootScope.r_meetCondition = {
                    mapLoc: meet.mapLoc,
                    specialInfo: {
                        sex : null,
                        clothesColor : null,
                        clothesStyle : null,
                        clothesType : null,
                        glasses : null,
                        hair : null
                    }
                };
                $rootScope.r_curMeet = meet;
                $state.go('tab.meet.condition');
            }
            else if (meet.creater.username == $rootScope.r_mainInfo.user.username)
            {
                $rootScope.r_curMeet = meet;
                console.log(meet);
                $scope.modal.show();
            }
        }
    }

    $scope.doRefresh = function() {
        PPHttp.do(
            'p',
            'getMeets',
            {
                token: $rootScope.r_mainInfo.token
            },
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

    $scope.createMeet = function() {
        $rootScope.r_curMeet = null;
        $ionicLoading.show({
            template: 'Loading...'
        });
        PPHttp.do(
            'p',
            'sendMeetCheck',
            {
                token: $rootScope.r_mainInfo.token
            },
            function (data, status) {
                if (data.ppResult == 'ok') {
                    $rootScope.r_searchMode = '发起';
                    $rootScope.r_meetCondition = {
                        meetId: null,
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
        ).finally(
            function(){
                $ionicLoading.hide();
            }
        );
    };

    $scope.enterInfo = function(){
        if (!($rootScope.r_mainInfo.user.specialInfoTime
            &&
            moment().startOf('day').add(0, 'hours').isBefore($rootScope.r_mainInfo.user.specialInfoTime)
            )){
            console.log($rootScope.r_mainInfo.user.specialInfoTime);
            console.log(moment().startOf('day').add(4, 'hours').isBefore($rootScope.r_mainInfo.user.specialInfoTime));

            $rootScope.r_mainInfo.user.specialInfo.hair = null;
            $rootScope.r_mainInfo.user.specialInfo.glasses = null;
            $rootScope.r_mainInfo.user.specialInfo.clothesType = null;
            $rootScope.r_mainInfo.user.specialInfo.clothesColor = null;
            $rootScope.r_mainInfo.user.specialInfo.clothesStyle = null;
            $rootScope.r_mainInfo.user.specialPic = null;
        }
        console.log($rootScope.r_mainInfo);
        $state.go('tab.meet.info');
    };
});

app.controller('meetConditionCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout) {
    $scope.bLng = null;
    $scope.bLat = null;
});

app.controller('meetInfoCtrl', function($scope, $rootScope, $state, $ionicModal, $cordovaCamera, PPHttp, $cordovaToast, $cordovaFileTransfer, $ionicLoading) {
    $scope.myGoBack = function() {
        if (!(
            $rootScope.r_mainInfo.user.specialInfo.clothesColor
            && $rootScope.r_mainInfo.user.specialInfo.clothesStyle
            && $rootScope.r_mainInfo.user.specialInfo.clothesType
            && $rootScope.r_mainInfo.user.specialInfo.glasses
            && $rootScope.r_mainInfo.user.specialInfo.hair
            && $rootScope.r_mainInfo.user.specialPic
            )){
            console.log('请填写完整!');
            $cordovaToast.showShortCenter('请填写完整!');
            return;
        }
        //update info

        $ionicLoading.show({
            template: '上传中...'
        });
        PPHttp.do(
            'p',
            'updateSpecialInfo',
            {
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
                    $state.go('tab.meet');
                }
            }
        ).finally(
            function(){
                $ionicLoading.hide();
            }
        );
    };

    $ionicModal.fromTemplateUrl(
        'templates/option.html',
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

    $scope.clickInfoItem = function(item){
        switch(item) {
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

    $scope.clickItem = function(item){
        switch($rootScope.r_curOptionName) {
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

    $scope.takePhoto = function(){
        try{
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

            $cordovaCamera.getPicture(options).then(function(fileURL) {
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
                    .then(function(result) {
                        $rootScope.r_mainInfo.user.specialPic = (JSON.parse(result.response))["ppResult"];
                        $rootScope.r_mainInfo.user.specialPicDisplay = $rootScope.r_mainInfo.user.specialPic;
                        console.log($rootScope.r_mainInfo.user.specialPic);
                    }, function(err) {
                        console.log(err);
                        $cordovaToast.showShortCenter(err);
                    }, function (progress) {
                        // constant progress updates
                    });
            }, function(err) {
                // error
                console.log(err);
                $cordovaToast.showShortCenter(err);
            });
        }
        catch (err) {
            console.log(err);
            $cordovaToast.showShortCenter(err);
        }
    }

});

app.controller('profileCtrl', function($scope, $rootScope, $state, $ionicHistory, $timeout, $ionicLoading, $http, $cordovaToast) {

    $scope.getCurMapPosition = function()
    {
        //console.log($rootScope.r_lastLocation);
        $http.jsonp("http://api.map.baidu.com/geoconv/v1/?callback=JSON_CALLBACK&ak=MgBALVVeCd8THVBi6gPdvsvG&coords=" + $rootScope.r_lastLocation.lng + "," + $rootScope.r_lastLocation.lat).
            success(function(data, status, headers, config) {
                //转换为百度坐标
                if (data.status == 0)
                {
                $scope.bLng = data.result[0].x;
                $scope.bLat = data.result[0].y;
                $scope.mapUpdateTime = new Date();
                }
                else
                {
                    console.log(data.message);
                    $cordovaToast.showShortCenter(data.message);
                }
            }).
            error(function(err){
                console.log(err);
                $cordovaToast.showShortCenter(err);
            });
    }

    $scope.mapLocs = [];

    $scope.logout = function(){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });

        $ionicLoading.show({
            template: '退出中...'
        });

        $state.go('login');
        $timeout(function() {
            window.location.reload();
            $ionicLoading.hide();
        }, 300);

    }
});

app.controller('conditionSpecialCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicHistory, PPHttp) {
});

app.filter("objectIDtoDate", function () {
    return function (objectID) {
        moment.locale('zh-cn');
        return moment(new Date(parseInt((""+objectID).substr(0,8), 16)*1000));
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

        if (data.ppMsg == "认证错误!")
        {
            //todo logout
        }
    };

    return {
        do: function (methord, path, paramObj, success, err) {
            var s = success || handleSuccess;
            var e = err || handleErr;
            var p = paramObj || {};
            switch(methord) {
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
        }
    };
});
