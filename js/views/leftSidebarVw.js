'use strict';

var __ = require('underscore'),
    Backbone = require('backbone'),
    loadTemplate = require('../utils/loadTemplate'),
    app = require('../App.js').getApp(),
    baseVw = require('./baseVw')

module.exports = baseVw.extend({

  el: '#leftSidebar',

  events:{
  'click .leftSidebar-browse-title': 'navRefreshClick',
  'click .leftSidebar-create .leftSidebar-create-create': 'createListing'
  },

  initialize: function(options){
    this.options = options || {};
    /* recieves socketView and userProfile from main.js */
    this.socketView = options.socketView;
    this.userProfile = options.userProfile;
    this.userModel = options.userModel;
  },

  navRefreshClick: function(){
    app.router.refresh();
  },

  createListing: function(){
    Backbone.history.navigate('#userPage/'+this.userModel.get('guid')+'/listingNew', {trigger: true});
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
