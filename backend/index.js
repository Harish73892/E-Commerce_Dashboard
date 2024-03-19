const express = require("express");
require("./db/config");
const cors = require("cors");
const User = require("./db/user");
const Product = require("./db/Product");
const Jwt = require("jsonwebtoken");

const JwtKey = "e-comm";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;

  Jwt.sign({result},JwtKey,{expiresIn:"2h"},(err,token)=>{
    if(err){
        res.send({result:"Something went wrong, Please try after sometime"})
    }
    else{
        res.send({result,auth:token});
    }
  })
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, JwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({
            result: "Something went wrong , Please try after sometime",
          });
        } else {
          res.send({ user, auth: token });
        }
      });
    } else {
      res.send("User not found");
    }
  } else {
    res.send("User not found");
  }
});

app.post("/add-product", verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/products", verifyToken, async (req, res) => {
  let product = await Product.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ key: "Products not found" });
  }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "Data not found" });
  }
});

app.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (result) {
    res.send("data updated");
  } else {
    res.send("not updated");
  }
});

app.get("/search/:key", verifyToken,async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { userId: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  if (result) {
    res.send(result);
  }
});

function verifyToken(req,res,next){
    let token=req.headers['authorization'];
    if(token){
        token = token.split(" ")[1];
        Jwt.verify(token,JwtKey,(err,valid)=>{
            if(err)
            {
                res.status(401).send({result : "Please provide vslid token"})
            }
            else{
                next();
            }
        })
    }
    else{
        res.status(403).send({result: "Please enter token in header"})
    }
};

app.listen(5000);
