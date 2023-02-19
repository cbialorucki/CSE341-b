module.exports = (mongoose) => {
    const productSchema = mongoose.Schema({
      title: {
        type: String
      },
      qty: {
        type: Number
      },
      description: {
        type: String
      },
      price: {
        type: Number
      },
      rating: {
        type: Number
      },
      sid: {
        type: String
      },
    });
  
    return mongoose.model('product', productSchema);
};