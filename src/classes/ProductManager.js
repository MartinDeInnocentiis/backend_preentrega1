import utils from "../utils.js";
import crypto from "crypto";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }


  async addProduct(product) {
    const {title, description, price, thumbnail, code, stock} = product;
    if (
      title == undefined ||
      description == undefined ||
      price == undefined ||
      code == undefined ||
      stock == undefined
    ) {
      throw new Error("All the fields must be filled, except thumbnail.");
    }
    try {
      let data = await utils.readFile(this.path);
      this.products = data?.length > 0 ? data : [];
    } catch (error) {
      console.log(error);
    }

    let codeExists = this.products.some((dato) => dato.code == code);

    if (codeExists) {
      throw new Error("Entered code already exists.");
    } else {
      let data = await utils.readFile(this.path);

      const newProduct = {
        id: data?.length ? data.length +1 : 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(newProduct);
      try { 
        await utils.writeFile(this.path, this.products);
      } catch (error) {
        console.log(error);
      }
    }
  }


  async getProducts() {
    try {
      let data = await utils.readFile(this.path);
      this.products =  data;
      return data?.length > 0 ? this.products : "No products found so far...";
    } catch (error) {
      console.log(error);
    }
  }


  async getProductById(id) {
    try {
      let data = await utils.readFile(this.path);
      this.products = data?.length > 0 ? data : [];
      let product = this.products.find((dato) => dato.id === id);

      if (product !== undefined) {
        return product;
      } else {
        return "ERROR: Product is not found.";
      }
    } catch (error) {
      console.log(error);
    }
  }


  async updateProductById(id, data) {
    try {
      let products = await utils.readFile(this.path);
      this.products = products?.length > 0 ? products : [];

      let productIndex = this.products.findIndex((dato) => dato.id === id);
      if (productIndex !== -1) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          ...data,
        };
        await utils.writeFile(this.path, products);
        return {
          mensaje: "Product updated successfully.",
          producto: this.products[productIndex],
        };
      } else {
        return { mensaje: "ERROR: Product is not found." };
      }
    } catch (error) {
      console.log(error);
    }
  }


  async deleteProductById(id) {
    try {
      let products = await utils.readFile(this.path);
      this.products = products?.length > 0 ? products : [];
      let productIndex = this.products.findIndex((dato) => dato.id === id);
      if (productIndex !== -1) {
        let product = this.products[productIndex];
        this.products.splice(productIndex, 1);
        await utils.writeFile(this.path, products);
        return { mensaje: "Product has been deleted successfully.", producto: product };
      } else {
        return { mensaje: "ERROR: Product is not found." };
      }
    } catch (error) {
      console.log(error);
    }
  }
}


export default {
  ProductManager,
};