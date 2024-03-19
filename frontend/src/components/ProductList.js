import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    let result = await fetch("http://localhost:5000/products",
    {
        headers:
        {
            authorization :`barear ${ JSON.parse(localStorage.getItem('token'))}`
        }
    });
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "delete",
      headers: {
        authorization: `barear ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result)
     {
        alert("record is deleted")
      getProduct();
    }
   }; 
    


    const productSearch = async(event)=>{
        let key=event.target.value;
        if(key)
        {
            let result=await fetch(`http://localhost:5000/search/${key}`,{
                headers: {
        authorization: `barear ${JSON.parse(localStorage.getItem("token"))}`,
      },
            });
        result=await result.json();
        if(result)
        {
            setProducts(result);
        }
        }
        else{
            getProduct();
        }
  };

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <input type="text" placeholder="Search Product" className="seach-box" 
      onChange={productSearch}
      />
      <ul>
        <li>S. No</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Company</li>
        <li>Operation</li>
      </ul>

      {products.length>0 ? products.map((item, index) => (
        <ul key={item._id}>
          <li>{index + 1}</li>
          <li>{item.name}</li>
          <li>{item.price}</li>
          <li>{item.category}</li>
          <li>{item.company}</li>
          <li>
            <button onClick={() => deleteProduct(item._id)}>DELETE</button>
            <Link to={"/update/" + item._id}>Update</Link>
          </li>
        </ul>
      ))
    :
    <h1>No Result Found</h1>
    }
      

      
    </div>
  );
};

export default ProductList;
