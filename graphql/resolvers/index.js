const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
   let events = await Event.find({ _id: { $in: eventIds } });
   try {
      return events.map(event => {
         return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator), date: new Date(event._doc.date).toISOString() }
      });
   } catch (err) {
      throw err;
   };
}

const user = async userId => {
   try {
      let user = await User.findById(userId)
      return {
         ...user._doc,
         _id: user.id,
         createdEvents: events.bind(this, user.createdEvents)
      };
   } catch (err) {
      throw err;
   };
}

module.exports = {
   events: async () => {
      try {
         let events = await Event.find();
         return events.map(event => {
            return {
               ...event._doc,
               _id: event.id,
               creator: user.bind(this, event._doc.creator),
               date: new Date(event._doc.date).toISOString()
            }
         });
      } catch (err) {
         console.log(err);
         throw (err);
      };
   },
   createEvent: async (args) => {
      const event = new Event({
         title: args.eventInput.title,
         description: args.eventInput.description,
         price: +args.eventInput.price,
         date: new Date(args.eventInput.date),
         creator: "5ebf082bc6186a2148a7ad85"
      });
      let createdEvent;
      try {
         let result = await event.save();
         createdEvent = {
            ...result._doc,
            _id: result._doc._id.toString(),
            creator: user.bind(this, result._doc.creator),
            date: new Date(event._doc.date).toISOString()
         };
         const user = await User.findById('5ebf082bc6186a2148a7ad85');
         if (!user) {
            throw new Error('User not found');
         }
         user.createdEvents.push(event);
         await user.save();
         return createdEvents;
      } catch (err) {
         console.log(err);
         throw err;
      };
   },
   createUser: async (args) => {
      try {
         const existingUser = await User.findOne({ email: args.userInput.email });
         if (existingUser) {
            throw new Error('User exists already');
         }
         const hashedPasswrord = await bcrypt.hash(args.userInput.password, 12);
         const user = new User({
            email: args.userInput.email,
            password: hashedPasswrord
         });
         const savedUserResult = await user.save();
         return { ...savedUserResult._doc, password: null, _id: savedUserResult.id }
      } catch (err) {
         console.log(err);
         throw (err);
      };
   }
}