import { useEffect, useRef, useState } from "react";
import Input from "../../components/module/Input/Input";
import styles from "../../styles/Login.module.css";
import { Col } from "react-bootstrap";
import { Formik } from "formik";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { MdOutlineMail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import InputsCodes from "../../components/module/InputsCodes/InputsCodes";

export default function Login() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isForget, setIsForget] = useState(false);
  const [showFiledEmail, setShowEmail] = useState(false);
  const [showFiledNumber, setShowFiledNumber] = useState(false);
  const [isPrivate, setIsPerivate] = useState(true);
  const [timeLeft, setTimeLeft] = useState(59);
  const [showButton, setShowButton] = useState(false);
  const firstInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const handleToggle = () => {
    setIsPerivate((e) => !e);
  };

  const sendCodeAgainToNumber = async () => {
    const phone_number = localStorage.getItem("phone");
    if (phone_number) {
      const body = { phone_number };
      try {
        await axios.post(`${apiUrl}/user/send-code-login/`, body);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred", {
          position: "top-left",
        });
      }
    }
  };

  const sendResetCodeAgainToNumber = async () => {
    const phone_number = localStorage.getItem("phone");
    if (phone_number) {
      const body = { phone_number };
      try {
        await axios.post(`${apiUrl}/user/password-reset/`, body);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred", {
          position: "top-left",
        });
      }
    }
  };

  const resetTimer = () => {
    setTimeLeft(59);
    setShowButton(false);
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setShowButton(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

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
  }, []);

  return (
    <>
      {windowWidth < 768 ? (
        <>
          <div className={styles.logincontainerm}>
            <img className={styles.logoformm} src="/images/logo.svg" alt="" />
            {step === 1 ? (
              <div className={styles.phoneform}>
                <Formik
                  validate={(values) => {
                    const errors = {};
                    if (!values.identifier) {
                      errors.identifier = "نام کاربری ضروری است";
                    }
                    if (!values.password) {
                      errors.password = "رمز عبور ضروری است";
                    }
                    return errors;
                  }}
                  initialValues={{
                    identifier: "",
                    password: "",
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const response = await axios.post(
                        `${apiUrl}/user/login/`,
                        values
                      );
                      if (response.status === 200) {
                        localStorage.setItem("refresh", response.data.refresh);
                        localStorage.setItem(
                          "access",
                          response.data.access_token
                        );
                        localStorage.removeItem("email");
                        localStorage.removeItem("phone");
                        navigate("/");
                      }
                    } catch (error) {
                      toast.error(error.response.data.credential_error[0], {
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
                    <form onSubmit={handleSubmit}>
                      <p className={styles.paneltext}>ورود به پنل Behrizan</p>

                      <div className={`${styles.inputwrapper}`}>
                        <Input
                          name="identifier"
                          label="کدملی یا شماره تلفن"
                          icon={FaPhone}
                          value={values.identifier}
                          onChange={handleChange}
                          type={"text"}
                          ref={firstInputRef}
                        />
                        {errors.identifier && touched.identifier && (
                          <span className={styles.errorinput}>
                            {errors.identifier}
                          </span>
                        )}
                        <Input
                          name="password"
                          label="رمز عبور"
                          icon={isPrivate ? IoEyeSharp : IoEyeOff}
                          handleToggle={handleToggle}
                          type={isPrivate ? "password" : "text"}
                          value={values.password}
                          onChange={handleChange}
                          ref={firstInputRef}
                        />
                        {errors.password && touched.password && (
                          <span className={styles.errorinput}>
                            {errors.password}
                          </span>
                        )}
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                          <div
                            className={styles.linksignup}
                            onClick={() => setStep(7)}
                          >
                            هنوز ثبت نام نکرده اید؟
                          </div>
                          <span
                            className={styles.linksignup}
                            onClick={() => setStep(5)}
                          >
                            ورود با کد یکبار مصرف
                          </span>
                        </div>
                        <p
                          className={styles.forgettext}
                          onClick={() => setIsForget(true)}
                        >
                          رمز را فراموش کردید ؟
                        </p>

                        {isForget && (
                          <>
                            <div className="text-center">
                              <button
                                type="button"
                                className={styles.sendcodebtn}
                                onClick={() => {
                                  setStep(2);
                                  setShowFiledNumber(true);
                                }}
                              >
                                <MdOutlineMail className={styles.mailicon} />
                                <span className={`mx-2 ${styles.texttosend}`}>
                                  ارسال کد یکبار مصرف از طریق پیامک
                                </span>
                              </button>
                            </div>
                            {/* <div className="text-center">
                              <button
                                className={styles.sendcodebtn}
                                type="button"
                                onClick={() => {
                                  setStep(2);
                                  setShowEmail(true);
                                }}
                              >
                                <MdOutlineMail className={styles.mailicon} />
                                <span className={`mx-2 ${styles.texttosend}`}>
                                  ارسال کد یکبار مصرف به ایمیل
                                </span>
                              </button>
                            </div> */}
                          </>
                        )}
                      </div>
                      <div className={`${styles.btnwrapper}`}>
                        <button
                          className={`${styles.btnphoneform} ${
                            isSubmitting ? styles.disablebtn : ""
                          }`}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          ورود
                          <FaArrowLeftLong className={styles.iconformphone} />
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            ) : step === 2 ? (
              <div className={styles.passwordform}>
                {showFiledEmail ? (
                  <>
                    <div className={styles.formpasswordcontent}>
                      <Formik
                        validate={(values) => {
                          const emailRegex =
                            /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
                          const errors = {};
                          if (values.email === "") {
                            errors.email = "وارد کردن ایمیل اجباری میباشد";
                          } else if (!emailRegex.test(values.email)) {
                            errors.email = "ایمیل معتبر نیست";
                          }
                          return errors;
                        }}
                        initialValues={{
                          email: "",
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                          try {
                            localStorage.setItem("email", values.email);
                            const response = await axios.post(
                              `${apiUrl}/user/password-reset-email/`,
                              values
                            );
                            if (response.status === 200) {
                              setShowEmail(false);
                              setStep(3);
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
                          <form onSubmit={handleSubmit}>
                            <div>
                              <Input
                                Input
                                name="email"
                                label="ایمیل"
                                icon={MdEmail}
                                value={values.email}
                                onChange={handleChange}
                                type={"text"}
                                ref={firstInputRef}
                              />

                              {errors.email && touched.email && (
                                <span className={styles.errorinput}>
                                  {errors.email}
                                </span>
                              )}
                            </div>
                            <div className="text-center mt-5">
                              <button
                                className={`${styles.btnphoneform} ${
                                  isSubmitting ? styles.disablebtn : ""
                                }`}
                                type="submit"
                                disabled={isSubmitting}
                              >
                                ارسال
                                <FaArrowLeftLong
                                  className={styles.iconformphone}
                                />
                              </button>
                            </div>
                          </form>
                        )}
                      </Formik>
                    </div>
                  </>
                ) : showFiledNumber ? (
                  <>
                    <div className={styles.formpasswordcontent}>
                      <Formik
                        validate={(values) => {
                          const errors = {};
                          const phoneRegex =
                            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                          if (!values.phone_number) {
                            errors.phone_number =
                              "وارد کردن  شماره تلفن اجباری میباشد";
                          } else if (!phoneRegex.test(values.phone_number)) {
                            errors.phone_number = "شماره تلفن معتبر نیست";
                          }
                          return errors;
                        }}
                        initialValues={{
                          phone_number: "",
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                          try {
                            localStorage.setItem("phone", values.phone_number);
                            const response = await axios.post(
                              `${apiUrl}/user/password-reset/`,
                              values
                            );
                            if (response.status === 200) {
                              setShowFiledNumber(false);
                              setStep(4);
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
                          <form onSubmit={handleSubmit}>
                            <div>
                              <Input
                                Input
                                name="phone_number"
                                label="شماره همراه"
                                icon={FaPhone}
                                value={values.phone_number}
                                onChange={handleChange}
                                type={"text"}
                                ref={firstInputRef}
                              />

                              {errors.phone_number && touched.phone_number && (
                                <span className={styles.errorinput}>
                                  {errors.phone_number}
                                </span>
                              )}
                            </div>
                            <div className="text-center mt-5">
                              <button
                                className={`${styles.btnphoneform} ${
                                  isSubmitting ? styles.disablebtn : ""
                                }`}
                                type="submit"
                                disabled={isSubmitting}
                              >
                                ارسال
                                <FaArrowLeftLong
                                  className={styles.iconformphone}
                                />
                              </button>
                            </div>
                          </form>
                        )}
                      </Formik>
                    </div>
                  </>
                ) : null}
              </div>
            ) : step === 3 ? (
              <div className={styles.sendcodeform}>
                <p className={styles.textpassword}>
                  رمز یکبار مصرف به ایمیل شما ارسال شد
                </p>
                <div className={styles.sendcodecontent}>
                  <Formik
                    validate={(values) => {
                      const errors = {};
                      const emailRegex =
                        /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

                      if (values.email === "") {
                        errors.email = "وارد کردن ایمیل اجباری میباشد";
                      } else if (!emailRegex.test(values.email)) {
                        errors.email = "ایمیل معتبر نیست";
                      }
                      if (values.new_password === "") {
                        errors.new_password =
                          "وارد کردن رمز عبور جدبد اجباری میباشد";
                      }
                      if (values.code === "") {
                        errors.code = "وارد کردن کد اجباری میباشد";
                      }

                      return errors;
                    }}
                    initialValues={{
                      email: localStorage.getItem("email"),
                      new_password: "",
                      code: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        const response = await axios.post(
                          `${apiUrl}/user/password-reset-confirm-email/`,
                          values
                        );
                        if (response.status === 200) {
                          setIsForget(false);
                          setStep(1);
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
                            name="email"
                            label="ایمیل"
                            icon={MdEmail}
                            value={values.email}
                            onChange={handleChange}
                            type={"text"}
                            ref={firstInputRef}
                          />
                          {errors.email && touched.email && (
                            <span className={styles.errorinput}>
                              {errors.email}
                            </span>
                          )}
                        </div>
                        <div>
                          <Input
                            name="new_password"
                            label="رمز عبور جدید"
                            icon={isPrivate ? IoEyeSharp : IoEyeOff}
                            value={values.new_password}
                            onChange={handleChange}
                            handleToggle={handleToggle}
                            type={isPrivate ? "password" : "text"}
                          />
                          {errors.new_password && touched.new_password && (
                            <span className={styles.errorinput}>
                              {errors.new_password}
                            </span>
                          )}
                        </div>
                        <div>
                          <Input
                            name="code"
                            label="کد"
                            icon={""}
                            value={values.code}
                            onChange={handleChange}
                            type={"text"}
                          />
                          {errors.code && touched.code && (
                            <span className={styles.errorinput}>
                              {errors.code}
                            </span>
                          )}
                        </div>
                        <div className="text-center mt-5">
                          <button
                            className={`${styles.btnphoneform} ${
                              isSubmitting ? styles.disablebtn : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            ادامه
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            ) : step === 4 ? (
              <div className={styles.sendcodeform}>
                <p className={styles.textpassword}>
                  رمز یکبار مصرف به شماره شما ارسال شد
                </p>
                <div className={styles.sendcodecontent}>
                  <Formik
                    validate={(values) => {
                      const errors = {};
                      const phoneRegex =
                        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                      if (!values.phone_number) {
                        errors.phone_number =
                          "وارد کردن  شماره تلفن اجباری میباشد";
                      } else if (!phoneRegex.test(values.phone_number)) {
                        errors.phone_number = "شماره تلفن معتبر نیست";
                      }
                      if (values.new_password === "") {
                        errors.new_password =
                          "وارد کردن رمز عبور جدبد اجباری میباشد";
                      }
                      if (values.code === "") {
                        errors.code = "وارد کردن کد اجباری میباشد";
                      }

                      return errors;
                    }}
                    initialValues={{
                      phone_number: localStorage.getItem("phone"),
                      new_password: "",
                      code: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        const response = await axios.post(
                          `${apiUrl}/user/password-reset-confirm/`,
                          values
                        );
                        if (response.status === 200) {
                          setIsForget(false);
                          setStep(1);
                        }
                      } catch (error) {
                       
                        toast.error(error.response.data.non_field_errors[0], {
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
                            name="phone_number"
                            label="شماره همراه"
                            icon={MdEmail}
                            value={values.phone_number}
                            onChange={handleChange}
                            type={"text"}
                            ref={firstInputRef}
                          />
                          {errors.phone_number && touched.phone_number && (
                            <span className={styles.errorinput}>
                              {errors.phone_number}
                            </span>
                          )}
                        </div>
                        <div>
                          <Input
                            name="new_password"
                            label="رمز عبور جدید"
                            icon={isPrivate ? IoEyeSharp : IoEyeOff}
                            value={values.new_password}
                            onChange={handleChange}
                            handleToggle={handleToggle}
                            type={isPrivate ? "password" : "text"}
                          />
                          {errors.new_password && touched.new_password && (
                            <span className={styles.errorinput}>
                              {errors.new_password}
                            </span>
                          )}
                        </div>
                        <div>
                          <Input
                            name="code"
                            label="کد"
                            icon={""}
                            value={values.code}
                            onChange={handleChange}
                            type={"text"}
                          />
                          {errors.code && touched.code && (
                            <span className={styles.errorinput}>
                              {errors.code}
                            </span>
                          )}
                        </div>
                        <div
                          className={`
                          text-center
                          mt-5 
                          d-flex
                          align-items-center
                          justify-content-center
                          gap-4
                          ${styles.wrapper_time_btn}`}
                        >
                          <button
                            className={`${styles.btnphoneform} ${
                              isSubmitting ? styles.disablebtn : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            ادامه
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                          {timeLeft > 0 ? (
                            <p className={styles.timer}>00:{timeLeft}</p>
                          ) : (
                            <button
                              type="button"
                              className={styles.resendButton}
                              onClick={() => {
                                resetTimer();
                                sendResetCodeAgainToNumber();
                              }}
                            >
                              ارسال مجدد کد
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            ) : step === 5 ? (
              <div className={styles.passwordform}>
                <div className={styles.formpasswordcontent}>
                  <Formik
                    validate={(values) => {
                      const errors = {};
                      const phoneRegex =
                        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                      if (!values.phone_number) {
                        errors.phone_number =
                          "وارد کردن  شماره تلفن اجباری میباشد";
                      } else if (!phoneRegex.test(values.phone_number)) {
                        errors.phone_number = "شماره تلفن معتبر نیست";
                      }
                      return errors;
                    }}
                    initialValues={{
                      phone_number: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        localStorage.setItem("phone", values.phone_number);
                        const response = await axios.post(
                          `${apiUrl}/user/send-code-login/`,
                          values
                        );
                        if (response.status === 200) {
                          setStep(6);
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
                      <form onSubmit={handleSubmit}>
                        <div>
                          <Input
                            Input
                            name="phone_number"
                            label="شماره همراه"
                            icon={MdEmail}
                            value={values.phone_number}
                            onChange={handleChange}
                            type={"text"}
                            ref={firstInputRef}
                          />

                          {errors.phone_number && touched.phone_number && (
                            <span className={styles.errorinput}>
                              {errors.phone_number}
                            </span>
                          )}
                        </div>
                        <div className="text-center mt-5">
                          <button
                            className={`${styles.btnphoneform} ${
                              isSubmitting ? styles.disablebtn : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            ارسال
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            ) : step === 6 ? (
              <div className={styles.phoneform}>
                <Formik
                  initialValues={{
                    phone_number: localStorage.getItem("phone"),
                    code: "",
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      setLoading(true);
                      const response = await axios.post(
                        `${apiUrl}/user/verify-code-login/`,
                        values
                      );
                      if (response.status === 200) {
                        localStorage.setItem(
                          "refresh",
                          response.data.refresh_token
                        );
                        localStorage.setItem(
                          "access",
                          response.data.access_token
                        );
                        localStorage.removeItem("email");
                        localStorage.removeItem("phone");
                        navigate("/");
                      }
                    } catch (error) {
                      toast.error(error.response.data.message, {
                        position: "top-left",
                      });
                      setSubmitting(false);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {({ values, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <p className={styles.paneltext}>
                        رمز یکبار مصرف به شماره زیر ارسال شده است
                      </p>
                      <p className={styles.wrap_phone}>
                        {localStorage.getItem("phone")}
                      </p>
                      <InputsCodes
                        onChange={handleChange}
                        value={values.code}
                        handleSubmit={handleSubmit}
                      />
                      <div
                        className={`d-flex justify-content-center ${styles.wrapper_time_btn}`}
                      >
                        {loading ? (
                          <span>درحال انتظار ...</span>
                        ) : timeLeft > 0 ? (
                          <p className={styles.timer}>00:{timeLeft}</p>
                        ) : (
                          <button
                            type="button"
                            className={styles.resendButton}
                            onClick={() => {
                              resetTimer();
                              sendCodeAgainToNumber();
                            }}
                          >
                            ارسال مجدد کد
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            ) : step === 7 ? (
              <div className={styles.passwordform}>
                <div className={styles.formpasswordcontent}>
                  <Formik
                    validate={(values) => {
                      const errors = {};
                      const phoneRegex =
                        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                      if (!values.phone_number) {
                        errors.phone_number =
                          "وارد کردن  شماره تلفن اجباری میباشد";
                      } else if (!phoneRegex.test(values.phone_number)) {
                        errors.phone_number = "شماره تلفن معتبر نیست";
                      }
                      return errors;
                    }}
                    initialValues={{
                      phone_number: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      localStorage.setItem("phone", values.phone_number);
                      try {
                        const response = await axios.post(
                          `${apiUrl}/user/send-code-login/`,
                          values
                        );
                        if (response.status === 200) {
                          console.log(response.data);
                          setStep(8);
                        }
                      } catch (error) {
                        toast.error(error.response.data.message, {
                          position: "top-left",
                        });
                        console.log(error);
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
                      <form onSubmit={handleSubmit}>
                        <div>
                          <Input
                            Input
                            name="phone_number"
                            label="شماره همراه"
                            icon={MdEmail}
                            value={values.phone_number}
                            onChange={handleChange}
                            type={"text"}
                            ref={firstInputRef}
                          />

                          {errors.phone_number && touched.phone_number && (
                            <span className={styles.errorinput}>
                              {errors.phone_number}
                            </span>
                          )}
                        </div>
                        <div className="text-center mt-5">
                          <button
                            className={`${styles.btnphoneform} ${
                              isSubmitting ? styles.disablebtn : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            ارسال
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            ) : step === 8 ? (
              <>
                <div className={styles.phoneform}>
                  <Formik
                    initialValues={{
                      phone_number: localStorage.getItem("phone"),
                      code: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        setLoading(true);
                        const response = await axios.post(
                          `${apiUrl}/user/verify-code-login/`,
                          values
                        );
                        if (response.status === 200) {
                          console.log(response.data);
                          localStorage.setItem(
                            "refresh",
                            response.data.refresh_token
                          );
                          localStorage.setItem(
                            "access",
                            response.data.access_token
                          );
                          localStorage.removeItem("email");
                          localStorage.removeItem("phone");
                          navigate("/showInformation");
                        }
                      } catch (error) {
                        toast.error(error.response.data.message, {
                          position: "top-left",
                        });
                        setSubmitting(false);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {({ values, handleChange, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <p className={styles.paneltext}>
                          رمز یکبار مصرف به شماره زیر ارسال شده است
                        </p>
                        <p className={styles.wrap_phone}>
                          {localStorage.getItem("phone")}
                        </p>
                        <InputsCodes
                          onChange={handleChange}
                          value={values.code}
                          handleSubmit={handleSubmit}
                        />
                        <div className="d-flex justify-content-center">
                          {loading ? (
                            <span>درحال انتظار ...</span>
                          ) : timeLeft > 0 ? (
                            <p className={styles.timer}>00:{timeLeft}</p>
                          ) : (
                            <button
                              type="button"
                              className={styles.resendButton}
                              onClick={() => {
                                resetTimer();
                                sendCodeAgainToNumber();
                              }}
                            >
                              ارسال مجدد کد
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </>
            ) : null}
            <p className={styles.textco}>Powered By ARIISCO</p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.logincontainer}>
            <Col md={6} className={styles.formcontainer}>
              {step === 1 ? (
                <div className={styles.phoneform}>
                  <Formik
                    validate={(values) => {
                      const errors = {};
                      if (!values.identifier) {
                        errors.identifier = "نام کاربری ضروری است";
                      }
                      if (!values.password) {
                        errors.password = "رمز عبور ضروری است";
                      }
                      return errors;
                    }}
                    initialValues={{
                      identifier: "",
                      password: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        const response = await axios.post(
                          `${apiUrl}/user/login/`,
                          values
                        );
                        if (response.status === 200) {
                          localStorage.setItem(
                            "refresh",
                            response.data.refresh
                          );
                          localStorage.setItem(
                            "access",
                            response.data.access_token
                          );
                          localStorage.removeItem("email");
                          localStorage.removeItem("phone");
                          navigate("/");
                        }
                      } catch (error) {
                        toast.error(error.response.data.credential_error[0], {
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
                      <form onSubmit={handleSubmit}>
                        <p className={styles.paneltext}>ورود به پنل Behrizan</p>

                        <div className={`${styles.inputwrapper}`}>
                          <Input
                            name="identifier"
                            label="کدملی یا شماره تلفن"
                            icon={FaPhone}
                            value={values.identifier}
                            onChange={handleChange}
                            type={"text"}
                            ref={firstInputRef}
                          />
                          {errors.identifier && touched.identifier && (
                            <span className={styles.errorinput}>
                              {errors.identifier}
                            </span>
                          )}
                          <Input
                            name="password"
                            label="رمز عبور"
                            icon={isPrivate ? IoEyeSharp : IoEyeOff}
                            handleToggle={handleToggle}
                            type={isPrivate ? "password" : "text"}
                            value={values.password}
                            onChange={handleChange}
                            ref={firstInputRef}
                          />
                          {errors.password && touched.password && (
                            <span className={styles.errorinput}>
                              {errors.password}
                            </span>
                          )}
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <div
                              className={styles.linksignup}
                              onClick={() => setStep(7)}
                            >
                              هنوز ثبت نام نکرده اید؟
                            </div>
                            <span
                              className={styles.linksignup}
                              onClick={() => setStep(5)}
                            >
                              ورود با کد یکبار مصرف
                            </span>
                          </div>
                          <p
                            className={styles.forgettext}
                            onClick={() => setIsForget(true)}
                          >
                            رمز را فراموش کردید ؟
                          </p>

                          {isForget && (
                            <>
                              <div className="text-center">
                                <button
                                  type="button"
                                  className={styles.sendcodebtn}
                                  onClick={() => {
                                    setStep(2);
                                    setShowFiledNumber(true);
                                  }}
                                >
                                  <MdOutlineMail className={styles.mailicon} />
                                  <span className={`mx-2 ${styles.texttosend}`}>
                                    ارسال کد یکبار مصرف از طریق پیامک
                                  </span>
                                </button>
                              </div>
                              {/* <div className="text-center">
                                <button
                                  className={styles.sendcodebtn}
                                  type="button"
                                  onClick={() => {
                                    setStep(2);
                                    setShowEmail(true);
                                  }}
                                >
                                  <MdOutlineMail className={styles.mailicon} />
                                  <span className={`mx-2 ${styles.texttosend}`}>
                                    ارسال کد یکبار مصرف به ایمیل
                                  </span>
                                </button>
                              </div> */}
                            </>
                          )}
                        </div>
                        <div className={`${styles.btnwrapper}`}>
                          <button
                            className={`${styles.btnphoneform} ${
                              isSubmitting ? styles.disablebtn : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            ورود
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              ) : step === 2 ? (
                <div className={styles.passwordform}>
                  {showFiledEmail ? (
                    <>
                      <div className={styles.formpasswordcontent}>
                        <Formik
                          validate={(values) => {
                            const emailRegex =
                              /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
                            const errors = {};
                            if (values.email === "") {
                              errors.email = "وارد کردن ایمیل اجباری میباشد";
                            } else if (!emailRegex.test(values.email)) {
                              errors.email = "ایمیل معتبر نیست";
                            }
                            return errors;
                          }}
                          initialValues={{
                            email: "",
                          }}
                          onSubmit={async (values, { setSubmitting }) => {
                            try {
                              localStorage.setItem("email", values.email);
                              const response = await axios.post(
                                `${apiUrl}/user/password-reset-email/`,
                                values
                              );
                              if (response.status === 200) {
                                setShowEmail(false);
                                setStep(3);
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
                            <form onSubmit={handleSubmit}>
                              <div>
                                <Input
                                  Input
                                  name="email"
                                  label="ایمیل"
                                  icon={MdEmail}
                                  value={values.email}
                                  onChange={handleChange}
                                  type={"text"}
                                  ref={firstInputRef}
                                />

                                {errors.email && touched.email && (
                                  <span className={styles.errorinput}>
                                    {errors.email}
                                  </span>
                                )}
                              </div>
                              <div className="text-center mt-5">
                                <button
                                  className={`${styles.btnphoneform} ${
                                    isSubmitting ? styles.disablebtn : ""
                                  }`}
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  ارسال
                                  <FaArrowLeftLong
                                    className={styles.iconformphone}
                                  />
                                </button>
                              </div>
                            </form>
                          )}
                        </Formik>
                      </div>
                    </>
                  ) : showFiledNumber ? (
                    <>
                      <div className={styles.formpasswordcontent}>
                        <Formik
                          validate={(values) => {
                            const errors = {};
                            const phoneRegex =
                              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                            if (!values.phone_number) {
                              errors.phone_number =
                                "وارد کردن  شماره تلفن اجباری میباشد";
                            } else if (!phoneRegex.test(values.phone_number)) {
                              errors.phone_number = "شماره تلفن معتبر نیست";
                            }
                            return errors;
                          }}
                          initialValues={{
                            phone_number: "",
                          }}
                          onSubmit={async (values, { setSubmitting }) => {
                            try {
                              localStorage.setItem(
                                "phone",
                                values.phone_number
                              );
                              const response = await axios.post(
                                `${apiUrl}/user/password-reset/`,
                                values
                              );
                              if (response.status === 200) {
                                setShowFiledNumber(false);
                                setStep(4);
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
                            <form onSubmit={handleSubmit}>
                              <div>
                                <Input
                                  Input
                                  name="phone_number"
                                  label="شماره همراه"
                                  icon={FaPhone}
                                  value={values.phone_number}
                                  onChange={handleChange}
                                  type={"text"}
                                  ref={firstInputRef}
                                />

                                {errors.phone_number &&
                                  touched.phone_number && (
                                    <span className={styles.errorinput}>
                                      {errors.phone_number}
                                    </span>
                                  )}
                              </div>
                              <div className="text-center mt-5">
                                <button
                                  className={`${styles.btnphoneform} ${
                                    isSubmitting ? styles.disablebtn : ""
                                  }`}
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  ارسال
                                  <FaArrowLeftLong
                                    className={styles.iconformphone}
                                  />
                                </button>
                              </div>
                            </form>
                          )}
                        </Formik>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : step === 3 ? (
                <div className={styles.sendcodeform}>
                  <p className={styles.textpassword}>
                    رمز یکبار مصرف به ایمیل شما ارسال شد
                  </p>
                  <div className={styles.sendcodecontent}>
                    <Formik
                      validate={(values) => {
                        const errors = {};
                        const emailRegex =
                          /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

                        if (values.email === "") {
                          errors.email = "وارد کردن ایمیل اجباری میباشد";
                        } else if (!emailRegex.test(values.email)) {
                          errors.email = "ایمیل معتبر نیست";
                        }
                        if (values.new_password === "") {
                          errors.new_password =
                            "وارد کردن رمز عبور جدبد اجباری میباشد";
                        }
                        if (values.code === "") {
                          errors.code = "وارد کردن کد اجباری میباشد";
                        }

                        return errors;
                      }}
                      initialValues={{
                        email: localStorage.getItem("email"),
                        new_password: "",
                        code: "",
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          const response = await axios.post(
                            `${apiUrl}/user/password-reset-confirm-email/`,
                            values
                          );
                          if (response.status === 200) {
                            setIsForget(false);
                            setStep(1);
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
                              name="email"
                              label="ایمیل"
                              icon={MdEmail}
                              value={values.email}
                              onChange={handleChange}
                              type={"text"}
                              ref={firstInputRef}
                            />
                            {errors.email && touched.email && (
                              <span className={styles.errorinput}>
                                {errors.email}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="new_password"
                              label="رمز عبور جدید"
                              icon={isPrivate ? IoEyeSharp : IoEyeOff}
                              value={values.new_password}
                              onChange={handleChange}
                              handleToggle={handleToggle}
                              type={isPrivate ? "password" : "text"}
                            />
                            {errors.new_password && touched.new_password && (
                              <span className={styles.errorinput}>
                                {errors.new_password}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="code"
                              label="کد"
                              icon={""}
                              value={values.code}
                              onChange={handleChange}
                              type={"text"}
                            />
                            {errors.code && touched.code && (
                              <span className={styles.errorinput}>
                                {errors.code}
                              </span>
                            )}
                          </div>
                          <div className="text-center mt-5">
                            <button
                              className={`${styles.btnphoneform} ${
                                isSubmitting ? styles.disablebtn : ""
                              }`}
                              type="submit"
                              disabled={isSubmitting}
                            >
                              ادامه
                              <FaArrowLeftLong
                                className={styles.iconformphone}
                              />
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              ) : step === 4 ? (
                <div className={styles.sendcodeform}>
                  <p className={styles.textpassword}>
                    رمز یکبار مصرف به شماره شما ارسال شد
                  </p>
                  <div className={styles.sendcodecontent}>
                    <Formik
                      validate={(values) => {
                        const errors = {};
                        const phoneRegex =
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                        if (!values.phone_number) {
                          errors.phone_number =
                            "وارد کردن  شماره تلفن اجباری میباشد";
                        } else if (!phoneRegex.test(values.phone_number)) {
                          errors.phone_number = "شماره تلفن معتبر نیست";
                        }
                        if (values.new_password === "") {
                          errors.new_password =
                            "وارد کردن رمز عبور جدبد اجباری میباشد";
                        }
                        if (values.code === "") {
                          errors.code = "وارد کردن کد اجباری میباشد";
                        }

                        return errors;
                      }}
                      initialValues={{
                        phone_number: localStorage.getItem("phone"),
                        new_password: "",
                        code: "",
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          const response = await axios.post(
                            `${apiUrl}/user/password-reset-confirm/`,
                            values
                          );
                          if (response.status === 200) {
                            setIsForget(false);
                            setStep(1);
                          }
                        } catch (error) {
                         
                          toast.error(error.response.data.non_field_errors[0], {
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
                              name="phone_number"
                              label="شماره همراه"
                              icon={MdEmail}
                              value={values.phone_number}
                              onChange={handleChange}
                              type={"text"}
                              ref={firstInputRef}
                            />
                            {errors.phone_number && touched.phone_number && (
                              <span className={styles.errorinput}>
                                {errors.phone_number}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="new_password"
                              label="رمز عبور جدید"
                              icon={isPrivate ? IoEyeSharp : IoEyeOff}
                              value={values.new_password}
                              onChange={handleChange}
                              handleToggle={handleToggle}
                              type={isPrivate ? "password" : "text"}
                            />
                            {errors.new_password && touched.new_password && (
                              <span className={styles.errorinput}>
                                {errors.new_password}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="code"
                              label="کد"
                              icon={""}
                              value={values.code}
                              onChange={handleChange}
                              type={"text"}
                            />
                            {errors.code && touched.code && (
                              <span className={styles.errorinput}>
                                {errors.code}
                              </span>
                            )}
                          </div>
                          <div
                            className="text-center
                           mt-5 
                           d-flex
                            align-items-center
                             justify-content-center
                              gap-4"
                          >
                            <button
                              className={`${styles.btnphoneform} ${
                                isSubmitting ? styles.disablebtn : ""
                              }`}
                              type="submit"
                              disabled={isSubmitting}
                            >
                              ادامه
                              <FaArrowLeftLong
                                className={styles.iconformphone}
                              />
                            </button>
                            {timeLeft > 0 ? (
                              <p className={styles.timer}>00:{timeLeft}</p>
                            ) : (
                              <button
                                type="button"
                                className={styles.resendButton}
                                onClick={() => {
                                  resetTimer();
                                  sendResetCodeAgainToNumber();
                                }}
                              >
                                ارسال مجدد کد
                              </button>
                            )}
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              ) : step === 5 ? (
                <div className={styles.passwordform}>
                  <div className={styles.formpasswordcontent}>
                    <Formik
                      validate={(values) => {
                        const errors = {};
                        const phoneRegex =
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                        if (!values.phone_number) {
                          errors.phone_number =
                            "وارد کردن  شماره تلفن اجباری میباشد";
                        } else if (!phoneRegex.test(values.phone_number)) {
                          errors.phone_number = "شماره تلفن معتبر نیست";
                        }
                        return errors;
                      }}
                      initialValues={{
                        phone_number: "",
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          localStorage.setItem("phone", values.phone_number);
                          const response = await axios.post(
                            `${apiUrl}/user/send-code-login/`,
                            values
                          );
                          if (response.status === 200) {
                            setStep(6);
                          }
                        } catch (error) {
                          toast.error(error.response.data.message, {
                            position: "top-left",
                          });
                          console.log(error);
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
                        <form onSubmit={handleSubmit}>
                          <div>
                            <Input
                              Input
                              name="phone_number"
                              label="شماره همراه"
                              icon={MdEmail}
                              value={values.phone_number}
                              onChange={handleChange}
                              type={"text"}
                              ref={firstInputRef}
                            />

                            {errors.phone_number && touched.phone_number && (
                              <span className={styles.errorinput}>
                                {errors.phone_number}
                              </span>
                            )}
                          </div>
                          <div className="text-center mt-5">
                            <button
                              className={`${styles.btnphoneform} ${
                                isSubmitting ? styles.disablebtn : ""
                              }`}
                              type="submit"
                              disabled={isSubmitting}
                            >
                              ارسال
                              <FaArrowLeftLong
                                className={styles.iconformphone}
                              />
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              ) : step === 6 ? (
                <div className={styles.phoneform}>
                  <Formik
                    initialValues={{
                      phone_number: localStorage.getItem("phone"),
                      code: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        setLoading(true);
                        const response = await axios.post(
                          `${apiUrl}/user/verify-code-login/`,
                          values
                        );
                        if (response.status === 200) {
                          console.log(response.data);
                          localStorage.setItem(
                            "refresh",
                            response.data.refresh_token
                          );
                          localStorage.setItem(
                            "access",
                            response.data.access_token
                          );
                          localStorage.removeItem("email");
                          localStorage.removeItem("phone");
                          navigate("/");
                        }
                      } catch (error) {
                        toast.error(error.response.data.message, {
                          position: "top-left",
                        });
                        setSubmitting(false);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {({ values, handleChange, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <p className={styles.paneltext}>
                          رمز یکبار مصرف به شماره زیر ارسال شده است
                        </p>
                        <p className={styles.wrap_phone}>
                          {localStorage.getItem("phone")}
                        </p>
                        <InputsCodes
                          onChange={handleChange}
                          value={values.code}
                          handleSubmit={handleSubmit}
                        />
                        <div className="d-flex justify-content-center">
                          {loading ? (
                            <span>درحال انتظار ...</span>
                          ) : timeLeft > 0 ? (
                            <p className={styles.timer}>00:{timeLeft}</p>
                          ) : (
                            <button
                              type="button"
                              className={styles.resendButton}
                              onClick={() => {
                                resetTimer();
                                sendCodeAgainToNumber();
                              }}
                            >
                              ارسال مجدد کد
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              ) : step === 7 ? (
                <div className={styles.passwordform}>
                  <div className={styles.formpasswordcontent}>
                    <Formik
                      validate={(values) => {
                        const errors = {};
                        const phoneRegex =
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                        if (!values.phone_number) {
                          errors.phone_number =
                            "وارد کردن  شماره تلفن اجباری میباشد";
                        } else if (!phoneRegex.test(values.phone_number)) {
                          errors.phone_number = "شماره تلفن معتبر نیست";
                        }
                        return errors;
                      }}
                      initialValues={{
                        phone_number: "",
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        localStorage.setItem("phone", values.phone_number);
                        try {
                          const response = await axios.post(
                            `${apiUrl}/user/send-code-login/`,
                            values
                          );
                          if (response.status === 200) {
                            console.log(response.data);
                            setStep(8);
                          }
                        } catch (error) {
                          toast.error(error.response.data.message, {
                            position: "top-left",
                          });
                          console.log(error);
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
                        <form onSubmit={handleSubmit}>
                          <div>
                            <Input
                              Input
                              name="phone_number"
                              label="شماره همراه"
                              icon={MdEmail}
                              value={values.phone_number}
                              onChange={handleChange}
                              type={"text"}
                              ref={firstInputRef}
                            />

                            {errors.phone_number && touched.phone_number && (
                              <span className={styles.errorinput}>
                                {errors.phone_number}
                              </span>
                            )}
                          </div>
                          <div className="text-center mt-5">
                            <button
                              className={`${styles.btnphoneform} ${
                                isSubmitting ? styles.disablebtn : ""
                              }`}
                              type="submit"
                              disabled={isSubmitting}
                            >
                              ارسال
                              <FaArrowLeftLong
                                className={styles.iconformphone}
                              />
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              ) : step === 8 ? (
                <>
                  <div className={styles.phoneform}>
                    <Formik
                      initialValues={{
                        phone_number: localStorage.getItem("phone"),
                        code: "",
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          setLoading(true);
                          const response = await axios.post(
                            `${apiUrl}/user/verify-code-login/`,
                            values
                          );
                          if (response.status === 200) {
                            console.log(response.data);
                            localStorage.setItem(
                              "refresh",
                              response.data.refresh_token
                            );
                            localStorage.setItem(
                              "access",
                              response.data.access_token
                            );
                            localStorage.removeItem("email");
                            localStorage.removeItem("phone");
                            navigate("/showInformation");
                          }
                        } catch (error) {
                          toast.error(error.response.data.message, {
                            position: "top-left",
                          });
                          setSubmitting(false);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      {({ values, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                          <p className={styles.paneltext}>
                            رمز یکبار مصرف به شماره زیر ارسال شده است
                          </p>
                          <p className={styles.wrap_phone}>
                            {localStorage.getItem("phone")}
                          </p>
                          <InputsCodes
                            onChange={handleChange}
                            value={values.code}
                            handleSubmit={handleSubmit}
                          />
                          <div className="d-flex justify-content-center">
                            {loading ? (
                              <span>درحال انتظار ...</span>
                            ) : timeLeft > 0 ? (
                              <p className={styles.timer}>00:{timeLeft}</p>
                            ) : (
                              <button
                                type="button"
                                className={styles.resendButton}
                                onClick={() => {
                                  resetTimer();
                                  sendCodeAgainToNumber();
                                }}
                              >
                                ارسال مجدد کد
                              </button>
                            )}
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </>
              ) : null}
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


  // const sendCodeAgainToEmail = async () => {
  //   const email = localStorage.getItem("email");
  //   if (email) {
  //     const body = { email };
  //     try {
  //       const response = await axios.post(
  //         `${apiUrl}/user/password-reset-email/`,
  //         body
  //       );
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "An error occurred", {
  //         position: "top-left",
  //       });
  //       console.log(error);
  //     }
  //   }
  // };