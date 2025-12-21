const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  // For bulk or single creation we sometimes store a flattened single student's data
  studentName: String,
  students: [
    {
      name: String,
      course: String,
      position: String,
      email: String
    },
  ],

  customTitleText: String,
  customTitleImageUrl: String,
  titleOverride: String,
  description: String,
  bodyText: String,

  collegeDescription: String,
  introLeft: String,
  introRight: String,
  eventDescription: String,
  studentCollege: String,
  department: String,
  school: String,
  templateKey: { type: String, default: "classic" },
  collegeName: String,
  collegeAddress: String,
  logos: [String],
  signatories: [
    {
      name: String,
      designation: String,
      signatureUrl: String,
      email: String,
      phone: String,
      department: String
    },
  ],
  backgroundUrl: String,
  textBlocks: [
    {
      label: String,
      value: String,
      bold: Boolean,
      underline: Boolean,
      align: { type: String, enum: ["left","center","right"], default: "left" },
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      fontFamily: String
    }
  ],

  styles: {
    collegeStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    },
    collegeDescStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    },
    titleStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    },
    nameStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    },
    introStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    },
    eventDescStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    },
    signatoryStyle: {
      fontFamily: String,
      fontSize: Number,
      lineHeight: Number,
      width: Number,
      align: { type: String, enum: ["left","center","right"] },
      marginTop: Number,
      marginBottom: Number
    }
  },
  fontFamily: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
