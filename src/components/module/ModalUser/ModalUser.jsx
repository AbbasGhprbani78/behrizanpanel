import { useState, useEffect } from "react";
import styles from "./ModalUser.module.css";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import Input from "../Input/Input";
import Texteara from "../Texteara/Texteara";
import axios from "axios";
import swal from "sweetalert";
import { FiEdit2 } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
const tabs = ["اطلاعات من", "آدرس‌ها"];
export default function ModalUser({
  setShowModal,
  showModal,
  userInfo,
  getUserHandler,
}) {
  const [loading, setLoading] = useState(false);
  const [isDisableNumber, setIsDisableNumber] = useState(true);
  const [statusBtn, setStatusBtn] = useState(1);
  const [timer, setTimer] = useState(59);
  const [code, setCode] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [activeTab, setActiveTab] = useState("اطلاعات من");
  const [errors, setErrors] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    zipcode: "",
    address: "",
  });

  const [profileInfo, setProfileInfo] = useState({
    full_name: userInfo?.full_name || "",
    phone_number: userInfo?.phone_number || "",
    email: userInfo?.email || "",
  });
  const [allAddress, setAllAddress] = useState([]);
  const [address, setAddress] = useState({
    zipcode: "",
    phone1: "",
    phone2: "",
    address: "",
  });
  const [idAdress, setIdAddress] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

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
        console.log(response.data);
        setStatusBtn(4);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chackSecurityCode = async () => {
    const access = localStorage.getItem("access");
    setIsDisable(true);
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    const body = {
      code,
    };
    try {
      const response = await axios.post(`${apiUrl}/user/verify-code/`, body, {
        headers,
      });
      if (response.status === 200) {
        setIsDisableNumber(false);
        setStatusBtn(5);
        swal({
          title: "کد با موفقیت تایید شد",
          icon: "success",
          button: "باشه",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        swal({
          title: "کد وارد شده نادرست است و یا منقضی شده",
          icon: "error",
          button: "باشه",
        });
      } else {
        console.log(error);
      }
    } finally {
      setIsDisable(false);
    }
  };

  const handleChangeProfileInfo = (e) => {
    const { name, value } = e.target;

    setProfileInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputsProfile = () => {
    let isValid = true;
    let newErrors = { full_name: "", phone_number: "", email: "" };

    if (!profileInfo.full_name.trim()) {
      newErrors.full_name = "نام و نام خانوادگی را وارد کنید";
      isValid = false;
    }

    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!profileInfo.phone_number.trim()) {
      newErrors.phone_number = "شماره تلفن را وارد کنید";
      isValid = false;
    } else if (!phoneRegex.test(profileInfo.phone_number)) {
      newErrors.phone_number = "شماره تلفن معتبر نیست";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!profileInfo.email.trim()) {
      newErrors.email = "ایمیل را وارد کنید";
      isValid = false;
    } else if (!emailRegex.test(profileInfo.email)) {
      newErrors.email = "ایمیل معتبر نیست";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const validateInputsAddress = () => {
    let isValid = true;
    let newErrors = { zipcode: "", address: "" };

    if (!address.zipcode.trim()) {
      newErrors.zipcode = "کد پستی نباید خالی باشد.";
      isValid = false;
    } else if (!/^\d{10}$/.test(address.zipcode)) {
      newErrors.zipcode = "کد پستی باید ۱۰ رقم و فقط شامل اعداد باشد.";
      isValid = false;
    }

    if (!address.address.trim()) {
      newErrors.address = "آدرس نباید خالی باشد.";
      isValid = false;
    } else if (address.address.length < 5) {
      newErrors.address = "آدرس باید حداقل ۵ کاراکتر باشد.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const getAddress = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    const response = await axios.get(`${apiUrl}/user/get-user-informations/`, {
      headers,
    });
    try {
      if (response.status === 200) {
        setAllAddress(response.data[0].user_details);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editAddress = (item) => {
    setIdAddress(item.id);
    setActiveTab("تایید");
    setAddress((prev) => ({
      ...prev,
      zipcode: item.zipcode,
      address: item.address,
      phone1: item.phone1 || "",
      phone2: item.phone2 || "",
    }));
  };

  const updateProfile = async () => {
    if (!validateInputsProfile()) {
      return;
    }
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    const updatedProfileInfo = {
      ...profileInfo,
      ...(isDisableNumber === false && { code }),
    };

    try {
      const response = await axios.put(
        `${apiUrl}/user/complete-user-informations/`,
        updatedProfileInfo,
        { headers }
      );

      if (response.status === 200) {
        getUserHandler();
        setShowModal(false);
        setCode("");
        setIsDisableNumber(true);
        setStatusBtn(1);
        setErrors({});
        swal({
          title: "ویرایش با موفقیت انجام شد",
          icon: "success",
          button: "باشه",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addNewAddress = async () => {
    if (!validateInputsAddress()) {
      return;
    }
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/user/user-detail/`,
        address,
        { headers }
      );

      if (response.status === 201) {
        getAddress();
        setAddress(() => ({
          zipcode: "",
          phone1: "",
          phone2: "",
          address: "",
        }));
        swal({
          title: "آدرس با موفقیت اضافه شد",
          icon: "success",
          button: "باشه",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async () => {
    if (!validateInputsAddress()) {
      return;
    }
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/user/user-detail/${idAdress}`,
        address,
        { headers }
      );

      if (response.status === 200) {
        getAddress();
        swal({
          title: "تغییرات با موفقیت ذخیره شد",
          icon: "success",
          button: "باشه",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteAddress = async (id) => {
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.delete(`${apiUrl}/user/user-detail/${id}`, {
        headers,
      });

      if (response.status === 200) {
        getAddress();
        swal({
          title: "آدرس با موفقیت حذف شد",
          icon: "success",
          button: "باشه",
        });
        setActiveTab("آدرس‌ها");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    setProfileInfo({
      full_name: userInfo?.full_name || "",
      phone_number: userInfo?.phone_number || "",
      email: userInfo?.email || "",
    });
  }, [userInfo]);

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

  return (
    <div className={`${styles.modalcontainer} ${showModal ? styles.show : ""}`}>
      <div className={styles.modalclose} onClick={""}></div>
      <div className={styles.modalwrappper}>
        <div className={styles.modalheader}>
          <FaUser />
          <span className={styles.infotextm}>پروفایل</span>
        </div>
        <div className={styles.tabs_modal_contect}>
          <div className={styles.header_tab}>
            {tabs.map((tab) => (
              <button type="button" key={tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
            <div
              className=""
              style={{
                width: "50%",
                left: activeTab === "اطلاعات من" ? "50%" : "0%",
              }}
            />
          </div>
          {activeTab === "اطلاعات من" ? (
            <>
              <div>
                <Input
                  name="full_name"
                  label="نام و نام خانوادگی"
                  icon={FaUser}
                  value={profileInfo.full_name}
                  onChange={handleChangeProfileInfo}
                  type={"text"}
                />
                {errors.full_name && (
                  <span className={styles.errorinput}>{errors.full_name}</span>
                )}
              </div>
              <div>
                <Input
                  name="phone_number"
                  label="شماره تماس"
                  icon={FaPhone}
                  value={profileInfo.phone_number}
                  onChange={handleChangeProfileInfo}
                  type={"text"}
                  disable={isDisableNumber}
                />
              </div>
              <div>
                <div className="d-flex align-items-center justify-content-between mt-4">
                  <Input
                    name="code"
                    label="کد امنیتی"
                    value={code}
                    onChange={(e) => {
                      const newCode = e.target.value;
                      setCode(newCode);
                      setStatusBtn(newCode ? 4 : 1);
                    }}
                    type="text"
                    style="style"
                  />
                  <button
                    type="button"
                    disabled={isDisable || statusBtn === 5}
                    className={`${styles.btn_send_code} ${
                      isDisable && styles.disabled_btn
                    }`}
                    onClick={() => {
                      statusBtn === 1 || statusBtn === 3
                        ? getSecurityCode()
                        : statusBtn === 4
                        ? chackSecurityCode()
                        : null;
                    }}
                  >
                    {statusBtn === 1
                      ? "ارسال کد امنیتی"
                      : statusBtn === 2
                      ? `${Math.floor(timer / 60)}:${
                          timer % 60 < 10 ? "0" : ""
                        }${timer % 60}`
                      : statusBtn === 3
                      ? "ارسال مجدد"
                      : statusBtn === 4
                      ? "ثبت"
                      : "ثبت شد"}
                  </button>
                </div>
                <p className={styles.text_code}>
                  کد امنیتی را وارد کنید تا دسترسی برای ویرایش شماره تماس ایجاد
                  شود. با کلیک روی دکمه کد امنیتی به ایمیل شما ارسال می شود
                </p>
              </div>
              <div>
                <Input
                  name="email"
                  label="ایمیل"
                  icon={MdEmail}
                  value={profileInfo.email}
                  onChange={handleChangeProfileInfo}
                  type={"text"}
                />
                {errors.email && (
                  <span className={styles.errorinput}>{errors.email}</span>
                )}
              </div>
            </>
          ) : activeTab === "آدرس‌ها" ? (
            <>
              <div
                className={`${styles.btncancel} ${styles.addadress}`}
                onClick={() => {
                  setAddress(() => ({
                    zipcode: "",
                    phone1: "",
                    phone2: "",
                    address: "",
                  }));
                  setActiveTab("آدرس جدید");
                }}
              >
                افزودن آدرس جدید
              </div>
              <div className={styles.address_container}>
                {allAddress?.length > 0 ? (
                  allAddress.map((item) => (
                    <>
                      <div className={styles.wrap_address_item} key={item.id}>
                        <div className="d-flex align-items-center gap-2">
                          <div className={styles.loc_icon}>
                            <IoLocationOutline />
                          </div>
                          <p className={styles.text_address}>{item.address}</p>
                        </div>
                        <div className={styles.actions_address}>
                          <div
                            className={styles.edit_address}
                            onClick={() => editAddress(item)}
                          >
                            <FiEdit2 />
                          </div>
                          <div
                            className={styles.delete_address}
                            onClick={() => {
                              swal({
                                title: "آیا از حذف آدرس اطمینان دارید؟",
                                icon: "warning",
                                buttons: ["خیر", "بله"],
                              }).then((willDelete) => {
                                if (willDelete) {
                                  deleteAddress(item.id);
                                }
                              });
                            }}
                          >
                            <MdDeleteOutline />
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <p style={{ width: "100%", textAlign: "center" }}>
                    آدرسی وجود ندارد
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <Input
                  name="zipcode"
                  label="کدپستی"
                  value={address.zipcode}
                  onChange={handleChangeAddress}
                  type={"text"}
                />
                {errors.zipcode && (
                  <span className={styles.errorinput}>{errors.zipcode}</span>
                )}
              </div>
              <div>
                <Input
                  name="phone1"
                  label="شماره تماس اول"
                  value={address.phone1}
                  onChange={handleChangeAddress}
                  type={"text"}
                  placeholder={"اختیاری"}
                />
              </div>
              <div>
                <Input
                  name="phone2"
                  label="شماره تماس دوم"
                  value={address.phone2}
                  onChange={handleChangeAddress}
                  type={"text"}
                  placeholder={"اختیاری"}
                />
              </div>
              <div>
                <Texteara
                  name={"address"}
                  value={address.address}
                  onChange={handleChangeAddress}
                  label={"آدرس"}
                />
                {errors.address && (
                  <span className={styles.errorinput}>{errors.address}</span>
                )}
              </div>
            </>
          )}
        </div>
        <div className={styles.btsmodal}>
          <button
            className={`${styles.btnconfirm} ${loading && "disable"}`}
            disabled={loading}
            onClick={
              activeTab === "آدرس جدید"
                ? addNewAddress
                : activeTab === "اطلاعات من"
                ? updateProfile
                : activeTab === "آدرس‌ها"
                ? () => setShowModal(false)
                : updateAddress
            }
          >
            {activeTab === "آدرس جدید"
              ? "افزودن آدرس جدید"
              : activeTab === "اطلاعات من"
              ? "تایید اطلاعات"
              : activeTab === "آدرس‌ها"
              ? "تایید آدرس ها"
              : "تایید"}
          </button>
          <div
            className={styles.btncancel}
            onClick={
              activeTab === "آدرس جدید" || activeTab === "تایید"
                ? () => setActiveTab("آدرس‌ها")
                : () => setShowModal(false)
            }
          >
            {activeTab === "آدرس جدید" || activeTab === "تایید"
              ? "برگشت"
              : "لغو"}
          </div>
        </div>
      </div>
    </div>
  );
}
