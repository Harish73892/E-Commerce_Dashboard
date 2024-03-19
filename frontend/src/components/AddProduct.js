import React,{useState,useEffect} from 'react';



const AddProduct=()=>{
    const [name,setName]=React.useState('');
    const [price,setPrice]=React.useState('');
    const [category,setCategory]=React.useState('');
    const [company,setCompany]=React.useState('');
    const[error,setError]=React.useState(false);


    

    const productAdd=async()=>{

        if (!name || !price || !category || !company) {
          setError(true);
          return false;
        }

         let userId=JSON.parse(localStorage.getItem('user'));
        userId=userId._id;
        
        let result = await fetch("http://localhost:5000/add-product",{
            method:'post',
            body:JSON.stringify({name,price,category,userId,company}),
            headers:{
                "content-type":"application/json",
                authorization :`barear ${ JSON.parse(localStorage.getItem('token'))}`

            }
        });
        result=await result.json();
        if(result)
        {
            alert("data is added")
        }


    }
    return(
        <div className='product'>
            <h1 className='add-product-h1'>Add Product</h1>
            <input type='text' placeholder='Enter Product Name' className='inbox'
            value={name} onChange={(e)=>setName(e.target.value)}
            />
            {error && !name && <span className='span-input'> *Enter valid name</span>}

            <input type='text' placeholder='Enter Product Price' className='inbox'
            value={price} onChange={(e)=>setPrice(e.target.value)}
            />
            {error && !price && <span className='span-input'> *Enter valid price</span>}
            
            <input type='text' placeholder='Enter Product Category' className='inbox'
            value={category} onChange={(e)=>setCategory(e.target.value)}
            />
            {error && !category && <span className='span-input'> *Enter valid category</span>}

            <input type='text' placeholder='Enter Product Company' className='inbox'
            value={company} onChange={(e)=>setCompany(e.target.value)}
            />
            {error && !company && <span className='span-input'> *Enter valid company</span>}

            <button className='signupBotton' onClick={productAdd} >
                Add Product
            </button>
        </div>
    )
}

export default AddProduct