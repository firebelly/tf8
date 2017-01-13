// FB - Firebelly 2015
/*jshint latedef:false*/

// Good Design for Good Reason for Good Namespace
var FB = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,1000,1200],
      $document,
      words,
      player,
      currentWordIndex,
      $videoWrapper,
      colorScheme,
      $info;

  function _init() {
    // Cache some common DOM queries
    $document = $(document);
    $('body').addClass('loaded');
    words = $('.random');
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

  function _randNum(arr,excludeNum){
    var randNumber = Math.floor(Math.random()*arr.length);
    if (randNumber === excludeNum) {
      return _randNum(arr,excludeNum);
    } else{
      return randNumber;
    }
  }

  function _randomArrangement() {
    // // Has a current word been chosen yet?
    // if (currentWordIndex !== 'undefined') {
    //   // If so, choose randomly exluding the current word
    //   var randomWordIndex = _randNum(words, currentWordIndex);
    // } else {
    //   // Otherwise choose a random word
    //   var randomWordIndex = Math.floor(Math.random()*words.length);
    // }

    // Assign the word
    var $randomWord = $(words[0]);

    // Reset Widths
    _resetChildWidths($randomWord);

    // Hide the other words
    $('.random').not($randomWord).addClass('-hidden');
    // Unhide the current word
    $randomWord.removeClass('-hidden');
    // Remove for arrangement class
    var classes = $randomWord.attr('class').split(' ');
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].indexOf('arrangement-') != -1) {
        $randomWord.removeClass(classes[i]);
      }
    }

    // Choose a random number from the amount of arrangements set
    var arrangements = $randomWord.data('arrangements'),
        randomArrangement = Math.floor(Math.random() * arrangements) + 1;

    // Assign the class to the current word
    $randomWord.addClass('arrangement-' + randomArrangement);

    // // Set the current word index
    // currentWordIndex = randomWordIndex;
  }

  function _randomColorScheme() {

    // Choose color scheme
    colorScheme = Math.ceil(Math.random()*8);

    // Change body class
    for(var i=1; i<=9; i++){
      $('body').removeClass('color-scheme'+i);
    }
    $('body').addClass('color-scheme'+colorScheme);

    // Change Video
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

    player.on('play', function() {
      setTimeout(function() {
        $videoWrapper.addClass('loaded');
      }, 1500);
    });
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