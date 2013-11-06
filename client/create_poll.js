Template.landing.helpers({
  polls: function() { return Polls.find({}, {sort: {timestamp: -1}}); },

  slogan: function() {
    if (Txt.find({}).count() == 0) { return }
    var index = Math.floor(Math.random() * Txt.find({}).count());
    return Txt.findOne({}, {skip: index}).txt;
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