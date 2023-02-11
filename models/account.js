module.exports = (mongoose) => {
    const accountSchema = mongoose.Schema({
      username: {
        type: String
      },
      actualName: {
        type: String
      },
      email: {
        type: String
      },
      password: {
        type: String
      },
      items: {
        type: Array
      },
      privileges: {
        type: String
      },
    });
  
    return mongoose.model('accounts', accountSchema);
};