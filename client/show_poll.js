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

var fn_is_owner = function() {
  if (is_admin()) {
    return true;
  }

  var poll = Polls.findOne(Session.get('poll_id'));
  if (Meteor.user().username == poll.owner) {
    return true;
  }
  return false;
}


Template.poll.helpers({
  template_by_type: function() {
    if (this.type == "simple") {
      return Template.simple(this);
    } else if (this.type == "ranked") {
      return Template.ranked(this);
    }

    return "<h3>Not implemented.</h3>";
  }
});

Template.poll.events({
  'blur #new_poll, keyup #new_poll' : function(event) {
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
        return false;
      }
    }
    Polls.update(Session.get('poll_id'), {$push: { options: { _id: id, name: event.target.value, votes: 0 }}});
    event.target.value = "";
  }
});


// Default polls

Template.simple.helpers({
  percent_votes: fn_percent_votes,
  votes: fn_votes,
  voted_for: fn_voted_for,
  is_owner: fn_is_owner
});

Template.simple.events({
  'click .vote-options' : function(event) {
    var poll = Polls.findOne(Session.get('poll_id'));
    var vote = Votes.findOne({voter: user_id()});
    var options = [];
    if (vote && vote.options) { options = vote.options; }
  
    if (poll.allowed_votes == 1) {
      // allow vote to override previous vote for single voting.
      if ($.inArray(this._id, options) >= 0) {
        options = [];
      } else {
        options = [this._id];
      }
    } else if ($.inArray(this._id, options) >= 0) {
      // otherwise, require clicking a selected option to deselect
      options.splice($.inArray(this._id, options), 1);
    } else {
        options.push(this._id);
    }
    Meteor.call('vote', Session.get('poll_id'), options);
    return false;
  }
});

Template.simple.events({
  'click #save_options' : function(event) {
    var votes = parseInt($("#allowed_votes").val(), 10);
    var editable = $("#editable").is(":checked");
    Meteor.call('save_options', Session.get('poll_id'), votes, editable);
    return false;
  }
});


// ranked 


Template.ranked.helpers({
  is_owner: fn_is_owner,
  has_not_voted: function() {
    if (Votes.findOne({poll: Session.get('poll_id'), voter: user_id()})) {
      return false;
    }
    return true;
  },

  sorted_scores: function() {
    var votes = Votes.find({}).fetch();
    var poll = Polls.findOne(Session.get('poll_id'));
    var total = poll.options.length;
    
    // tally scores for every option.
    results = [];

    var totalPoints = 0;
    for (var i=0; i < poll.options.length; i++) {
      var result = {};
      result.score = 0;
      result.name = poll.options[i].name
      for (var j=0; j < votes.length; j++) {
        var index = $.inArray(poll.options[i]._id, votes[j].options);
        if (index >= 0) {
          result.score = result.score + total - index;
        }
      }
      totalPoints += result.score;
      results.push(result);
    }

    for (var i=0; i < results.length; i++) {
      results[i].percent_score = Math.round((results[i].score / totalPoints) * 100);
    }

    results.sort(function(a, b) {
      if (a.score == b.score) { return 0; }
      if (a.score > b.score) { return -1; }
      if (a.score < b.score) { return 1; }
    });
    
    var html = "";
    for (var i=0; i < results.length; i++) {
      // TODO figure out why it isn't reactive.
      // html = html + Template.ranked_item(results[i]);

      html += '<li class="list-group-item">' + results[i].name + '<div class="progress" style="float: right; width:25%"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + results[i].percent_score + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + results[i].percent_score + '%" /></div><span class="badge" style="float: right; margin-right: 5px">' + results[i].score + '</span></li>';

    }
    return html;
  }
});

Template.ranked.events({
  'click #save_options' : function(event) {
    var votes = parseInt($("#allowed_votes").val(), 10);
    var editable = $("#editable").is(":checked");
    Meteor.call('save_options', Session.get('poll_id'), votes, editable);
    return false;
  },

  'click #save_ranking': function(event) {
    var options = [];
    $("#sortable > li").each(function() {
      options.push(parseInt($(this).attr('id'), 10));
    });
    Meteor.call('vote', Session.get('poll_id'), options);
    return false;
  },

  'click #revote': function(event) {
    Meteor.call('delete_vote', Session.get('poll_id'));
    return false;
  }
});

Template.ranked.rendered = function() {
  $("#sortable").sortable();
  $("#sortable").disableSelection();
};