rentferApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});


rentferApp.directive('hideTabBar', function ($timeout) {
    var style = angular.element('<style>').html(
        '.has-tabs.no-tabs:not(.has-tabs-top) { bottom: 0; }\n' +
        '.no-tabs.has-tabs-top { top: 44px; }');
    document.body.appendChild(style[0]);
    return {
        restrict: 'A',
        compile: function (element, attr) {
            var tabBar = document.querySelector('.tab-nav');
            return function ($scope, $element, $attr) {
                var scroll = $element[0].querySelector('.scroll-content');
                $scope.$on('$ionicView.beforeEnter', function () {
                    tabBar.classList.add('slide-away');
                    scroll.classList.add('no-tabs');
                })
                $scope.$on('$ionicView.beforeLeave', function () {
                    tabBar.classList.remove('slide-away');
                    scroll.classList.remove('no-tabs')
                });
            }
        }
    };
});

rentferApp.directive('rentEdit', ["$document", "$state", "editorService", "$filter", function ($document, $state, editorService, $filter) {
    return {
        link: function (scope, element, attr) {

            var ctrl = scope[attr.rentEdit];
            var showDisplay = function (value) {
                if (ctrl.type == 'select') {
                    ctrl.displayValue = '';
                    for (var index in ctrl.options)
                        if (ctrl.options[index].value == ctrl.value) {
                            ctrl.displayValue = ctrl.options[index].label;
                            break;
                        }
                } else if (ctrl.type == 'price') {
                    if (ctrl.value)
                        ctrl.value = parseFloat(ctrl.value.toFixed(2));

                    ctrl.displayValue = '$' + $filter('number')(ctrl.value, 2);
                }

                //console.log('show display', value);

                if ($(element).find('label').length) {
                    $(element).find('label').text(ctrl.displayValue ? ctrl.displayValue : ctrl.value);
                } else {
                    $(element).append('<label></label');
                    $(element).find('label').text(ctrl.displayValue ? ctrl.displayValue : ctrl.value);
                }

                //console.log(ctrl);

                if (ctrl.value === null || ctrl.value === undefined || ctrl.value === '') {
                    console.log(ctrl);
                    //if no value, display placeholder
                    if ($(element).find('.placeholder').length) {
                        $(element).find('.placeholder').text(ctrl.placeholder);
                    } else {
                        $(element).find('label').append('<em class="placeholder">' + ctrl.placeholder + '</em>');
                    }
                } else {
                    $(element).find('.placeholder').text('');
                }

                if (value != null && value != undefined)
                    return ctrl.callback(value);
            };
            showDisplay();

            element.parent().on('click', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();

                editorService.waitResult(ctrl, showDisplay);

                if (ctrl.url) {
                    $state.go(ctrl.url);
                } else {
                    $state.go('tab.edit-tab-me');
                }
            });


            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        }
    };
}]);


rentferApp.directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function () {
                element[0].focus();
            }, 150);
        }
    };
});

var defaultAvatar = "./img/default/avatar.png";
var defaultImage = "./img/default/image.png";

rentferApp.directive('lazyImage', function ($timeout, imageService) {
    return {
        link: function (scope, element, attrs) {

            var type = attrs.lazyImageType;
            if (type === "avatar") {
                element.attr('src', defaultAvatar);
            } else {
                element.attr('src', defaultImage);
            }

            imageService.getImage(attrs.lazyImage,type,
                                  function(image){
                if(image){
                    element.attr('src',image);   
                }
            });

            //$timeout(function () {
            //    element[0].focus();
            //}, 150);
        }
    };
});