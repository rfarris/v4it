Template.landing.helpers({
  polls: function() { return Polls.find({}, {sort: {timestamp: -1}}); },

  slogan: function() {
    var patronizingSlogans = [
      "Choose from one of the classy polls below.",
      "Everyone wants to know what you think.",
      "Your contributions raise the tone of discorse.",
      "Democracy drives the world forward.",
      "Your input drives the process.",
      "Don't keep others waiting on your valuable insights.",
      "An opinion is all you need to contribute.",
      "Voices in harmony.",
      "Fuck you.",
      "Engagement begets enlightenment."
      ];
    var index = Math.floor(Math.random() * patronizingSlogans.length);
    return patronizingSlogans[index];
  }
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
      if (name.length == 0) { return false; }
      var description = $("#description").val();
      var type = $("#type option:selected").attr('id');
      Meteor.call('create_poll', name, description, type, function(err, pollId) {
          window.location = "/polls/" + pollId;
      });
      return false;
    });

    return false;
  }
})