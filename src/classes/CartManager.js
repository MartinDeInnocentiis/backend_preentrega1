import utils from "../utils.js";

export class CartManager {

    static correlativoId = 0;
    static carts;

    constructor(path) {
      this.carts = [];
      this.correlativoId = 0;
      this.path = path;
    }
  

    async addCart () {
      this.carts = await this.getCarts();
      this.carts.push({
        id: this.carts.length ? this.carts.length : 0,
        products: [],
      });
  
      utils.writeFile(this.path, this.carts);
    };
    
    async getCarts() {
      try {
        let data = await utils.readFile(this.path);
        this.carts =  data;
        return data?.length > 0 ? this.carts : "No carts found so far...";
      } catch (error) {
        console.log(error);
      }
    }
  
    async getCartsById (id) {
      try {
        let data = await utils.readFile(this.path);
        this.carts = data?.length > 0 ? data : [];
        let cart = this.carts.find((dato) => dato.id === id);
  
        if (cart !== undefined) {
          return cart;
        } else {
          return  "You must enter an existing Cart ID.";
        }
      } catch (error) {
        console.log(error);
      }
    };

    getIndexProductFromCart (cart, idProduct) {
      if (cart.products) {
        const productIndex = cart.products.findIndex(
          (x) => x.id === idProduct
        );
        return productIndex;
      }
      return -1;
    };


    async addProductToCart (id, idProduct) {
      this.carts = await this.getCarts();
      let cart = await this.getCartsById(id);
  
      if (!cart) {
        let error = new Error("Cart doesn´t exist.");
        error.statusCode = 400;
        throw error;
      }
      const cartIndex = this.carts.findIndex(
        (cart) => cart.id === id
      );
  
      const productIndex = await this.getIndexProductFromCart(
        cart,
        idProduct
      );
  
      productIndex !== -1
        ? this.carts[cartIndex].products[productIndex].quantity++
        : this.carts[cartIndex].products.push({
            id: idProduct,
            quantity: 1,
          });
  
      utils.writeFile(this.path, this.carts);
      return cart;
    };
}
  

export default CartManager;