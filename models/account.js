module.exports = (mongoose) => {
    const accountSchema = mongoose.Schema({
      sub: {
        type: String
      },
      listings: {
        type: [String]
      },
    });
  
    return mongoose.model('accounts', accountSchema);
};