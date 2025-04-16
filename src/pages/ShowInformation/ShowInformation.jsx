import { useEffect, useState, useRef } from "react";
import styles from "../../styles/signup.module.css";
import { Col } from "react-bootstrap";
import { FaUser, FaArrowLeftLong } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import Input from "../../components/module/Input/Input";
import { Formik } from "formik";
import Texteara from "../../components/module/Texteara/Texteara";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import {goToLogin} from "../../utils/helper";


export default function showInformation() {
  const [initialValues, setInitialValues] = useState({
    full_name: "",
    phone_number: "",
    national_id: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [windowWidth, setWindowWidth] = useState(0);
  const [isPrivate, setIsPerivate] = useState(true);
  const navigate = useNavigate();
  const firstInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleToggle = () => {
    setIsPerivate((e) => !e);
  };

  const getInformation = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    try {
      const response = await axios.get(
        `${apiUrl}/user/get-user-informations/`,
        {
          headers,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setInitialValues((prev) => ({
          ...prev,
          full_name: response.data[0]?.full_name || "",
          phone_number: response.data[0]?.phone_number || "",
          national_id: response.data[0]?.national_id || "",
          email: response.data[0]?.email || "",
        }));
      }
    } catch (e) {
     if (e.response?.status === 401) {
       localStorage.removeItem("access");
       goToLogin();
     }
     if(e.response?.status ===500){
      toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
     }
    }
  };

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
    getInformation();
  }, []);

  return (
    <>
      {windowWidth < 768 ? (
        <>
          <div className={styles.signupcontainerm}>
            <img className={styles.logoformm} src="/images/logo.svg" alt="" />
            <div className={styles.signupform}>
              <div className={styles.headersignup}>
                <div className="d-flex align-items-center">
                  <FaUser className={styles.usericon} />
                  <p className={styles.Signuptext}>اطلاعات من</p>
                </div>
                <Link to="/login" className={styles.linksignin}>
                  قبلا ثبت نام کرده اید؟
                </Link>
              </div>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validate={(values) => {
                  const errors = {};
                  const phoneRegex =
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
                  const codeRegex = /^\d{10}$/;

                  if (values.full_name === "") {
                    errors.full_name =
                      "وارد کردن نام و نام خانوادگی اجباری میباشد";
                  }
                  if (values.national_id === "") {
                    errors.national_id =
                      "وارد کردن کدملی یا شناسه ملی اجباری است";
                  } else if (!codeRegex.test(values.national_id)) {
                    errors.national_id = "کدملی یا شناسه ملی معتبر نیست";
                  }

                  if (values.phone_number === "") {
                    errors.phone_number = "وارد کردن شماره تلفن اجباری میباشد";
                  } else if (!phoneRegex.test(values.phone_number)) {
                    errors.phone_number = "شماره تلفن معتبر نیست";
                  }
                  if (values.email === "") {
                    errors.email = "وارد کردن ایمیل اجباری میباشد";
                  } else if (!emailRegex.test(values.email)) {
                    errors.email = "ایمیل معتبر نیست";
                  }
                  if (values.password === "") {
                    errors.password = "وارد کردن رمز عبور اجباری میباشد";
                  }
                  if (values.confirm_password === "") {
                    errors.confirm_password = "تکرار رمز عبور اجباری میباشد";
                  } else if (values.password !== values.confirm_password) {
                    errors.confirm_password =
                      "رمز عبور و تکرار آن یکسان نیستند";
                  }

                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  const access = localStorage.getItem("access");
                  const headers = {
                    Authorization: `Bearer ${access}`,
                  };
                  try {
                    const response = await axios.put(
                      `${apiUrl}/user/user/update/`,
                      values,
                      {
                        headers,
                      }
                    );
                    if (response.status === 200) {
                      setSubmitting(false);
                      toast.success("ثبت نام با موفقیت انجام شد", {
                        position: "center-center",
                        onClose: () => navigate("/"),
                      });
                    }
                  } catch (error) {
                    toast.error(error.response.data.message, {
                      position: "top-left",
                    });
                    setSubmitting(false);
                  }
                }}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit} className={styles.formcontent}>
                    <div>
                      <Input
                        name="full_name"
                        label="نام و نام خانوادگی"
                        icon={FaUser}
                        value={values.full_name}
                        onChange={handleChange}
                        type={"text"}
                      />
                      {errors.full_name && touched.full_name && (
                        <span className={styles.errorinput}>
                          {errors.full_name}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        name="national_id"
                        label="کدملی یا شناسه ملی"
                        icon={FaPhone}
                        value={values.national_id}
                        onChange={handleChange}
                        type={"text"}
                      />
                      {errors.national_id && touched.national_id && (
                        <span className={styles.errorinput}>
                          {errors.national_id}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        name="phone_number"
                        label="شماره تماس"
                        icon={FaPhone}
                        value={values.phone_number}
                        onChange={handleChange}
                        type={"text"}
                      />
                      {errors.phone_number && touched.phone_number && (
                        <span className={styles.errorinput}>
                          {errors.phone_number}
                        </span>
                      )}
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
                      {errors.email && touched.email && (
                        <span className={styles.errorinput}>
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        name="password"
                        label="رمز عبور"
                        icon={isPrivate ? IoEyeSharp : IoEyeOff}
                        value={values.password}
                        onChange={handleChange}
                        handleToggle={handleToggle}
                        type={isPrivate ? "password" : "text"}
                      />
                      {errors.password && touched.password && (
                        <span className={styles.errorinput}>
                          {errors.password}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        name="confirm_password"
                        label="تکرار رمز عبور"
                        icon={isPrivate ? IoEyeSharp : IoEyeOff}
                        value={values.confirm_password}
                        onChange={handleChange}
                        handleToggle={handleToggle}
                        type={isPrivate ? "password" : "text"}
                      />
                      {errors.confirm_password && touched.confirm_password && (
                        <span className={styles.errorinput}>
                          {errors.confirm_password}
                        </span>
                      )}
                    </div>
                    <button
                      className={`${styles.btnsignup} ${
                        isSubmitting ? styles.disablebtn : ""
                      }`}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      ادامه
                      <FaArrowLeftLong className={styles.btnsignupicon} />
                    </button>
                  </form>
                )}
              </Formik>
            </div>
            <p className={styles.textco}>Powered By ARIISCO</p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.signupcontainer}>
            <Col md={6} className={styles.formcontainer}>
              <div className={styles.signupform}>
                <div className={styles.headersignup}>
                  <div className="d-flex align-items-center">
                    <FaUser className={styles.usericon} />
                    <p className={styles.Signuptext}>اطلاعات من</p>
                  </div>
                  <Link to="/login" className={styles.linksignin}>
                    قبلا ثبت نام کرده اید؟
                  </Link>
                </div>
                <Formik
                  enableReinitialize={true}
                  initialValues={initialValues}
                  validate={(values) => {
                    const errors = {};
                    const phoneRegex =
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                    const emailRegex =
                      /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
                    const codeRegex = /^\d{10}$/;

                    if (values.full_name === "") {
                      errors.full_name =
                        "وارد کردن نام و نام خانوادگی اجباری میباشد";
                    }
                    if (values.national_id === "") {
                      errors.national_id =
                        "وارد کردن کدملی یا شناسه ملی اجباری است";
                    } else if (!codeRegex.test(values.national_id)) {
                      errors.national_id = "کدملی یا شناسه ملی معتبر نیست";
                    }

                    if (values.phone_number === "") {
                      errors.phone_number =
                        "وارد کردن شماره تلفن اجباری میباشد";
                    } else if (!phoneRegex.test(values.phone_number)) {
                      errors.phone_number = "شماره تلفن معتبر نیست";
                    }
                    if (values.email === "") {
                      errors.email = "وارد کردن ایمیل اجباری میباشد";
                    } else if (!emailRegex.test(values.email)) {
                      errors.email = "ایمیل معتبر نیست";
                    }
                    if (values.password === "") {
                      errors.password = "وارد کردن رمز عبور اجباری میباشد";
                    }
                    if (values.confirm_password === "") {
                      errors.confirm_password = "تکرار رمز عبور اجباری میباشد";
                    } else if (values.password !== values.confirm_password) {
                      errors.confirm_password =
                        "رمز عبور و تکرار آن یکسان نیستند";
                    }

                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    const access = localStorage.getItem("access");
                    const headers = {
                      Authorization: `Bearer ${access}`,
                    };
                    try {
                      const response = await axios.put(
                        `${apiUrl}/user/user-update/`,
                        values,
                        {
                          headers,
                        }
                      );
                      if (response.status === 200) {
                        setSubmitting(false);
                        swal({
                          title: "با موفقیت وارد شدید",
                          icon: "success",
                          button: "باشه",
                        }).then(() => {
                          navigate("/");
                        });
                      }
                    } catch (error) {
                      toast.error(error.response.data.message, {
                        position: "top-left",
                      });
                      setSubmitting(false);
                    }
                  }}
                >
                  {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <form
                      onSubmit={handleSubmit}
                      className={styles.formcontent}
                    >
                      <div>
                        <Input
                          name="full_name"
                          label="نام و نام خانوادگی"
                          icon={FaUser}
                          value={values.full_name}
                          onChange={handleChange}
                          type={"text"}
                        />
                        {errors.full_name && touched.full_name && (
                          <span className={styles.errorinput}>
                            {errors.full_name}
                          </span>
                        )}
                      </div>
                      <div>
                        <Input
                          name="national_id"
                          label="کدملی یا شناسه ملی"
                          icon={FaPhone}
                          value={values.national_id}
                          onChange={handleChange}
                          type={"text"}
                        />
                        {errors.national_id && touched.national_id && (
                          <span className={styles.errorinput}>
                            {errors.national_id}
                          </span>
                        )}
                      </div>
                      <div>
                        <Input
                          name="phone_number"
                          label="شماره تماس"
                          icon={FaPhone}
                          value={values.phone_number}
                          onChange={handleChange}
                          type={"text"}
                        />
                        {errors.phone_number && touched.phone_number && (
                          <span className={styles.errorinput}>
                            {errors.phone_number}
                          </span>
                        )}
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
                        {errors.email && touched.email && (
                          <span className={styles.errorinput}>
                            {errors.email}
                          </span>
                        )}
                      </div>
                      <div>
                        <Input
                          name="password"
                          label="رمز عبور"
                          icon={isPrivate ? IoEyeSharp : IoEyeOff}
                          value={values.password}
                          onChange={handleChange}
                          handleToggle={handleToggle}
                          type={isPrivate ? "password" : "text"}
                        />
                        {errors.password && touched.password && (
                          <span className={styles.errorinput}>
                            {errors.password}
                          </span>
                        )}
                      </div>
                      <div>
                        <Input
                          name="confirm_password"
                          label="تکرار رمز عبور"
                          icon={isPrivate ? IoEyeSharp : IoEyeOff}
                          value={values.confirm_password}
                          onChange={handleChange}
                          handleToggle={handleToggle}
                          type={isPrivate ? "password" : "text"}
                        />
                        {errors.confirm_password &&
                          touched.confirm_password && (
                            <span className={styles.errorinput}>
                              {errors.confirm_password}
                            </span>
                          )}
                      </div>
                      <button
                        className={`${styles.btnsignup} ${
                          isSubmitting ? styles.disablebtn : ""
                        }`}
                        type="submit"
                        disabled={isSubmitting}
                      >
                        ادامه
                        <FaArrowLeftLong className={styles.btnsignupicon} />
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            </Col>
            <Col md={6} className={styles.logocontainer}>
              <img className={styles.logo} src="/images/logo.svg" alt="logo" />
              <p className={styles.textco}>Powered By ARIISCO</p>
            </Col>
          </div>
        </>
      )}
      <ToastContainer />
    </>
  );
}
