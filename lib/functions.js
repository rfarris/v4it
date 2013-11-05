mongofy = function(str) {
  return str.replace("$", "\uff04").replace(".", "\uff0e");
}

demongofy = function(str) {
  return str.replace("\uff04", "$").replace("\uff0e", ".");
}

user_id = function() {
  if (Meteor.user()) {
    return Meteor.user().username;
  } else {
    return 'anonymous';
  }
}

is_admin = function() {
	// TODO use Roles.*
	if (Meteor.user() && Meteor.user().username == 'rfarris@gmail.com') {
		return true;
	}
	return false;
}