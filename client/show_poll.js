Template.poll.helpers({
  poll: function() { return Polls.findOne(Session.get('poll_id')); }
});

Template.poll.helpers({
  percent_votes: function() {
    var total_votes = Votes.find({}).count();
    var option_votes = Votes.find({option: this._id}).count();
    return Math.round((option_votes/total_votes) * 100);
  },

  votes: function() {
    var votes = Votes.find({option: this._id}).count();
    console.log("votes: " + votes + ", " + this._id + ", " + Session.get('poll_id'));
    return votes;
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
  },
  
  'click .vote-options' : function(event) {
    var option_id = this._id;
    check(option_id, Number);
    Meteor.call('vote', Session.get('poll_id'), option_id);
    return false;
  }
});
