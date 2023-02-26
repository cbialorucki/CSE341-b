module.exports = (mongoose) => {
    const productSchema = mongoose.Schema({
      title: {
        type: String
      },
      qty: {
        type: Number
      },
      shortDesc: {
        type: String
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
      sub: {
        type: String
      },
    });
  
    return mongoose.model('product', productSchema);
};