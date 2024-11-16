import React, { useState, useEffect } from 'react'
import styles from './ModalUser.module.css'
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import Input from '../Input/Input';
import Texteara from '../Texteara/Texteara';
import { Formik } from 'formik'
import Select from '../Select/Select';
import { TbBuildingEstate } from "react-icons/tb";
import axios from 'axios';
import swal from 'sweetalert';

export default function ModalUser({ setShowModal, showModal, userInfo, getUserHandler }) {
    const [isDisableNumber, setIsDisableNumber] = useState(true);
    const [statusBtn, setStatusBtn] = useState(1);
    const [timer, setTimer] = useState(59);
    const [code, setCode] = useState("")
    const [isDisable,setIsDisable]=useState(false)
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        let countdown;
        if (statusBtn === 2) {
            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        setStatusBtn(3);
                        return 59;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [statusBtn]);

    const handleClose = (resetForm) => {
        setShowModal(false);
        resetForm();
    }

    const getSecurityCode = async () => {
        setStatusBtn(2);
        setTimer(59);
        const access = localStorage.getItem("access");
        const headers = {
            Authorization: `Bearer ${access}`,
        };
        try {
            const response = await axios.post(
                `${apiUrl}/user/send-code/`,
                {},
                { headers }
            );
            if (response.status === 200) {
                 setCode(response.data.message);
                setStatusBtn(4)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const chackSecurityCode = async () => {
        const access = localStorage.getItem("access");
        setIsDisable(true)
        const headers = {
            Authorization: `Bearer ${access}`,
        };

        const body = {
            code
        }
        try {
            const response = await axios.post(`${apiUrl}/user/verify-code/`, body, { headers });
            if (response.status === 200) {
                setIsDisableNumber(false);
                setStatusBtn(5)
                swal({
                    title: "کد با موفقیت تایید شد",
                    icon: "success",
                    button: "باشه"
                })
                
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                swal({
                    title: "کد وارد شده نادرست است و یا منقضی شده",
                    icon: "error",
                    button: "باشه"
                })
            } else {
                console.log(error);
            }
        } finally{
                setIsDisable(false)
            }
    }

    const initialValues = {
        full_name: userInfo?.full_name || "",
        phone_number: userInfo?.phone_number || "",
        email: userInfo?.email || "",
        address: userInfo?.address || "",
        state: userInfo?.state || "",
        ...(isDisableNumber ? {} : { code: code || "" })
    };

    return (
        <Formik
            validate={(values) => {
                const errors = {};
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
                if (values.full_name === "") {
                    errors.full_name = "وارد کردن نام و نام خانوادگی اجباری میباشد";
                }
                if (values.phone_number === "") {
                    errors.phone_number = "وارد کردن شماره تلفن اجباری میباشد";
                } else if (!phoneRegex.test(values.phone_number)) {
                    errors.phone_number = "شماره تلفن معتبر نیست";
                }
                if (values.state === "") {
                    errors.state = "وارد کردن استان اجباری میباشد";
                }
                if (values.email === "") {
                    errors.email = "وارد کردن ایمیل اجباری میباشد";
                } else if (!emailRegex.test(values.email)) {
                    errors.email = "ایمیل معتبر نیست";
                }
                if (values.address === "") {
                    errors.address = "وارد کردن آدرس اجباری میباشد";
                }
                return errors;
            }}

            initialValues={initialValues}

            enableReinitialize={true}

            onSubmit={async (values) => {
                try {
                    const access = localStorage.getItem("access");
                    if (!access) {
                        return;
                    }

                    const headers = {
                        Authorization: `Bearer ${access}`,
                    };

                    const response = await axios.put(`${apiUrl}/user/complete-user-informations/`, values, { headers });
                    if (response.status === 200) {
                        getUserHandler();
                        setShowModal(false);
                        setCode("")
                        setIsDisableNumber(true)
                        setStatusBtn(1)
                         swal({
                                title: " ویرایش با موفقیت تایید انجام شد",
                                icon: "success",
                                button: "باشه"
                })
                    }
                } catch (e) {
                    console.log(e);
                }
            }}
        >
            {({ values, handleChange, handleSubmit, setFieldValue, errors, touched, resetForm,isSubmitting }) => {
             
                return (
                    <form onSubmit={handleSubmit}>
                        <div className={`${styles.modalcontainer} ${showModal ? styles.show : ''}`}>
                            <div className={styles.modalclose} onClick={() => handleClose(resetForm)}></div>
                            <div className={styles.modalwrappper}>
                                <div className={styles.modalheader}>
                                    <FaUser />
                                    <span className={styles.infotextm}>اطلاعات من</span>
                                </div>
                                <div>
                                    <Input
                                        name="full_name"
                                        label="نام و نام خانوادگی"
                                        icon={FaUser}
                                        value={values.full_name}
                                        onChange={handleChange}
                                        type={"text"}
                                    />
                                    {errors.full_name && touched.full_name && <span className={styles.errorinput}>{errors.full_name}</span>}
                                </div>
                                <div>
                                    <Input
                                        name="phone_number"
                                        label="شماره تماس"
                                        icon={FaPhone}
                                        value={values.phone_number}
                                        onChange={handleChange}
                                        type={"text"}
                                        disable={isDisableNumber}
                                    />
                                    {errors.phone_number && touched.phone_number && <span className={styles.errorinput}>{errors.phone_number}</span>}
                                </div>
                                <div>
                                    <div className='d-flex align-items-center justify-content-between mt-4'>
                                    <Input
                                            name="code"
                                            label="کد امنیتی"
                                            value={code}
                                            onChange={(e) => {
                                                const newCode = e.target.value;
                                                setCode(newCode);
                                                console.log("Code value:", newCode);
                                                setStatusBtn(newCode ? 4 : 1);
                                                console.log("StatusBtn:", newCode ? 4 : 1);
                                            }}
                                            type="text"
                                            style="style"
                                    />

                                        <button
                                                    type="button"
                                                    disabled={isDisable || statusBtn === 5}
                                                    className={`${styles.btn_send_code} ${isDisable && styles.disabled_btn}`}
                                                    onClick={() => {
                                                        statusBtn === 1 || statusBtn === 3 ? getSecurityCode() :
                                                        statusBtn === 4 ? chackSecurityCode() : null;
                                                    }}
                                                >
                                                    {
                                                        statusBtn === 1 ? "ارسال کد امنیتی" :
                                                        statusBtn === 2 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}` :
                                                        statusBtn === 3 ? "ارسال مجدد" :
                                                        statusBtn === 4 ? "ثبت" :
                                                        "ثبت شد"
                                                    }
                                        </button>

                                    </div>
                                    <p className={styles.text_code}>کد امنیتی را وارد کنید تا دسترسی برای ویرایش شماره تماس ایجاد شود. با کلیک روی دکمه کد امنیتی به ایمیل شما ارسال می شود</p>
                                </div>
                                <div>
                                    <Input
                                        name="email"
                                        label="ایمیل"
                                        icon={MdEmail}
                                        value={values.email}
                                        onChange={handleChange}
                                        type={"text"}
                                    />
                                    {errors.email && touched.email && <span className={styles.errorinput}>{errors.email}</span>}
                                </div>
                                <div>
                                    <Select
                                        name="state"
                                        label="استان"
                                        icon={TbBuildingEstate}
                                        value={values.state}
                                        onChange={(value) => setFieldValue('state', value)}
                                    />
                                </div>
                                <div>
                                    <Texteara
                                        name="address"
                                        label="آدرس"
                                        value={values.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && touched.address && <span className={styles.errorinput}>{errors.address}</span>}
                                </div>
                                <div className={styles.btsmodal}>
                                    <button type='submit' className={`${styles.btnconfirm} ${isSubmitting && styles.disabled_btn}`} disabled={isSubmitting}>تایید اطلاعات</button>
                                    <div className={styles.btncancel} onClick={() => handleClose(resetForm)}>لغو</div>
                                </div>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    )
}
