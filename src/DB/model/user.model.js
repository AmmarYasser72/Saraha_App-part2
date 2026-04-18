export const users = [
  {
	otpHash: String,
	otpExpiresAt: Date,
	isVerified: { type: Boolean, default: false },
	type: String,
  	default: "user"
  }
]
