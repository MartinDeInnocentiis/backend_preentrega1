import express from "express";
import productRouter from "./router/products.router.js"
import cartRouter from "./router/cart.router.js"


const app = express(); //SE CREA UNA INSTANCIA DE EXPRESS
const PORT = 8080; //SE DEFINE EL NUMERO DE PUERTO EN EL CUAL SE EJECUTARÁ EL SERVIDOR

//SE CREA LA RUTA PRINCIPAL QUE DEVUELVE "HELLO WORLD" AL ACCEDER A ELLA
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"))

//INICIAMOS EL SERVIDOR EN EL PUERTO ESPECIFICADO
app.listen(PORT, () => {
  console.log("Hi there! Server is running on port..." + PORT);
});