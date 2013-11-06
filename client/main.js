// Routes

Meteor.Router.add({
  '/': 'landing',
  '/polls': function() { window.location = "/" },
  '/about': 'about',

  '/polls/:id': function(id) {
    Session.set('poll_id', id);
    return 'poll';
  },
  
  '/debug': 'debug'
});

// Subscriptions
Meteor.startup(function() {
  // get all polls
  Meteor.subscribe('polls');
  Meteor.subscribe('txt');
  // get votes for currently selected poll
  Deps.autorun(function() {
    Meteor.subscribe('votes', Session.get('poll_id'));
  });
});


// Debug

Template.header.helpers({
  admin: function() {
    return is_admin();
  }
});

Template.header.events({
  'click #reset': function(event) {
    Meteor.call('debug_reset');
    return false;
  }
});


Template.debug.helpers({
  json: function() {
    return JSON.stringify(this, undefined, 2);
  },

  polls: function() {
    return Polls.find({}, {sort: {timestamp: -1}});
  },

  user: function() {
    return Meteor.user();
  },

  users: function() {
    return Meteor.users.find({}).fetch();
  }
});

Template.debug.events({
  'click .delete_user_button': function(event) {
    console.log("Delete: " + event.target.id);
    Meteor.call('debug_delete_user', event.target.id);
  }
})