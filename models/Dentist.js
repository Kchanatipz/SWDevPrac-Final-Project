const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
    },
    yearsOfExperience:{
        type:int, 
        required:true
    },
    expertise:{
        type:String,
        required:true
    }
  },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
);

// //cascade delete appointments when a hospital is deleted
// HospitalSchema.pre('deleteOne',{document:true,query:false},async function(next){
//   console.log(`Appointments being removed from hospital ${this._id}`);
//   await this.model('Appointment').deleteMany({hospital:this._id});
//   next();
// });

//Reverse populate with virtuals
// HospitalSchema.virtual("appointments", {
//   ref: "Appointment",
//   localField: "_id",
//   foreignField: "hospital",
//   justOne: false,
// });
module.exports=mongoose.model('Dentist',DentistSchema); //for other files to use