Meteor.methods({
  vote: function(poll_id, options) {
    check(poll_id, String);
    check(options, [Number]);

    var poll = Polls.findOne(poll_id);
    if (poll.type == 'simple' && poll.allowed_votes && options.length > poll.allowed_votes) { 
      console.log('too many votes.  ignoring.');
      return; 
    }

    var userId = user_id();
    Votes.upsert({voter: userId, poll: poll_id}, {$set: {options: options, created: new Date()}});
  },

  delete_vote: function(poll_id) {
    check(poll_id, String);
    var removed = Votes.remove({poll: poll_id, voter: user_id()});
    console.log('removed: ' + removed + ", " + poll_id + ", " + user_id());
  },

  create_poll: function(name, description, type) {
    check(name, String);
    check(description, String);
    check(type, String);
    if (!(type == 'simple' || type == 'ranked')) { throw "Unexpected Type"; }
    var id = Polls.insert({
      name: name,
      description: description,
      type: type,
      allowed_votes: 1,
      owner: Meteor.userId(),
      created: new Date(),
      editable: true,
      options: [] 
    });
    console.log("Created poll: " + id);
    return id;
  },

  delete_poll: function(pollId) {
    check(pollId, String);
    var poll = Polls.findOne(pollId);
    if (!is_admin()) {
      var poll = Polls.findOne(pollId);
      if (poll.owner != Meteor.user().username) {
        throw "Not allowed to delete";
      }
    }
    Polls.remove({_id: pollId});
  },

  save_options: function(pollId, allowed_votes, editable) {
    check(pollId, String);
    check(allowed_votes, Number);
    check(editable, Boolean);

    if (!is_admin()) {
      var poll = Polls.findOne(pollId);
      if (poll.owner != Meteor.user().username) {
        throw "Not allowed to edit options";
      }
    }
    Polls.update(pollId, {$set: {allowed_votes: allowed_votes, editable: editable}});
  },

  debug_reset: function() {
    Polls.remove({});
    Votes.remove({});
    // Meteor.users.remove({});
  },

  debug_delete_user: function(userId) {
    Meteor.users.remove({_id: userId});
  }
});


Meteor.publish("votes", function(pollId) {
  var votes = Votes.find({poll: pollId});
  return votes;
});

Meteor.publish("polls", function() {
  return Polls.find({}, {sort: {timestamp: -1}});
});

Meteor.publish("txt", function() {
  return Txt.find({});
});

Meteor.publish(null, function() {
  return Meteor.users.find({},{fields: {profile: 1, username: 1, emails: 1, 'services.google.email': 1}});   
});

var anonymous = function(user_id) {
  if (user_id == null) {
    return true;
  }
  return false;
}

Polls.allow({
  insert: function(userId, poll) {
    if (anonymous(userId)) { return false; }
    return true;
  },

  update: function(userId, poll, fieldNames, modifier) {
    if (anonymous(userId)) { return false; }
    return true;
  },

  remove: function(userId, doc) {
    if (anonymous(userId)) { return false; }
    return true;
  }
});

Accounts.onCreateUser(function(options, user) {
  try {
    user.username = user.services.google.email;
    return user;
  } catch(err) {
    console.log("Error on account creation: " + err + ", " + JSON.stringify(options, undefined, 2));
  }
});
