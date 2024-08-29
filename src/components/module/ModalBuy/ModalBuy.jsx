import React, { useState } from 'react'
import Input from '../Input/Input'
import styles from './Modal.module.css'
import { MdOutlineDone } from "react-icons/md";
import { Col } from 'react-bootstrap';
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function ModalBuy({
    showModalBuy,
    setShowModalBuy,
    value,
    setValue,
    addToCartHandler,
    inCart,
    updateCountProduct,
    mainProduct,
    setPropetyId,
    setErrorSelect,
    errorSelect,
    propertyValue,
    setPropertyValue,
    setPropertName,
}) {

    const [infoProduct, setInfoProduct] = useState("")
    const [selectedOption, setSelectedOption] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (newValue >= 0) {
            setValue(newValue);
        }
    };

    const handleChangeUnit = (e) => {
        const selectedPropertyId = e.target.value;
        const selectedProperty = mainProduct.properties.find(item => item.property_id == selectedPropertyId);

        if (selectedProperty) {
            setPropertyValue(selectedProperty.property_value);
            setPropertName(selectedProperty.property_name);
            setInfoProduct(selectedProperty.property_description);
        }

        if (setPropetyId) {
            setPropetyId(selectedPropertyId);
            setErrorSelect(false);
        }

        setSelectedOption(selectedPropertyId);
    };

    const handleConfirmClick = () => {
        if (inCart) {
            updateCountProduct();
        } else {
            addToCartHandler();
        }


        setSelectedOption("");
        setPropertyValue(null);
        setInfoProduct("");
        setPropertName("");
    };

    return (
        <div className={`${styles.modalcontainer} ${showModalBuy ? styles.showmodal : ""}`}>
            {isHovered &&
                infoProduct
                &&
                <div className={styles.infoProduct}>{infoProduct}</div>}
            <div className={styles.modalhide} onClick={() => {
                setShowModalBuy(false)
                setSelectedOption("");
                setPropertyValue(null);
                setInfoProduct("");
                setPropertName("");
            }}>

            </div>
            <div className={styles.modalwrapper}>
                <div className={styles.modalheader}>
                    <span className={styles.model}>{mainProduct.item_code}</span>
                    <span className={styles.name}>{mainProduct.descriptions}</span>
                </div>
                <div className={styles.modalcontent}>
                    <div className={styles.modaldetail}>
                        <Col xs={12} sm={6}>
                            <div style={{ width: "95%", margin: "0 auto" }}>
                                <Input
                                    name="value"
                                    label="مقدار"
                                    value={value}
                                    onChange={handleInputChange}
                                    type="text"
                                />
                            </div>
                        </Col>
                        <Col xs={12} sm={6}>
                            <div style={{ width: "95%", margin: "0 auto" }}>
                                <div className={`${styles.dropvalue_wrapper} mt-4`}>
                                    <label className={styles.labledrop}>واحد</label>
                                    <select
                                        className={styles.dropvalue}
                                        onChange={handleChangeUnit}
                                        value={selectedOption}
                                    >
                                        <option value="" disabled>انتخاب واحد</option>
                                        {
                                            mainProduct?.properties &&
                                            mainProduct.properties.length > 0 &&
                                            mainProduct.properties.map(item => (
                                                <option key={item.property_id} value={item.property_id}>
                                                    {item.property_name} {`(${item.property_value} عدد)`}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            {errorSelect &&
                                <p style={{ color: "red", fontSize: ".8rem", marginTop: "5px" }}>واحد را انتخاب کنید</p>
                            }
                        </Col>
                    </div>
                    <div className='d-flex justify-content-end mt-1'>
                        <IoMdInformationCircleOutline className={styles.iconinfo}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        />
                    </div>
                    <div className={styles.count_product_modal}>
                        <span>مقدار :</span>
                        {
                            value && propertyValue &&
                            <span>{value * propertyValue}</span>
                        }
                    </div>
                    <div className='mt-4 text-center'>
                        <button className={styles.btnconfirm} onClick={handleConfirmClick}>
                            تایید
                            <MdOutlineDone style={{ marginRight: "15px" }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
