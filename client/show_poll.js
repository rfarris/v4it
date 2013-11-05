Template.poll.helpers({
  poll: function() { return Polls.findOne(Session.get('poll_id')); }
});

var fn_percent_votes = function() {
  var total_votes = Votes.find({}).count();
  var option_votes = Votes.find({options: this._id}).count();
  return Math.round((option_votes/total_votes) * 100);
};

var fn_votes = function() {
  var votes = Votes.find({options: this._id}).count();
  return votes;
};

var fn_voted_for = function() {
  var vote = Votes.findOne({voter: user_id()});
  if (vote && $.inArray(this._id, vote.options) >= 0) {
    return true;
  }
  return false
}


Template.poll.helpers({
  template_by_type: function() {
    if (this.type == "single") {
      return Template.single(this);
    }

    return "<h3>Not implemented.</h3>";
  }
});

Template.poll.events({
  'blur, keyup input' : function(event) {
    if (event.keyCode && event.keyCode != 13) {
      return true;
    }
    if (event.target.value == "") {
      return false;
    }
    if (!this.options) {
      this.options = [];
    }

    var id = this.options.length + 1;
    
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].name == event.target.value) {
        console.log("Duplicate option. Ignoring...");
        return false;
      }
    }
    Polls.update(Session.get('poll_id'), {$push: { options: { _id: id, name: event.target.value, votes: 0 }}});
    event.target.value = "";
    console.log("Add new option: " + this.name + "  :  " + event.target.value);
  }
});


// Single option polls

Template.single.helpers({
  percent_votes: fn_percent_votes,
  votes: fn_votes,
  voted_for: fn_voted_for
});

Template.single.events({
  'click .vote-options' : function(event) {
    var option_id = this._id;
    Meteor.call('vote', Session.get('poll_id'), [option_id]);
    return false;
  }
});