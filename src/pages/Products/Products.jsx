
import React, { useEffect, useState, useContext } from 'react'
import styles from "../../styles/Products.module.CSS"
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import SearchBox from '../../components/module/SearchBox/SearchBox'
import { IoIosArrowBack } from "react-icons/io";
import ProductItem from '../../components/module/ProductItem/ProductItem'
import axios from 'axios'
import ModalBuy from '../../components/module/ModalBuy/ModalBuy'
import { CountContext } from '../../context/CartContext'
import swal from 'sweetalert'
import NoneSearch from '../../components/module/NoneSearch/NoneSearch'
import { useNavigate } from 'react-router-dom'


export default function Products() {

  const [search, setSearch] = useState("")
  const [showmodal, setShowmodal] = useState(false)
  const [value, setValue] = useState(1)
  const [showModalBuy, setShowModalBuy] = useState(false)
  const [mainProduct, setMainProduct] = useState("")
  const [products, setProducts] = useState("")
  const [filterProduct, setFilterProduct] = useState([])
  const [propetyId, setPropetyId] = useState(null)
  const [errorSelect, setErrorSelect] = useState(false)
  const [propertyValue, setPropertyValue] = useState(null)
  const [propertName, setPropertName] = useState(null)
  const { setCountProduct } = useContext(CountContext)
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL;

  const gotocart = () => {
    navigate("/cart")
  }


  const getAllProducts = async () => {

    const access = localStorage.getItem("access")
    const headers = {
      Authorization: `Bearer ${access}`
    };
    try {
      const response = await axios.get(`${apiUrl}/app/get-products/`, {
        headers,
      })

      if (response.status === 200) {
        setProducts(response.data)
        setFilterProduct(response.data)
      }

    } catch (e) {
    }
  }


  const addToCartHandler = () => {

    if (!propetyId) {
      setErrorSelect(true)
      return false
    }
    else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length) {
        const isInCart = cart.some(item => item.id == mainProduct.id);

        if (isInCart) {
          cart.forEach((item) => {
            if (item.id == mainProduct.id) {
              item.count = Number(item.count) + Number(value);
              item.property_id = propetyId
              item.properties = mainProduct.properties,
                item.property_value = propertyValue,
                item.property_name = propertName
            }
          });
          localStorage.setItem("cart", JSON.stringify(cart));
          swal({
            title: "به سبد سفارش اضافه شد",
            icon: "success",
            button: "باشه"
          })

        }
        else {

          const cartItem = {
            id: mainProduct.id,
            item_code: mainProduct.item_code,
            count: Number(value),
            descriptions: mainProduct.descriptions,
            img: mainProduct.image,
            property_id: propetyId,
            properties: mainProduct.properties,
            property_value: propertyValue,
            property_name: propertName
          };

          cart.push(cartItem);
          localStorage.setItem("cart", JSON.stringify(cart));
          swal({
            title: "به سبد سفارش اضافه شد",
            icon: "success",
            buttons: "باشه"
          })

        }
      }
      else {
        const cartItem = {
          id: mainProduct.id,
          item_code: mainProduct.item_code,
          count: Number(value),
          descriptions: mainProduct.descriptions,
          img: mainProduct.image,
          property_id: propetyId,
          properties: mainProduct.properties,
          property_value: propertyValue,
          property_name: propertName
        };

        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        swal({
          title: "به سبد سفارش اضافه شد",
          icon: "success",
          buttons: "باشه"
        })

      }

      const countproduct = JSON.parse(localStorage.getItem('cart')).length
      setCountProduct(countproduct)
      setShowModalBuy(false)
    }

  }

  useEffect(() => {
    getAllProducts()
  }, [])


  const searchHandler = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filterProducts = products.filter(
      (product) =>
        product.item_code.includes(searchTerm) ||
        product.descriptions.toLowerCase().includes(searchTerm)
    );

    setFilterProduct(filterProducts);
  };


  return (
    <>

      <div className={styles.wrapperpage}>
        <SideBar />
        <div className={styles.pagecontent}>
          <ModalBuy
            showModalBuy={showModalBuy}
            setShowModalBuy={setShowModalBuy}
            value={value}
            setValue={setValue}
            addToCartHandler={addToCartHandler}
            mainProduct={mainProduct}
            setPropetyId={setPropetyId}
            errorSelect={errorSelect}
            setErrorSelect={setErrorSelect}
            propertyValue={propertyValue}
            setPropertyValue={setPropertyValue}
            setPropertName={setPropertName}
          />

          <div className={`${styles.modalcontainer} ${showmodal ? styles.show : ""}`}>
            <div className={styles.modalhide} onClick={() => setShowmodal(false)}></div>
            <div className={styles.modalcontent}>
              <p>هنوز محصولی به سفارش اضافه نکرده اید</p>
              <button className={styles.modalbtn} onClick={() => setShowmodal(false)}>متوجه شدم</button>
            </div>
          </div>
          <Header title={"محصولات"} />
          <div className={styles.maincontent}>
            <div className={styles.wrapper}>
              <SearchBox
                value={search}
                onChange={searchHandler}
                placeholder={"جستوجو براساس کدکالا , شرح محصول"}
              />
            </div>
            <div className={styles.ProductsPage}>
              <div className={styles.ProductsBox}>
                {
                  filterProduct.length > 0 ?
                    filterProduct.slice().reverse().map(product => (
                      <ProductItem
                        product={product}
                        key={product.id}
                        setShowModalBuy={setShowModalBuy}
                        setMainProduct={setMainProduct}
                      />

                    )) :
                    <>
                      <NoneSearch />
                    </>
                }

              </div>

              <div className={`${styles.wrapper_btn}`}>
                <button className={styles.ButtonBox} onClick={gotocart}>
                  <span>ادامه</span>
                  <IoIosArrowBack />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div >
    </>
  )
}

