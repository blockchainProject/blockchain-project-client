'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    app = require('../App.js').getApp(),
    loadTemplate = require('../utils/loadTemplate'),
    baseVw = require('./baseVw'),
    userModel = require('../models/userMd'),
    pageVw = require('./pageVw'),
    userProfileModel = require('../models/userProfileMd');

module.exports = baseVw.extend({

// should this be pageVw?

  className: "flexCol-6",

  events: {
    'click .js-item': 'itemClick',
    'click .js-about': 'aboutClick',
    'click .js-itemShortEdit': 'editItemClick',
    'click .js-itemShortDelete': 'deleteItemClick',
    'click .js-itemShortDeleteConfirm': 'deleteItem',
    'click .js-itemShortDeleteCancel': 'cancelConfirmDelete',
    'click .js-itemShortClone': 'cloneItemClick',
    'click .js-message': 'sendMessage'
  },

  initialize: function(options){
    //pre-load image
    this.parentEl = $(options.parentEl);
    this.userProfile = new userProfileModel();
    this.userModel = new userModel();
    this.userProfile.urlRoot = this.userModel.get('serverUrl') + "profile";
    this.listenTo(this.model, 'change', this.render);
    //if price has already been set, render
    if (this.model.get('priceSet') !== 0){
      this.render();
    }

    //store avatar reference in localStorage for other views
    var localAvatar = this.model.get('avatarURL') || this.model.get('serverUrl')+"get_image?hash="+this.model.avatar_hash+"&guid="+this.model.get('guid');
    localAvatar && localStorage.setItem('userAvatar-'+this.model.get('guid'), localAvatar);

    this.listenTo(window.obEventBus, "followUser", function(options){
      if (options.view === this || options.guid !== this.model.get('guid')) {
        return;
      }

      this.model.set('ownFollowing', true);
    });

    this.listenTo(window.obEventBus, "unfollowUser", function(options){
      if (options.view === this || options.guid !== this.model.get('guid')) {
        return;
      }

      this.model.set('ownFollowing', false);
    });

    this.listenTo(window.obEventBus, "blockingUser", function(e){
      if (e.guid == this.model.get('guid')) {
        this.model.set('isBlocked', true);
      }      
    });

    this.listenTo(window.obEventBus, "unblockingUser", function(e){
      if (e.guid !== this.model.get('guid')) {
        this.model.set('isBlocked', false);
      }      
    });
  },

  render: function(){
    var self = this;
    loadTemplate('./js/templates/itemShort.html', function(loadedTemplate) {
      self.$el.html(loadedTemplate(self.model.toJSON()));

      //append the view to the passed in parent
      self.parentEl.append(self.$el);

      if($(".js-list3").closest(".js-store").length ) {
          $(".js-store .js-list3 .flexCol-6").toggleClass('flexCol-6 flexCol-12');
          $(".js-store .js-list3 .homeFeedChatButton").css("display", "none");
          $(".js-store .js-list3 .gridItemControls").css("width", "600px");
          $(".js-store .js-list3 .flexCol-12 .gridItemControls").each(function() {
            $(this).prepend( $(this).siblings().find(".itemPrice .itemPriceTag") );
          });
          $(".itemPriceTag").css({"color": "#030303", "background-color": "#FFF", "position": "relative", "top": "72px", "margin-left": "8px" });
      }
    });
    return this;
  },

  itemClick: function(){
    var skipNSFWmodal = this.model.get('skipNSFWmodal') ? "/" + this.model.get('skipNSFWmodal') : "";
    Backbone.history.navigate('#userPage/'+this.model.get('userID')+'/listing/'+this.model.get('contract_hash') + skipNSFWmodal, {trigger: true});
  },

  aboutClick: function(){
    Backbone.history.navigate('#userPage/'+this.model.get('userID')+'/about', {trigger: true});
  },

  editItemClick: function(){
    window.obEventBus.trigger('itemShortEdit', {'contract_hash': this.model.get('contract_hash')});
  },

  deleteItemClick: function(e){
    this.$(e.target).closest('.gridItemControls').find(".js-deleteOverlay").addClass("fadeIn");
  },

  cancelConfirmDelete: function(e){
    e.stopPropagation();
    this.$(e.target).closest('.gridItemControls').find(".js-deleteOverlay").removeClass("fadeIn");
  },

  deleteItem: function(){
    window.obEventBus.trigger('itemShortDelete', {'contract_hash': this.model.get('contract_hash')});
  },

  cloneItemClick: function() {
    window.obEventBus.trigger('itemShortClone', {'contract_hash': this.model.get('contract_hash')});
  },

  sendMessage: function(){
    app.chatVw.openConversation(
      new userProfileModel(this.userProfile.get('profile'))
    );
  },

  isRemoved: function() {
    return this._removed;
  }

});
