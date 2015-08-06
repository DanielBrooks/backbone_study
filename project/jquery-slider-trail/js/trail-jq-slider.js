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

    /* options object for the init() function
      {
        $trailWrap:,
        steps: <int digit>,
        currentStep: <int digit>
      }
    */

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
      },
      destroy: function() {
        this.options.$trailWrap.slider('destroy');
        this.options.$trailWrap.remove();
      }
    }
  };

  $.fn.trailJqSlider = function(action) {
    var $select = this;

    if (!$select.length) {
      $select = $('[data-trail-jq-slider]');
    }
    $select.each(function() {

      var $select = $(this),
          $root = $select.closest('[data-trail-slider-block]'),
          $amount = $root.find('[data-slider-value]'),

          steps = $select.find('option').length,
          currentStep = $select.find('option:selected').index(),
          $slider;

      if (action == 'destroy') {
        $select.removeClass('hidden').off('trailSliderChange');
        $select[0].trailBuilder.destroy();
        delete $select[0].trailBuilder;
        return false;
      }
      if (typeof($select[0].trailBuilder) != 'undefined') {
        return false;
      }

      $amount.text($select[0].selectedIndex + 1);

      $slider = $( "<div></div>" ).insertAfter( $select )
      $slider.slider({
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

          $select.addClass('hidden');
          $select[0].trailBuilder = new TrailBuilder;
          $select[0].trailBuilder.init({
            $trailWrap: $slider,
            steps: steps,
            currentStep: currentStep
          });
          console.log(1);
        }
      });

      $select.on('trailSliderChange', function() {
        $slider.slider( "value", this.selectedIndex + 1 );
        $amount.text(this.selectedIndex + 1);
        this.trailBuilder.setCurrent(this.selectedIndex);
      });
    });
  };

  $(document).on('change', '[data-trail-jq-slider]', function() {
    $(this).trigger('trailSliderChange');
  });
  $('[data-trail-jq-slider]').trailJqSlider();

});