import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin'],
    required: true,
    default: 'admin'
  }
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre("save", function (next) {
  if (!this.isModified("email")) return next();
  this.email = this.email.toLowerCase();
  next();
});

userSchema.methods.isSamePassword = async function (password){
    return await bcrypt.compare(password, this.passwordHash)
}

const User = mongoose.model("User", userSchema);

export default User;