$(function() {

  $.widget( "custom.slider", $.ui.slider, {
	_refresh: function() {
      this._createRange();
      this._createHandles();
      this._setupEvents();
      this._refreshValue();
	}
  });


  var TrailBuilder = function() {
    return {
      list: '<ul class="slider-nav-trail"></ul>',
      listLine: '<span class="filling-line"></span>',
      mark: '<li><span class="trail-mark"></span></li>',
      markText: '<span class="mark-text"></span>',
      activeTrailHolder: '<div class="active-trail-holder"></div>',
      init: function(options) {
        this.options = options;
        this.trailPattern = this.createTrail('mark-text');
        this.trailActive = this.createTrail('active');

        this.options.$trailWrap
          .addClass('slider-nav-block')
          .prepend($(this.listLine))
          .prepend(this.trailPattern)
            .find('.ui-slider-range')
            .addClass('active-trail-block')
            .append(this.trailActive);
        this.trailActive.wrap(this.activeTrailHolder);

        this.setCurrent(this.options.currentStep);

        this.setStepWidth();
      },
      createTrail: function(trailType) {
        var $list = $(this.list),
            stepWidth = this.options.$trailWrap.width() / (this.options.steps - 1) + 'px',
            i;
        for (i = 0; i < this.options.steps; i++) {
          $list.append(this.createStep(i, trailType));
        }
        if (trailType == 'active') {
          $list.addClass('active');
        }
        return $list;
      },
      createStep: function(i, type) {
        var $step = $(this.mark);
        if (type == 'mark-text') {
          $step.append(this.createMarkText(i));
        }
        return $step;
      },
      createMarkText: function(i) {
        return $(this.markText).text(i + 1);
      },
      setCurrent: function(currentStep) {
        this.trailPattern.find('li').removeClass('active').eq(currentStep).addClass('active');
      },
      setStepWidth: function() {
        var width = this.trailPattern.width() / (this.options.steps - 1) + 'px';

        this.trailPattern.children('li').css('width', width);
        this.trailActive.css('width', this.trailPattern.outerWidth())
          .children('li').css('width', width);
      }
    }
  };

  var $select = $( "#minbeds" ),
      steps = $select.find('option').length,
      currentStep = $select.find('option:selected').index(),
      $amount = $('[data-slider-value]'),
      $slider;

  $amount.text($select[0].selectedIndex + 1);

  $slider = $( "<div></div>" ).insertAfter( $select ).slider({
    min: 1,
    max: steps,
    range: "min",
    value: $select[ 0 ].selectedIndex + 1,
    slide: function( event, ui ) {
      $select[ 0 ].selectedIndex = ui.value - 1;
      $amount.text(ui.value);
      $select[0].trailBuilder.setCurrent(ui.value - 1);
    },
    create: function( event, ui ) {
      var $trailWrap = $(event.target);

      $select[0].trailBuilder = new TrailBuilder;
      $select[0].trailBuilder.init({
        $trailWrap: $trailWrap,
        steps: steps,
        currentStep: currentStep
      });
      console.log(1);
    }
  });

  $select.change(function() {
    $slider.slider( "value", this.selectedIndex + 1 );
    $amount.text(this.selectedIndex + 1);
  });



});