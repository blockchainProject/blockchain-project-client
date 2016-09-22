'use strict';

var __ = require('underscore'),
    loadTemplate = require('../utils/loadTemplate'),
    baseVw = require('./baseVw');

module.exports = baseVw.extend({

  className: "flexRow borderBottom",

  events: {
    'mouseover .js-rating-detail': 'mouseoverRatingDetail',
    'mouseout .js-rating-detail': 'mouseoutRatingDetail'    
  },

  initialize: function(options){
    if (!options.model) {
      throw new Error('Please provide a model.');
    }
  },

  render: function(){
    var self = this;

    loadTemplate('./js/templates/review.html', function(loadedTemplate) {
      loadTemplate('./js/templates/ratingStars.html', function(starsTemplate) {
        self.$el.html(
          loadedTemplate(
            __.extend({}, self.model.toJSON(), { starsTmpl: starsTemplate })
          )
        );
      });
    });

    return this;
  },

  mouseoverRatingDetail:function(){
    this.$('.rating-detail').removeClass('hide').addClass('rating-detail-overlay');
  },

  mouseoutRatingDetail:function(){
    this.$('.rating-detail').removeClass('rating-detail-overlay').addClass('hide');
  }  
});