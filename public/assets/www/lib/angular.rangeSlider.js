/*
 *  Tenzen Ionic RangeSlider Directive
 * 
 *  Version: tz-0.0.1
 *
 *  Author: Rodrigo Sliachticas, https://github.com/lastikas
 *
 *  The tzRangeSlider has been styled to match the default styling
 *  of Ionic Framework's range input
 *
 *  Originally forked from https://github.com/danielcrisp
 *

    This code is released under the MIT Licence - http://opensource.org/licenses/MIT

    Copyright (c) 2015 LUA.NET

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

(function() {
    'use strict';

    /**
     * RangeSlider, allows user to define a range of values using a slider
     * Touch friendly.
     * @directive
     */
    angular.module('tenzen-ionic-rangeSlider', [])
        .directive('tzRangeSlider', ['$document', '$log', '$ionicSideMenuDelegate', '$ionicScrollDelegate', function($document, $log, $ionicSideMenuDelegate, $ionicScrollDelegate) {

        	var CAN_DRAG_ION_SIDE_MENU = $ionicSideMenuDelegate.canDragContent(),
                CLASS_NAME_DOWN = 'ngrs-down',
                CLASS_NAME_OVER = 'ngrs-over',
                CLASS_NAME_DISABLED = 'ngrs-disabled'

            // test for mouse, pointer or touch
            var eventNamespace = '.rangeSlider',

                defaults = {
                    disabled: false,
                    orientation: 'horizontal',
                    step: 0,
                    decimalPlaces: 0,
                    showValues: true,
                    preventEqualMinMax: false
                },

                // Determine the events to bind. IE11 implements pointerEvents without
                // a prefix, which breaks compatibility with the IE10 implementation.
                /** @const */
                actions = window.navigator.pointerEnabled ? {
                    start: 'pointerdown',
                    move: 'pointermove',
                    end: 'pointerup',
                    over: 'pointerdown',
                    out: 'mouseout'
                } : window.navigator.msPointerEnabled ? {
                    start: 'MSPointerDown',
                    move: 'MSPointerMove',
                    end: 'MSPointerUp',
                    over: 'MSPointerDown',
                    out: 'mouseout'
                } : {
                    start: 'mousedown touchstart',
                    move: 'mousemove touchmove',
                    end: 'mouseup touchend',
                    over: 'mouseover touchstart',
                    out: 'mouseout'
                },

                onEvent = actions.start + eventNamespace,
                moveEvent = actions.move + eventNamespace,
                offEvent = actions.end + eventNamespace,
                overEvent = actions.over + eventNamespace,
                outEvent = actions.out + eventNamespace,

                // get standarised clientX and clientY
                client = function(f) {
                    try {
                        return [(f.clientX || f.originalEvent.clientX || f.originalEvent.touches[0].clientX), (f.clientY || f.originalEvent.clientY || f.originalEvent.touches[0].clientY)];
                    } catch (e) {
                        return ['x', 'y'];
                    }
                },

                restrict = function(value) {
                    // normalize so it can't move out of bounds
                    return (value < 0 ? 0 : (value > 100 ? 100 : value));

                },

                isNumber = function(n) {
                    // console.log(n);
                    return !isNaN(parseFloat(n)) && isFinite(n);
                },

                scopeOptions = {
                    disabled: '=?',
                    min: '=',
                    max: '=',
                    modelMin: '=?',
                    modelMax: '=?',
                    onHandleDown: '&', // calls optional function when handle is grabbed
                    onHandleUp: '&', // calls optional function when handle is released
                    step: '@',
                    decimalPlaces: '@',
                    showValues: '@',
                    pinHandle: '@',
                    preventEqualMinMax: '@'
                };

            return {
                restrict: 'A',
                replace: true,
                template: ['<div class="ngrs-range-slider">',
                    '<div class="ngrs-runner">',
                    '<div class="ngrs-handle ngrs-handle-min"><i></i></div>',
                    '<div class="ngrs-handle ngrs-handle-max"><i></i></div>',
                    '<div class="ngrs-join"></div>',
                    '</div>',
                    '</div>'
                ].join(''),
                scope: scopeOptions,
                link: function(scope, element, attrs, controller) {

                    /**
                     *  FIND ELEMENTS
                     */

                    var $slider = angular.element(element),
                        handles = [element.find('.ngrs-handle-min'), element.find('.ngrs-handle-max')],
                        values = [element.find('.ngrs-value-min'), element.find('.ngrs-value-max')],
                        join = element.find('.ngrs-join'),
                        pos = 'left',
                        posOpp = 'right',
                        orientation = 0,
                        allowedRange = [0, 0],
                        range = 0,
                        down = false;

                    /**
                     *  FALL BACK TO DEFAULTS FOR SOME ATTRIBUTES
                     */

                    attrs.$observe('disabled', function(val) {
                        if (!angular.isDefined(val)) {
                            scope.disabled = defaults.disabled;
                        }

                        scope.$watch('disabled', setDisabledStatus);
                    });

                    attrs.$observe('step', function(val) {
                        if (!angular.isDefined(val)) {
                            scope.step = defaults.step;
                        }
                    });

                    attrs.$observe('decimalPlaces', function(val) {
                        if (!angular.isDefined(val)) {
                            scope.decimalPlaces = defaults.decimalPlaces;
                        }
                    });

                    attrs.$observe('showValues', function(val) {
                        if (!angular.isDefined(val)) {
                            scope.showValues = defaults.showValues;
                        } else {
                            if (val === 'false') {
                                scope.showValues = false;
                            } else {
                                scope.showValues = true;
                            }
                        }
                    });

                    attrs.$observe('pinHandle', function(val) {
                        if (!angular.isDefined(val)) {
                            scope.pinHandle = null;
                        } else {
                            if (val === 'min' || val === 'max') {
                                scope.pinHandle = val;
                            } else {
                                scope.pinHandle = null;
                            }
                        }

                        scope.$watch('pinHandle', setPinHandle);
                    });

                    attrs.$observe('preventEqualMinMax', function(val) {
                        if (!angular.isDefined(val)) {
                            scope.preventEqualMinMax = defaults.preventEqualMinMax;
                        } else {
                            if (val === 'false') {
                                scope.preventEqualMinMax = false;
                            } else {
                                scope.preventEqualMinMax = true;
                            }
                        }
                    });

                    // listen for changes to values
                    scope.$watch('min', setMinMax);
                    scope.$watch('max', setMinMax);

                    scope.$watch('modelMin', setModelMinMax);
                    scope.$watch('modelMax', setModelMinMax);

                    /**
                     * HANDLE CHANGES
                     */

                    function setPinHandle(status) {
                        if (status === "min") {
                            angular.element(handles[0]).css('display', 'none');
                            angular.element(handles[1]).css('display', 'block');
                        } else if (status === "max") {
                            angular.element(handles[0]).css('display', 'block');
                            angular.element(handles[1]).css('display', 'none');
                        } else {
                            angular.element(handles[0]).css('display', 'block');
                            angular.element(handles[1]).css('display', 'block');
                        }
                    }

                    function setDisabledStatus(status) {
                        if (status) {
                            $slider.addClass(CLASS_NAME_DISABLED);
                        } else {
                            $slider.removeClass(CLASS_NAME_DISABLED);
                        }
                    }

                    function setMinMax() {

                        if (scope.min > scope.max) {
                            throwError('min must be less than or equal to max');
                        }

                        // only do stuff when both values are ready
                        if (angular.isDefined(scope.min) && angular.isDefined(scope.max)) {

                            // make sure they are numbers
                            if (!isNumber(scope.min)) {
                                throwError('min must be a number');
                            }

                            if (!isNumber(scope.max)) {
                                throwError('max must be a number');
                            }

                            range = scope.max - scope.min;
                            allowedRange = [scope.min, scope.max];

                            // update models too
                            setModelMinMax();

                        }
                    }

                    function setModelMinMax() {

                        if (scope.modelMin > scope.modelMax) {
                            throwWarning('modelMin must be less than or equal to modelMax');
                            // reset values to correct
                            scope.modelMin = scope.modelMax;
                        }

                        // only do stuff when both values are ready
                        if (
                            (angular.isDefined(scope.modelMin) || scope.pinHandle === 'min') &&
                            (angular.isDefined(scope.modelMax) || scope.pinHandle === 'max')
                        ) {

                            // make sure they are numbers
                            if (!isNumber(scope.modelMin)) {
                                if (scope.pinHandle !== 'min') {
                                    throwWarning('modelMin must be a number');
                                }
                                scope.modelMin = scope.min;
                            }

                            if (!isNumber(scope.modelMax)) {
                                if (scope.pinHandle !== 'max') {
                                    throwWarning('modelMax must be a number');
                                }
                                scope.modelMax = scope.max;
                            }

                            var handle1pos = restrict(((scope.modelMin - scope.min) / range) * 100),
                                handle2pos = restrict(((scope.modelMax - scope.min) / range) * 100),
                                value1pos,
                                value2pos;

                            // make sure the model values are within the allowed range
                            scope.modelMin = Math.max(scope.min, scope.modelMin);
                            scope.modelMax = Math.min(scope.max, scope.modelMax);

                            // check for no range
                            if (scope.min === scope.max && scope.modelMin == scope.modelMax) {

                                // reposition handles
                                angular.element(handles[0]).css(pos, '0%');
                                angular.element(handles[1]).css(pos, '100%');


                                // reposition join
                                angular.element(join).css(pos, '0%').css(posOpp, '0%');

                            } else {

                                // reposition handles
                                angular.element(handles[0]).css(pos, handle1pos + '%');
                                angular.element(handles[1]).css(pos, handle2pos + '%');

                                // reposition join
                                angular.element(join).css(pos, handle1pos + '%').css(posOpp, (100 - handle2pos) + '%');

                                // ensure min handle can't be hidden behind max handle
                                if (handle1pos > 95) {
                                    angular.element(handles[0]).css('z-index', 3);
                                }
                            }

                        }

                    }

                    function handleMove(index) {
                        var $handle = handles[index];

                        // on mousedown / touchstart
                        $handle.bind(onEvent + 'X', function(event) {

                            var handleDownClass = (index === 0 ? 'ngrs-handle-min' : 'ngrs-handle-max') + '-down',
                                //unbind = $handle.add($document).add('body'),
                                modelValue = (index === 0 ? scope.modelMin : scope.modelMax) - scope.min,
                                originalPosition = (modelValue / range) * 100,
                                originalClick = client(event),
                                previousClick = originalClick,
                                previousProposal = false;

                            if (angular.isFunction(scope.onHandleDown)) {
                                scope.onHandleDown();
                            }

                            // stop user accidentally selecting stuff
                            angular.element('body').bind('selectstart' + eventNamespace, function() {
                                return false;
                            });

                            // only do stuff if we are disabled
                            if (!scope.disabled) {

                                // flag as down
                                down = true;

                                // add down class
                                $handle.addClass(CLASS_NAME_DOWN);

                                $slider.addClass('ngrs-focus ' + handleDownClass);

                                // add touch class for MS styling
                                angular.element('body').addClass('ngrs-touching');

                                // listen for mousemove / touchmove document events
                                $document.bind(moveEvent, function(e) {

                                	$ionicSideMenuDelegate.canDragContent(false);
                                	$ionicScrollDelegate.freezeScroll(true);

                                    // prevent default
                                    e.preventDefault();

                                    var currentClick = client(e),
                                        movement,
                                        proposal,
                                        other,
                                        per = (scope.step / range) * 100,
                                        otherModelPosition = (((index === 0 ? scope.modelMax : scope.modelMin) - scope.min) / range) * 100;

                                    if (currentClick[0] === "x") {
                                        return;
                                    }

                                    // calculate deltas
                                    currentClick[0] -= originalClick[0];
                                    currentClick[1] -= originalClick[1];

                                    // has movement occurred on either axis?
                                    movement = [
                                        (previousClick[0] !== currentClick[0]), (previousClick[1] !== currentClick[1])
                                    ];

                                    // propose a movement
                                    proposal = originalPosition + ((currentClick[orientation] * 100) / (orientation ? $slider.height() : $slider.width()));

                                    // normalize so it can't move out of bounds
                                    proposal = restrict(proposal);

                                    if (scope.preventEqualMinMax) {

                                        if (per === 0) {
                                            per = (1 / range) * 100; // restrict to 1
                                        }

                                        if (index === 0) {
                                            otherModelPosition = otherModelPosition - per;
                                        } else if (index === 1) {
                                            otherModelPosition = otherModelPosition + per;
                                        }
                                    }

                                    // check which handle is being moved and add / remove margin
                                    if (index === 0) {
                                        proposal = proposal > otherModelPosition ? otherModelPosition : proposal;
                                    } else if (index === 1) {
                                        proposal = proposal < otherModelPosition ? otherModelPosition : proposal;
                                    }

                                    if (scope.step > 0) {
                                        // only change if we are within the extremes, otherwise we get strange rounding
                                        if (proposal < 100 && proposal > 0) {
                                            proposal = Math.round(proposal / per) * per;
                                        }
                                    }

                                    if (proposal > 95 && index === 0) {
                                        $handle.css('z-index', 3);
                                    } else {
                                        $handle.css('z-index', '');
                                    }

                                    if (movement[orientation] && proposal != previousProposal) {

                                        if (index === 0) {

                                            // update model as we slide
                                            scope.modelMin = parseFloat(parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces));

                                        } else if (index === 1) {

                                            scope.modelMax = parseFloat(parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces));
                                        }

                                        // update angular
                                        scope.$apply();

                                        previousProposal = proposal;

                                    }

                                    previousClick = currentClick;

                                }).bind(offEvent, function() {

                                	$ionicSideMenuDelegate.canDragContent(CAN_DRAG_ION_SIDE_MENU);
                                	$ionicScrollDelegate.freezeScroll(false);

                                    if (angular.isFunction(scope.onHandleUp)) {
                                        scope.onHandleUp();
                                    }

                                    // unbind listeners
                                    $document.off(moveEvent);
                                    $document.off(offEvent);

                                    angular.element('body').removeClass('ngrs-touching');

                                    // cancel down flag
                                    down = false;

                                    // remove down and over class
                                    $handle.removeClass(CLASS_NAME_DOWN);
                                    $handle.removeClass(CLASS_NAME_OVER);

                                    // remove active class
                                    $slider.removeClass('ngrs-focus ' + handleDownClass);

                                });
                            }

                        }).on(overEvent, function () {
                            $handle.addClass(CLASS_NAME_OVER);
                        }).on(outEvent, function () {
                            if (!down) {
                                $handle.removeClass(CLASS_NAME_OVER);
                            }
                        });
                    }

                    function throwError(message) {
                        scope.disabled = true;
                        throw new Error('RangeSlider: ' + message);
                    }

                    function throwWarning(message) {
                        $log.warn(message);
                    }

                    /**
                     * DESTROY
                     */

                    scope.$on('$destroy', function() {

                        // unbind event from slider
                        $slider.off(eventNamespace);

                        // unbind from body
                        angular.element('body').off(eventNamespace);

                        // unbind from document
                        $document.off(eventNamespace);

                        // unbind from handles
                        for (var i = 0, l = handles.length; i < l; i++) {
                            handles[i].off(eventNamespace);
                            handles[i].off(eventNamespace + 'X');
                        }

                    });

                    /**
                     * INIT
                     */

                    $slider
                    // disable selection
                        .bind('selectstart' + eventNamespace, function(event) {
                            return false;
                        })
                        // stop propagation
                        .bind('click', function(event) {
                            event.stopPropagation();
                        });

                    // bind events to each handle
                    handleMove(0);
                    handleMove(1);

                }
            };
        }])
        .directive('tzIonicRangeSlider', function($compile) {
            return {
                restrict : 'E',
                replace: true,
                transclude: true,
                template : '',
                link : function($scope, $element, $attrs) {

                    var tpl = '<div class="item range ngrs-range _ionColor_">\
                    <i class="icon ngrs-range-value ngrs-range-min-value">_prefix_{{minSelected}}_suffix_</i>\
                    <div tz-range-slider min="minRange" max="maxRange" model-min="minSelected" model-max="maxSelected"></div>\
                    <i class="icon ngrs-range-value ngrs-range-max-value">_prefix_{{maxSelected}}_suffix_</i>\
                    </div>';

                    var prefix   = $attrs.prefix || '',
                    suffix   = $attrs.suffix || '',
                    ionColor = ($attrs.ionColor)? 'range-'+$attrs.ionColor : '';

                    if(typeof $attrs.title != undefined) {
                        tpl = '<div class="item item-divider"><h2>'+$attrs.title+'</h2></div>' + tpl;
                    }

                    tpl = tpl.replace(/minSelected/g, $attrs.minSelected)
                    .replace(/maxSelected/g, $attrs.maxSelected)
                    .replace(/minRange/g, $attrs.minRange)
                    .replace(/maxRange/g, $attrs.maxRange)
                    .replace(/_ionColor_/, ionColor)
                    .replace(/_prefix_/g, prefix+' ')
                    .replace(/_suffix_/g, ' '+suffix);

                    $element.replaceWith( $compile(tpl)($scope) );
                }
            }
        });

    // requestAnimationFramePolyFill
    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}());
