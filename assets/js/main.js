// FB - Firebelly 2015
/*jshint latedef:false*/

// Good Design for Good Reason for Good Namespace
var FB = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,768,1200],
      $document,
      words,
      player,
      currentWordIndex,
      currentArrangement = 0,
      colorScheme,
      $videoWrapper,
      videoTimeout,
      introRearranges = 0,
      $info;

  function _init() {
    // Cache some common DOM queries
    $document = $(document);
    $('body').addClass('loaded');
    $word = $('.random');
    $videoWrapper = $('.vimeo-wrapper');
    $info = $('.info');

    // Set screen size vars
    _resize();
    _randomArrangement();
    _randomColorScheme();
    _refreshArrangement();
    _initInfoToggle();

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      var offset = $(href).offset().top;
      $('body').animate({
        scrollTop: offset
      }, 500);
      _scrollBody($(href));
    });

  } // end init()

  function _scrollBody(element, duration, delay, offset) {
    if (offset === true && breakpoint_medium === true) {
      offset = $header.outerHeight();
    } else {
      offset = 0;
    }
    element.velocity('scroll', {
      duration: duration,
      delay: delay,
      offset: -offset
    }, 'easeOutSine');
  }

  function _randNum(num,excludeNum){
    var randNumber = Math.floor(Math.random()*num)+1;
    if (randNumber === excludeNum) {
      return _randNum(num,excludeNum);
    } else{
      return randNumber;
    }
  }

  function _randomArrangement() {

    // Reset Widths
    _resetChildWidths($word);

    // Remove for arrangement class
    var classes = $word.attr('class').split(' ');
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].indexOf('arrangement-') != -1) {
        $word.removeClass(classes[i]);
      }
    }

    // Choose a random number from the amount of arrangements set
    var arrangements = $word.data('arrangements');
    currentArrangement = _randNum(arrangements,currentArrangement);

    // Assign the class to the current word
    $word.addClass('arrangement-' + currentArrangement);

    if (introRearranges < 3) {
      window.setTimeout(_randomArrangement, introRearranges === 0 ? 700 : 250);
      introRearranges++;
    }
  }

  function _randomColorScheme() {

    // Choose color scheme
    colorScheme = _randNum(8,colorScheme);

    $videoWrapper.removeClass('loaded');

    // Change body class
    for(var i=1; i<=9; i++){
      $('body').removeClass('color-scheme'+i);
    }
    $('body').addClass('color-scheme'+colorScheme);

    clearTimeout(videoTimeout);
    videoTimeout = window.setTimeout(_changeVideo,1500);
  }

  function _changeVideo () {

    if (breakpoint_medium) {
      var vimeoIds= [ 
        '194104576',
        '199392513',
        '199394087',
        '199394333',
        '199394542',
        '199394777',
        '199395017',
        '199395254',
      ];

      $('.vimeo-wrapper').empty().removeClass('loaded').append('<iframe src="https://player.vimeo.com/video/'+vimeoIds[colorScheme-1]+'?background=1&autoplay=1&loop=1&byline=0&title=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
      var iframe = $videoWrapper.find('iframe');
      player = new Vimeo.Player(iframe);

      player.addCuePoint(.01).then(function(id) {
        player.on('cuepoint', function (data) {
          if(data.id === id) {
            $videoWrapper.addClass('loaded');
          }
        });
      });
    }
  }


  function _refreshArrangement() {
    $('.refresh').on('click', function(e) {
      e.preventDefault();
      _randomArrangement();
      _randomColorScheme();
    });
  }

  function _resetChildWidths(element) {
    var childDivs = element.children();
    childDivs.each(function() {
      $(this).removeAttr('style');
    });
  }

  function _initInfoToggle() {
    var $toggle = $info.find('.toggle');

    $toggle.on('click', function() {
      $info.toggleClass('active');
      $toggle.toggleClass('active');
    });
  }

  // Called in quick succession as window is resized
  function _resize() {
    screenWidth = document.documentElement.clientWidth;
    breakpoint_small = (screenWidth > breakpoint_array[0]);
    breakpoint_medium = (screenWidth > breakpoint_array[1]);
    breakpoint_large = (screenWidth > breakpoint_array[2]);
  }

  // Public functions
  return {
    init: _init,
    resize: _resize,
    scrollBody: function(section, duration, delay) {
      _scrollBody(section, duration, delay);
    }
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(FB.init);

// Zig-zag the mothership
jQuery(window).resize(FB.resize);