'use strict';

var __ = require('underscore'),
    Backbone = require('backbone'),
    loadTemplate = require('../utils/loadTemplate'),
    app = require('../App.js').getApp(),
    baseVw = require('./baseVw')

module.exports = baseVw.extend({

  el: '#leftSidebar',

  events:{
  'click .leftSidebar-create .leftSidebar-create-create': 'createListing',
  'click .leftSidebar-create .leftSidebar-create-edit': 'editListing'
  },

  initialize: function(options){
    this.options = options || {};
    /* recieves socketView and userProfile from main.js */
    this.socketView = options.socketView;
    this.userProfile = options.userProfile;
    this.userModel = options.userModel;
  },

  createListing: function(){
    Backbone.history.navigate('#userPage/'+this.userModel.get('guid')+'/listingNew', {trigger: true});
  },

  editListing: function(){
    Backbone.history.navigate('#userPage/'+this.userModel.get('guid')+'/store', {trigger: true});
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
