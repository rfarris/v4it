// just for reference.  not used:

var polls = {
	_id: String,
	name: String,
  description: String,
  type: String, // simple, ranked
  allowed_votes: Number, // simple
  options: [
    {
      _id: Number,
      name: String
    }
  ],
  editable: Boolean,
  owner: String,
  created: Date
}

var votes = {
  _id: String,
  poll: String,
  options: [Number],
  voter: String,
  created: Date
}