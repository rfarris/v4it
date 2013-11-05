// just for reference.  not used:

var polls = {
	_id: String,
	name: String,
  description: String,
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
  option: Number,
  voter: String,
  created: Date
}