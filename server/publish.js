Meteor.methods({
  vote: function(poll_id, option_id) {
    check(poll_id, String);
    check(option_id, Number);
    var userId = user_id();
    Votes.upsert({voter: userId, poll: poll_id}, {$set: {option: option_id, created: new Date()}});
  },

  create_poll: function(name, description) {
    check(name, String);
    check(description, String);
    return Polls.insert({
      name: name,
      description: description,
      owner: Meteor.userId(),
      created: new Date(),
      editable: true,
      options: [] 
    });
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
  console.log("vote count:" + votes.count() + ", " + pollId);
  return votes;
});

Meteor.publish("polls", function() {
  return Polls.find({}, {sort: {timestamp: -1}});
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

var admin_or_owner = function(userId, doc) {
  
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

console.log("starting");