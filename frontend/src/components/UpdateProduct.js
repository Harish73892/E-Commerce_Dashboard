import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [company, setCompany] = React.useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetail();
  },[]);

  const getProductDetail = async () => {
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      headers: {
        authorization: `barear ${JSON.parse(localStorage.getItem("token"))}`
      }
    });
    result = await result.json();
    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };


  const updateProduct = async () => {
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      method: "put",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "content-type": "application/json",
        authorization: `barear ${JSON.parse(localStorage.getItem("token"))}`
      }
    });
    if (result) {
      navigate("/");
    }

  };
  return (
    <div className="product">
      <h1 className="update-product-h1">Update Product</h1>
      <input
        type="text"
        placeholder="Enter Product Name"
        className="inbox"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Product Price"
        className="inbox"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Product Category"
        className="inbox"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Product Company"
        className="inbox"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <button className="signupBotton" onClick={updateProduct}>
        Update
      </button>
    </div>
  );
};

export default UpdateProduct;
