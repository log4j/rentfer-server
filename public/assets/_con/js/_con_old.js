/*!
 * Con
 * Admin Dashboard with Material Design
 * http://nkdev.info
 * @author nK
 * @version 1.0.0
 * Copyright 2015.
 */
jQuery(function () {
    // variables
    var $ = jQuery;
    var sidebarSpeed = 300;
    var cardPanelSpeed = 300;

    // init selects
    $('select').material_select();

    // init dropdown
    $('.dropdown-button').each(function () {
        var hover = $(this).attr('data-hover') == "true" || false;
        var constrainWidth = $(this).attr('data-constrainwidth') == "false" || true;
        var inDuration = $(this).attr('data-induration') || 300;
        var outDuration = $(this).attr('data-outduration') || 300;
        $(this).dropdown({
            hover: hover,
            constrain_width: constrainWidth,
            inDuration: inDuration,
            outDuration: outDuration
        })
    });

    // init collapsible
    $('.collapsible').each(function () {
        $(this).collapsible({
            accordion: $(this).attr('data-collapsible') === 'accordion'
        });
    });

    // init modals
    $('.modal-trigger').each(function () {
        var dismissible = $(this).attr('data-dismissible') == "true" || false;
        var opacity = $(this).attr('data-opacity') || 0.5;
        var in_duration = $(this).attr('data-induration') || 300;
        var out_duration = $(this).attr('data-outduration') || 300;

        $(this).leanModal({
            dismissible: dismissible,
            opacity: opacity,
            in_duration: in_duration,
            out_duration: out_duration
        });
    });

    // init datepicker
    $('.datepicker').pickadate();

    // init tabs
    $('ul.tabs').tabs();

    // init nanoScroller
    $('.nano');

    $('.nano').each(function () {
        var scrollTo = '';
        if ($(this).hasClass('scroll-bottom')) {
            scrollTo = 'bottom';
        } else if ($(this).hasClass('scroll-top')) {
            scrollTo = 'top';
        }

        $(this).nanoScroller({
            preventPageScrolling: true,
            scroll: scrollTo
        })
    });

    // init prettyPrint
    prettyPrint();

    // close dismissible alerts
    $('.alert').on('click', '.close', function () {
        $(this).parents('.alert').remove();
    });




    /*
     *
     * WEATHER WIDGET
     *
     */
    var weatherDiv = $(".weather-card");

    function loadWeather(location, woeid) {
        $.simpleWeather({
            location: location,
            woeid: woeid,
            unit: 'c',
            success: function (weather) {
                var iconsList = ['wi-tornado', 'wi-night-thunderstorm', 'wi-storm-showers', 'wi-thunderstorm', 'wi-storm-showers', 'wi-rain-mix', 'wi-rain-mix', 'wi-rain-mix', 'wi-rain-mix', 'wi-snow', 'wi-rain-mix', 'wi-snow', 'wi-snow', 'wi-snow', 'wi-snow', 'wi-rain-mix', 'wi-snow', 'wi-rain-mix', 'wi-rain-wind', 'wi-cloudy-windy', 'wi-cloudy-windy', 'wi-cloudy-windy', 'wi-cloudy-windy', 'wi-cloudy-windy', 'wi-cloudy-gusts', 'wi-cloudy-gusts', 'wi-cloudy', 'wi-night-cloudy', 'wi-day-cloudy', 'wi-night-cloudy', 'wi-day-cloudy', 'wi-night-clear', 'wi-day-sunny', 'wi-night-clear', 'wi-day-sunny', 'wi-rain-mix', 'wi-day-sunny', 'wi-storm-showers', 'wi-storm-showers', 'wi-storm-showers', 'wi-rain', 'wi-rain-mix', 'wi-snow', 'wi-rain-mix', 'wi-night-cloudy', 'wi-storm-showers', 'wi-rain-wind', 'wi-storm-showers'];

                var html = [
          '<div class="row">',
            '<div class="temp col s7">',
              weather.temp + '&deg;' + weather.units.temp,
              ' <span class="alt">' + weather.alt.temp + '&deg;F</span>',
            '</div>',
            '<div class="city col s5"><i class="fa fa-map-marker"></i> ' + weather.city + '</div>',
          '</div>',
          '<div class="icon"><i class="wi ' + iconsList[weather.code] + '"></i></div>',
          '<div class="currently">' + weather.currently + '</div>'
        ].join('');

                weatherDiv.html(html);
            },
            error: function (error) {
                weatherDiv.html('<p>' + error + '</p>');
            }
        });
    }
    if (weatherDiv.length) {
        // Check user geolocation and show weather
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                loadWeather(position.coords.latitude + ',' + position.coords.longitude); //load weather using your lat/lng coordinates
            });
        } else {
            // load default weather
            loadWeather('Seattle', '');
        }
    }


    /*
     *
     * SEARCH BAR
     *
     */
    var searchBar = $('.search-bar:eq(0)');
    var searchBarForm = searchBar.find('form:eq(0)');
    var searchBarBusy;

    function toggleSearchBar() {
        if (searchBarBusy) return;

        searchBarBusy = 1;
        setTimeout(function () {
            searchBarBusy = 0;
        }, 300);

        if (!searchBar.hasClass('active')) {
            searchBar.addClass('active');

            var toggler = $(this);
            var togglerPos = {
                left: toggler.offset().left,
                top: toggler.offset().top,
                right: $(window).width() - (toggler.width() + toggler.offset().left),
                bottom: $(window).height() - (toggler.height() + toggler.offset().top),
                margin: 0
            };
            var searchBarPos = {
                left: searchBarForm.css('left'),
                top: searchBarForm.css('top'),
                right: searchBarForm.css('right'),
                bottom: searchBarForm.css('bottom'),
                margin: searchBarForm.css('margin')
            };

            searchBarForm.css(togglerPos);

            searchBarForm.css(togglerPos).animate(searchBarPos, 500, function () {
                $(this).attr('style', '');
            });

            setTimeout(function () {
                searchBar.find('input').focus();
            }, 300);
        } else {
            searchBar.removeClass('active');
        }
    }

    searchBar.on('click', toggleSearchBar);
    $(document).on('click', '.search-bar-toggle', toggleSearchBar);
    searchBarForm.on('click', function (e) {
        e.stopPropagation();
    });
    searchBarForm.on('click', '.search-bar-toggle', toggleSearchBar);


    /*
     *
     * SIDEBAR MENU
     *
     */
    var sidebar = $('.sidebar');

    // toggle sub menus
    sidebar.on('click', 'li a.toggle', function (e) {
        e.preventDefault();

        var toggle = $(this);
        var toggleParent = toggle.parent();
        var subMenu = toggleParent.find('> .submenu');
        var opened = toggleParent.hasClass('open');

        function closeSub(subMenu) {
            subMenu.css('display', 'block').slideUp(sidebarSpeed, 'swing', function () {
                // close child dropdowns
                $(this).find('li a.toggle').next().attr('style', '');

                // resize for nano scroller and charts
                $(window).resize();
            });

            subMenu.parent().removeClass('open');
            subMenu.find('li a.toggle').parent().removeClass('open');
        }

        if (subMenu.length) {

            // close
            if (opened) {
                closeSub(subMenu);
            }

            // open
            else {
                subMenu.css('display', 'none');
                subMenu.slideDown(sidebarSpeed, 'swing', function () {
                    // resize for nano scroller and charts
                    $(window).resize();
                });
                toggleParent.addClass('open');

                closeSub(toggleParent.siblings('.open').find('> .submenu'));
            }

        }
    });

    // sidebar toggle to small
    function checkSidebarNano() {
        if ($('body').hasClass('sidebar-small')) {
            // destroy scroller on small sidebar
            sidebar.find(".nano").nanoScroller({
                destroy: true
            });
        } else {
            // restore scroller on normal sidebar after end animation (300ms)
            setTimeout(function () {
                sidebar.find(".nano").nanoScroller();
            }, 300);
        }

        setTimeout(function () {
            // resize for nano scroller and charts
            $(window).resize();
        }, 300);
    }
    $('.sidebar-toggle').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('sidebar-small');
        checkSidebarNano();
    });
    checkSidebarNano();


    /*
     *
     * CHAT
     *
     */
    var chat = $('#chat');
    var chatNano = $('#chat .messages .nano');
    var chatMessages = chatNano.find('> .nano-content');
    var chatInput = $('#chat .send > form input[name=chat-message]');
    chat.on('submit', '.send > form', function (e) {
        e.preventDefault();

        var message = chatInput.val();
        if (message) {
            chatMessages.append('<div class="clear"></div>');
            chatMessages.append('<div class="from-me">' + message + '</div>');
            chatInput.val('');
            chatNano.nanoScroller().nanoScroller({
                scroll: 'bottom'
            })
        }
    });
    // open chat
    $(document).on('click', '.chat-toggle', function (e) {
        e.stopPropagation();
        e.preventDefault();
        chat.toggleClass('open');
    });
    // close chat on document click
    $(document).on('click', function () {
        chat.removeClass('open');
    });
    // open chat with user
    chat.on('click', '.contacts .user', function (e) {
        e.stopPropagation();
        chat.addClass('open-messages');
    });
    // cloase chat with user
    chat.on('click', '.messages .back > a', function (e) {
        e.stopPropagation();
        e.preventDefault();
        chat.removeClass('open-messages');
    });
    chat.on('click', function (e) {
        if (!$(e.target).hasClass('chat-toggle') && !$(e.target).parent().hasClass('chat-toggle')) {
            e.stopPropagation();
        }
    });



    /*
     *
     * CARD MINIMIZE / REMOVE
     *
     */
    var cardPanel = $('.card');

    // Remove code
    cardPanel.on('click', 'a.close', function (e) {
        e.preventDefault();

        var card = $(this).parent().parent();

        // remove animation
        card.addClass('animation-remove');

        // waiting for remove animation end
        // and start slideUp animation to animate all blocks under removed
        card.delay(300).slideUp(cardPanelSpeed, function () {
            card.remove();
            // resize for nano scroller and charts
            $(window).resize();
        });

    });

    // minimize code
    cardPanel.on('click', 'a.minimize', function (e) {
        e.preventDefault();

        var card = $(this).parent().parent();
        var content = card.find('.content');

        if (card.hasClass('minimized')) {
            content.css('display', 'none').slideDown(cardPanelSpeed, 'swing', function () {
                // resize for nano scroller and charts
                $(window).resize();
            });
            card.removeClass('minimized');
        } else {
            content.css('display', 'block').slideUp(cardPanelSpeed, 'swing', function () {
                // resize for nano scroller and charts
                $(window).resize();
            });
            card.addClass('minimized');
        }

        // resize for nano scroller and charts
        $(window).resize();
    });


    // redraw all charts on window resize
    $(window).on('resize', function () {
        if (nv && nv.graphs.length) {
            for (var k in nv.graphs) {
                nv.graphs[k].update();
            }
        }
    });



    /*
     *
     * SORTABLE
     *
     */
    $('.sortable').each(function () {
        var options = {
            animation: 150,
            group: 'widgets'
        }

        // if widget has title - use it for dragplace
        if ($(this).find('.card > .title')[0]) {
            options.handle = ".title"
        }

        Sortable.create(this, options);
    });


    if ($.isFunction($.fn.validate)) {
      
        console.log("validation");
        
        $.validator.setDefaults({
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function (error, element) {
                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else if (element.parent('label').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });

        $('.form-validate').each(function () {
            var validator = $(this).validate();
            $(this).data('validator', validator);
        });
    }else{
        console.log("no validation");   
    }


});