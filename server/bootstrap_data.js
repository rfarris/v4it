if (Meteor.isServer) {
	Meteor.startup(function() {
    if (Polls.find().count() == 0) {
      var polls = [
        {
          name: 'Test',
          description: 'Does this application work?',
          timestamp: new Date,
          editable: false,
          type: 'simple',
          allowed_votes: 1,
          options: [
          {_id: 1, name: 'Yes'},
          {_id: 2, name: 'No'}
        ]}
      ];
      _.each(polls, function(poll) {
        Polls.insert(poll);
      });
    }

    var patronizingSlogans = [
      "Choose from one of the classy polls below.",
      "Everyone wants to know what you think.",
      "Your contributions raise the tone of discorse.",
      "Democracy moves the world forward.",
      "Your input drives the process.",
      "Don't keep others waiting on your valuable insights.",
      "An opinion is all you need to contribute.",
      "Voices in harmony.",
      "Engagement begets enlightenment.",
      "WTF happened to my screwdrivers?!",
      "What's on your mind?",
      "This might work.",
      "Your feedback is appreciated.",
      "This is your chance to improve the world.",
      "Get what you want from life.",
      "I can just type stuff here.",
      "<Blank>"
      ];
    _.each(patronizingSlogans, function(txt) {
      Txt.upsert({txt: txt}, {$set: {txt: txt}});
    });
});
}