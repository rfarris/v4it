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
      var type = $("#type option:selected").attr('id');
      Meteor.call('create_poll', name, description, type, function(err, pollId) {
          console.log("new id: " + pollId);
          window.location = "/polls/" + pollId;
      });
      return false;
    });

    return false;
  }
})