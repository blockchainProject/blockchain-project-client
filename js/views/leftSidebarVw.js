'use strict';

var __ = require('underscore'),
     loadTemplate = require('../utils/loadTemplate'),
    app = require('../App.js').getApp(),
    baseVw = require('./baseVw')

module.exports = baseVw.extend({

  el: '#leftSidebar',

  events:{
  'click .leftSidebar-browse': 'navRefreshClick'
  },

  initialize: function(options){
    this.options = options || {};
    /* recieves socketView and userProfile from main.js */
    this.socketView = options.socketView;
    this.userProfile = options.userProfile;
  },

  navRefreshClick: function(){
    app.router.refresh();
  },


  render: function(){
    var self = this;

    loadTemplate('./js/templates/leftSidebar.html', function(loadedTemplate) {
      self.$el.html(loadedTemplate(
        __.extend(self.model.toJSON())
      ));
    })
    return this;    
  }
});
