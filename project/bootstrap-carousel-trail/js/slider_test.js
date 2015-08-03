$(function() {

  $.fn.trailBsCarousel = function() {
    var $carousel = this;

    if (!$carousel.length) {
      $carousel = $('[data-trail-bs-carousel]');
    }

    $carousel.each(function() {
      var $carousel = $(this),
          $carouselNavList = $carousel.find('[data-carousel-list]'),
          $activeTrail = $carousel.find('[data-active-trail]'),
          trailStep = $carouselNavList.children().first().outerWidth();

      $carousel.carousel({
        interval: 10000
      });

      $carousel.on('slide.bs.carousel', function (e) {
        $activeTrail.css('width', $(e.relatedTarget).index() * trailStep);
      });
    });
  };

  $.fn.trailBsCarousel();

});