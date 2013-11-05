if (Meteor.isServer) {
	Meteor.startup(function() {
    if (Polls.find().count() == 0) {
      var polls = [
        {
          name: 'Test',
          description: 'Does this application work?',
          timestamp: new Date,
          editable: false,
          options: [
          {_id: 1, name: 'Yes'},
          {_id: 2, name: 'No'}
        ]}
      ];
      _.each(polls, function(poll) {
        Polls.insert(poll);
      });
    }
});
}