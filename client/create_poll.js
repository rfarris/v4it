Template.landing.helpers({
  polls: function() { return Polls.find({}, {sort: {timestamp: -1}}); }
});

Template.landing.events({
  'click #create_button': function(event) {
    var fragment = Meteor.render(function() {
      return Template.create();
    });
    $(event.target).parent().html(fragment);
    $("#name").focus();

    $("#create_submit").click(function() {
      var name = $("#name").val();
      var description = $("#description").val();
      var pollId = Meteor.call('create_poll', name, description);
      window.location = "/polls/" + pollId;

      // var _id = null;
      // Polls.insert({timestamp: new Date, name: name, description: description, options: []}, function(err, id) {
      //   if (err) {
      //     console.log('Error creating poll: ' + err);
      //     return false;
      //   }
      //   _id = id;
      //   window.location = "/polls/" + _id;
      // });
      return false;
    });

    return false;
  }
})