"use client";
import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Ticket.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import { GoPlus } from "react-icons/go";
import { SlSocialDropbox } from "react-icons/sl";
import TicketItem from "../../components/module/TicketItem/TicketItem";
import Massage from "../../components/module/Massage/Massage";
import { FaFileAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import swal from "sweetalert";
import { MdAttachFile } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";
import Loading from "../../components/module/Loading/Loading";
import { CiLock } from "react-icons/ci";
import { goToLogin } from "../../utils/helper";
import useSWR from "swr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import Filter from "../../components/module/Filter/Filter";
import ModalFilter from "../../components/module/ModalFilter/ModalFilter";
const apiUrl = import.meta.env.VITE_API_URL;

const fetcher = async (url) => {
  const access = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${access}`,
  };
  const response = await axios.get(url, { headers });
  if (response.status === 200) {
    return response.data;
  }
};

export default function Ticket() {
  const [tab, setTab] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const [title, SetTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [check, setCheck] = useState(0);
  const [disable, SetDisable] = useState(false);
  const [openTicket, setOpenTicket] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isEditMessage, setIsEditMessage] = useState(false);
  const [ticketid, setTicketId] = useState("");
  const [ticket, setTicket] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [userType, setUserType] = useState([]);
  const [typeTicket, setTypeTicket] = useState("");
  const messageEndRef = useRef(null);
  const [showfile, setShowFile] = useState(false);
  const [openModal, setOpenmodal] = useState(false);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isFetched = useRef(false);
  const [isSearch, setIsSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const {
    data: allTickets,
    error,
    mutate,
    isLoading,
  } = useSWR(`${apiUrl}/chat/get-ticket/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000,
  });

  const getUserType = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.get(`${apiUrl}/chat/get-user-type/`, {
        headers,
      });

      if (response.status === 200) {
        setUserType(response?.data);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    }
  };

  const sendTicket = async () => {
    if (!title.trim() || !text.trim() || !typeTicket.trim()) {
      swal({
        title: "موضوع ,عنوان و متن پیام نمی‌توانند خالی باشند",
        icon: "error",
        button: "باشه",
      });
      return;
    }

    SetDisable(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", text);
    formData.append("type", typeTicket);
    if (file) {
      formData.append("file", file);
    }

    if (check) {
      formData.append("alarm", check);
    }

    try {
      const response = await axios.post(
        `${apiUrl}/chat/send-ticket/`,
        formData,
        {
          headers,
        }
      );

      if (response.status === 201) {
        swal({
          title: "تیکت با موفقیت ارسال شد",
          icon: "success",
          button: {
            text: "باشه",
            className: "swal-button-center",
          },
        }).then(() => {
          setTab(1);
        });
        SetTitle("");
        setText("");
        setFile("");
        setCheck(0);
        SetDisable(false);
        mutate();
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
      SetDisable(false);
    }
  };

  const getSelectedTicket = async (ticket) => {
    setTicket(ticket);
    setSelectedTicket(ticket.informations);
    setTab(3);
  };

  const sendmessage = async () => {
    if (textInput.trim()) {
      const access = localStorage.getItem("access");
      const headers = {
        Authorization: `Bearer ${access}`,
      };

      const formData = new FormData();
      formData.append("message", textInput);
      formData.append("ticket_id", ticket.ticket_id);

      const tempMessage = {
        message: "در حال ارسال...",
        date: new Date(),
        is_admin: false,
        temp: true,
      };

      setSelectedTicket((prevMessages) => [...prevMessages, tempMessage]);
      try {
        const response = await axios.post(
          `${apiUrl}/chat/send-ticket/`,
          formData,
          {
            headers,
          }
        );

        if (response.status === 201) {
          const newMessage = {
            message: textInput,
            date: new Date(),
            is_admin: false,
          };

          setSelectedTicket((prevMessages) =>
            prevMessages.map((msg) => (msg.temp ? newMessage : msg))
          );

          swal({
            title: "تیکت با موفقیت ارسال  شد",
            icon: "success",
            button: {
              text: "باشه",
            },
          });
          setTextInput("");
        }
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.removeItem("access");
          goToLogin();
        }
        if (e.response?.status === 500) {
          toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
            position: "top-left",
          });
        }
      }
    }
  };

  const sendFile = async (e) => {
    const maxSize = 1 * 1024 * 1024;
    const access = localStorage.getItem("access");
    const fileMessage = e.target.files[0];
    if (fileMessage.size > maxSize) {
      swal(
        "حجم فایل زیاد است!",
        "لطفاً فایلی با حجم کمتر از 1MB انتخاب کنید.",
        "error"
      );
      e.target.value = "";
      return;
    }
    setShowFile(true);
    const formData = new FormData();
    formData.append("ticket_id", ticket.ticket_id);
    formData.append("file", fileMessage);

    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/chat/send-ticket/`,
        formData,
        {
          headers,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercentage(progress);
          },
        }
      );

      if (response.status === 201) {
        setShowFile(false);
        const newMessage = {
          file: URL.createObjectURL(fileMessage),
          date: new Date(),
          is_admin: false,
        };

        setSelectedTicket((prevMessages) => [...prevMessages, newMessage]);
        swal({
          title: "تیکت با موفقیت ارسال  شد",
          icon: "success",
          button: {
            text: "باشه",
          },
        });
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    }
  };

  const handleEditMessage = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    try {
      const formData = new FormData();
      formData.append("message", textInput);
      const res = await axios.put(
        `${apiUrl}/chat/tickets-edit/${ticketid}`,
        formData,
        {
          headers,
        }
      );

      if (res.status === 200) {
        setIsEditMessage(false);
        setSelectedTicket((prev) =>
          prev.map((msg) =>
            msg.id === ticketid ? { ...msg, message: textInput } : msg
          )
        );
        swal({
          title: "تیکت با موفقیت ویرایش شد",
          icon: "success",
          button: {
            text: "باشه",
          },
        });
        setTextInput("");
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
      toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftkey) {
      event.preventDefault();
      if (isEditMessage) {
        handleEditMessage();
      } else {
        sendmessage();
      }
    }
  };

  useEffect(() => {
    getUserType();
  }, []);

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
    const allOpenTicket = allTickets?.filter((ticket) => ticket.close == false);
    setOpenTicket(allOpenTicket?.length);
  }, [allTickets]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  useEffect(() => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access");
      goToLogin();
    }
  }, [error]);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"تیکت ها"} />
        <div className={styles.maincontent}>
          {windowWidth < 1025 ? (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <div className={styles.ButtonBox}>
                    <div
                      className={`${styles.Button} ${
                        tab === 2 ? styles.activetab : ""
                      }`}
                      onClick={() => setTab(2)}
                    >
                      <span>ارسال تیکت جدید</span>
                      <GoPlus style={{ marginRight: "5px" }} />
                    </div>
                    <div
                      className={`${styles.Button} ${
                        tab === 1 || tab === 3 ? styles.activetab : ""
                      }`}
                      onClick={() => setTab(1)}
                    >
                      <span>تیکت ها</span>
                    </div>
                  </div>

                  {tab === 1 && (
                    <>
                      <div className={styles.topsec}>
                        <SearchBox
                          value={search}
                          onChange={setSearch}
                          placeholder={"جستوجو براساس اسم"}
                        />
                        <Filter
                          setOpenmodal={""}
                          all={""}
                          filters={[
                            {
                              label: "وضعیت",
                              onClick: () => console.log("filter by status"),
                            },
                            {
                              label: "نوع تیکت",
                              onClick: () => console.log("filter by status"),
                            },
                          ]}
                        />
                      </div>
                      <div className={styles.allTickets}>
                        {allTickets?.length > 0 ? (
                          <div className={styles.TicketListBox}>
                            <div className={styles.text}>
                              <span>
                                تعداد کل تیکت‌ها: {allTickets.length} 
                              </span>
                              <span>تیکت‌های باز: {openTicket}</span>
                            </div>
                            <div className={styles.TicketItemBox}>
                              {allTickets
                                .slice()
                                .reverse()
                                .map((ticket) => (
                                  <TicketItem
                                    onClick={() => getSelectedTicket(ticket)}
                                    key={ticket.ticket_id}
                                    ticket={ticket}
                                  />
                                ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={styles.none_ticket}>
                              <SlSocialDropbox
                                className={styles.icon_ticket_none}
                              />
                              <p className={styles.ticket_text_none}>
                                موردی یافت نشد
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  <div
                    className={`${
                      tab === 2 ? styles.InputBox : styles.noneBox
                    }`}
                  >
                    <div className={styles.ChildrenBox}>
                      <div className={styles.title}>
                        <span>
                          درخواست خود را به صورت یک تیکت مطرح کنید تا کارشناسان
                          ما در اسرع وقت، به آن پاسخ دهند.
                        </span>
                      </div>
                      <div>
                        <div className={styles.wrapdrop}>
                          <select
                            className={styles.drop_content}
                            onChange={(e) => setTypeTicket(e.target.value)}
                          >
                            <option
                              selected
                              disabled={true}
                              value="-1"
                              className={styles.one_option}
                            >
                              موضوع
                            </option>
                            {userType.length > 0 &&
                              userType.map((item) => (
                                <option key={item.id} value={item?.id}>
                                  {item?.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className={styles.InputTitle}>
                          <input
                            placeholder="عنوان"
                            value={title}
                            onChange={(e) => SetTitle(e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className={styles.InputText}>
                          <span>متن پیام</span>
                          <div className={styles.TextareaBox}>
                            <textarea
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                            />
                          </div>
                          <div className={styles.OptionButton}>
                            <div className={`${styles.checkbox} my-4`}>
                              <input
                                type="checkbox"
                                checked={check === 1}
                                onChange={(e) =>
                                  setCheck(e.target.checked ? 1 : 0)
                                }
                              />
                              <span>
                                هنگام پاسخ من را از طریق پیامک مطلع کن.
                              </span>
                            </div>
                            <label htmlFor="file" className={styles.file}>
                              {file ? <FaFileAlt /> : <>بارگذاری فایل</>}
                              <input
                                type="file"
                                id="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    if (file.size > 1024 * 1024) {
                                      swal(
                                        "خطا!",
                                        "حجم فایل نباید بیشتر از 1 مگابایت باشد.",
                                        "error"
                                      );
                                      e.target.value = "";
                                      return;
                                    }
                                    setFile(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className={styles.ButtonBox2}>
                        <button
                          disabled={disable}
                          className={`${styles.Button1}  ${
                            disable && styles.disable
                          }`}
                          onClick={sendTicket}
                        >
                          {disable ? "درحال ارسال" : "ارسال تیکت"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${
                      tab === 3 ? styles.TicketMassageBox : styles.noneBox
                    }`}
                  >
                    <div className={styles.MassageBox}>
                      {selectedTicket.length > 0 &&
                        selectedTicket.map((ticket) => (
                          <Massage
                            key={ticket?.id}
                            tikectmsg={ticket}
                            setTextInput={setTextInput}
                            setIsEditMessage={setIsEditMessage}
                            setTicketId={setTicketId}
                          />
                        ))}
                      {showfile && (
                        <div
                          className="d-flex align-items-end mt-4 col-sm-12 px-2"
                          style={{ direction: "rtl" }}
                        >
                          <div
                            className="file-content"
                            style={{ position: "relative" }}
                          >
                            <a
                              className="place"
                              href="#"
                              target="blank"
                              download
                            >
                              <BsFillFileEarmarkArrowDownFill className="fileIcon file-right" />
                            </a>
                            <div className="progress-upload">
                              <div style={{ width: "55px", height: "55px" }}>
                                <CircularProgressbar
                                  minValue={0}
                                  maxValue={100}
                                  value={uploadPercentage}
                                  strokeWidth={5}
                                  background={false}
                                  styles={{
                                    path: {
                                      stroke: `#45ABE5`,
                                    },
                                    trail: {
                                      stroke: "#ffffff",
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messageEndRef} />
                    </div>

                    {ticket.close ? (
                      <>
                        <div
                          className={`${styles.wrapinpt_m_close} ${styles.close_ticket} d-flex align-items-center text-center`}
                        >
                          <span>تیکت بسته شد</span>
                          <CiLock className={styles.lockicon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.wrapinpt_m}>
                          <div className={styles.file_wrapper}>
                            <label htmlFor="file" className={styles.labelfile}>
                              <MdAttachFile className={styles.fileicon_m} />
                            </label>
                            <input
                              type="file"
                              id="file"
                              onChange={(e) => sendFile(e)}
                              className={styles.input_tick}
                            />
                          </div>
                          <div className={styles.input_ticket_wrap}>
                            <input
                              className={styles.input_ticket}
                              type="text"
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                            />
                            <IoSend
                              className={styles.iconsend}
                              onClick={() => {
                                if (isEditMessage) {
                                  handleEditMessage();
                                } else {
                                  sendmessage();
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.wrapinpt_m}>
                          <div className={styles.file_wrapper}>
                            <label htmlFor="file" className={styles.labelfile}>
                              <MdAttachFile className={styles.fileicon_m} />
                            </label>
                            <input
                              type="file"
                              id="file"
                              onChange={(e) => sendFile(e)}
                              className={styles.input_tick}
                            />
                          </div>
                          <div className={styles.input_ticket_wrap}>
                            <input
                              className={styles.input_ticket}
                              type="text"
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                            />
                            <IoSend
                              className={styles.iconsend}
                              onClick={() => {
                                if (isEditMessage) {
                                  handleEditMessage();
                                } else {
                                  sendmessage();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <div className={styles.ButtonBox}>
                    <div
                      className={`${styles.Button1} ${
                        tab === 1 || tab === 3 ? styles.activetab : ""
                      }`}
                      onClick={() => setTab(1)}
                    >
                      <span>تیکت ها</span>
                    </div>
                    <div
                      className={`${styles.Button2} ${
                        tab === 2 ? styles.activetab : ""
                      }`}
                      onClick={() => setTab(2)}
                    >
                      <span>ارسال تیکت جدید</span>
                      <GoPlus style={{ marginRight: "5px" }} />
                    </div>
                  </div>
                  {tab === 1 && (
                    <>
                      <div className={styles.topsec}>
                        <SearchBox
                          value={search}
                          onChange={setSearch}
                          placeholder={"جستوجو براساس اسم"}
                        />
                        <Filter
                          setOpenmodal={""}
                          all={""}
                          filters={[
                            {
                              label: "وضعیت",
                              onClick: () => console.log("filter by status"),
                            },
                            {
                              label: "نوع تیکت",
                              onClick: () => console.log("filter by status"),
                            },
                          ]}
                        />
                      </div>
                      <div>
                        {allTickets?.length > 0 ? (
                          <div className={styles.TicketListBox}>
                            <div className={styles.text}>
                              <span>تعداد کل تیکت‌ها: {allTickets.length}</span>
                              <span>تیکت‌های باز: {openTicket}</span>
                            </div>
                            <div className={styles.TicketItemBox}>
                              {allTickets
                                .slice()
                                .reverse()
                                .map((ticket) => (
                                  <TicketItem
                                    onClick={() => getSelectedTicket(ticket)}
                                    key={ticket.ticket_id}
                                    ticket={ticket}
                                  />
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className={styles.none_ticket}>
                            <SlSocialDropbox
                              className={styles.icon_ticket_none}
                            />
                            <p className={styles.ticket_text_none}>
                              موردی یافت نشد
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div
                    className={`${
                      tab === 2 ? styles.createTicket : styles.noneBox
                    }`}
                  >
                    <div className={styles.newtticket}>
                      <div className={styles.title}>
                        <span>
                          درخواست خود را به صورت یک تیکت مطرح کنید تا کارشناسان
                          ما در اسرع وقت، به آن پاسخ دهند.
                        </span>
                      </div>
                      <div>
                        <div className={styles.wrapdrop}>
                          <select
                            className={styles.drop_content}
                            onChange={(e) => setTypeTicket(e.target.value)}
                          >
                            <option
                              selected
                              disabled={true}
                              value="-1"
                              className={styles.one_option}
                            >
                              موضوع
                            </option>
                            {userType.length > 0 &&
                              userType.map((item) => (
                                <option key={item.id} value={item?.id}>
                                  {item?.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className={styles.InputTitle}>
                          <input
                            placeholder="عنوان"
                            value={title}
                            onChange={(e) => SetTitle(e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className={styles.InputText}>
                          <span>متن پیام</span>
                          <div className={styles.TextareaBox}>
                            <textarea
                              style={{ outline: "none" }}
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                            />
                          </div>
                          <div className={styles.OptionButton}>
                            <div className={`${styles.checkbox} mt-4`}>
                              <input
                                type="checkbox"
                                checked={check === 1}
                                onChange={(e) =>
                                  setCheck(e.target.checked ? 1 : 0)
                                }
                              />
                              <span>
                                هنگام پاسخ من را از طریق پیامک مطلع کن.
                              </span>
                            </div>
                            <label htmlFor="file" className={styles.file}>
                              {file ? <FaFileAlt /> : <>بارگذاری فایل</>}
                              <input
                                type="file"
                                id="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    if (file.size > 1024 * 1024) {
                                      swal(
                                        "خطا!",
                                        "حجم فایل نباید بیشتر از 1 مگابایت باشد.",
                                        "error"
                                      );
                                      e.target.value = "";
                                      return;
                                    }
                                    setFile(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className={styles.ButtonBox2}>
                        <button
                          disabled={disable}
                          className={`${styles.Buttonsend} ${
                            disable && styles.disable
                          }`}
                          onClick={sendTicket}
                        >
                          {disable ? "درحال ارسال" : "ارسال تیکت"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      tab === 3 ? styles.TicketMassageBox : styles.noneBox
                    }`}
                  >
                    <div className={styles.MassageBox}>
                      {selectedTicket.length > 0 &&
                        selectedTicket.map((ticket) => (
                          <Massage
                            key={ticket?.id}
                            tikectmsg={ticket}
                            setTextInput={setTextInput}
                            setIsEditMessage={setIsEditMessage}
                            setTicketId={setTicketId}
                          />
                        ))}
                      {showfile && (
                        <div
                          className="d-flex align-items-end mt-4 col-sm-12 px-2"
                          style={{ direction: "rtl" }}
                        >
                          <div
                            className="file-content"
                            style={{ position: "relative" }}
                          >
                            <a
                              className="place"
                              href="#"
                              target="blank"
                              download
                            >
                              <BsFillFileEarmarkArrowDownFill className="fileIcon file-right" />
                            </a>
                            <div className="progress-upload">
                              <div style={{ width: "55px", height: "55px" }}>
                                <CircularProgressbar
                                  minValue={0}
                                  maxValue={100}
                                  value={uploadPercentage}
                                  strokeWidth={5}
                                  background={false}
                                  styles={{
                                    path: {
                                      stroke: `#45ABE5`,
                                    },
                                    trail: {
                                      stroke: "#ffffff",
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messageEndRef} />
                    </div>
                    {ticket.close ? (
                      <>
                        <div
                          className={`${styles.input_message_p}  ${styles.close_ticket} d-flex align-items-center`}
                        >
                          <span>تیکت بسته شد</span>
                          <CiLock className={styles.lockicon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.input_message_p}>
                          <div className={styles.file_wrapper}>
                            <label htmlFor="file" className={styles.labelfile}>
                              <MdAttachFile className={styles.fileicon_m} />
                            </label>
                            <input
                              type="file"
                              id="file"
                              onChange={(e) => sendFile(e)}
                              className={styles.input_tick}
                            />
                          </div>

                          <div className={styles.input_ticket_wrap}>
                            <input
                              onKeyDown={handleKeyDown}
                              className={styles.input_ticket}
                              type="text"
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                            />
                            <IoSend
                              className={styles.iconsend}
                              onClick={() => {
                                if (isEditMessage) {
                                  handleEditMessage();
                                } else {
                                  sendmessage();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
      <ModalFilter
        openModal={openModal}
        setOpenmodal={setOpenmodal}
        filterOrdersByDate={""}
      />
    </div>
  );
}

// const getAllTickets = async (page = 1, page_size = 25) => {
//   if (page === 1 && firstLoad) setLoading(true);

//   const access = localStorage.getItem("access");
//   const headers = { Authorization: `Bearer ${access}` };

//   try {
//     const response = await axios.get(`${apiUrl}/chat/get-ticket/`, {
//       headers,
//       params: { page, page_size },
//     });

//     if (response.status === 200) {
//       setAllTickets((prev) =>
//         page === 1 ? response.data.results : [...prev, ...response.data.results]
//       );
//       setFilterValue((prev) =>
//         page === 1 ? response.data.results : [...prev, ...response.data.results]
//       );

//       if (response.data.results.length < page_size) {
//         setHasMore(false);
//       } else {
//         setPage(page + 1);
//       }
//     }
//   } catch (e) {
//     if (e.response?.status === 401) {
//       localStorage.removeItem("access");
//       goToLogin();
//     }
//     if (e.response?.status === 500) {
//       toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
//         position: "top-left",
//       });
//     }
//   } finally {
//     setLoading(false);
//     if (firstLoad) setFirstLoad(false);
//   }
// };

// const filterTicketsByDate = async (
//   startDate,
//   endDate,
//   page = 1,
//   page_size = 10
// ) => {
//   const convertToEnglishDigits = (str) =>
//     str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
//   const formatDate = (date) => convertToEnglishDigits(date).replace(/\//g, "");
//   const startDateFormatted = formatDate(startDate);
//   const endDateFormatted = formatDate(endDate);
//   const access = localStorage.getItem("access");
//   const headers = { Authorization: `Bearer ${access}` };

//   if (page === 1) setIsSearch(true);

//   try {
//     const response = await axios.get(`${apiUrl}/app/get-cart-detail/`, {
//       params: {
//         page,
//         page_size,
//         start_date: startDateFormatted,
//         end_date: endDateFormatted,
//       },
//       headers,
//     });

//     setSearch("");

//     if (response.status === 200) {
//       setFilterValue((prev) =>
//         page === 1 ? response.data.results : [...prev, ...response.data.results]
//       );

//       if (response.data.results.length < page_size) {
//         setHasMore(false);
//       } else {
//         setPage(page + 1);
//       }
//     }
//   } catch (error) {
//     if (e.response?.status === 500) {
//       toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
//         position: "top-left",
//       });
//     }
//   } finally {
//     setIsSearch(false);
//   }
// };

// const searchTickets = async (query, page = 1, page_size = 25) => {
//   if (!query.trim()) return;

//   const access = localStorage.getItem("access");
//   const headers = { Authorization: `Bearer ${access}` };

//   if (page === 1) setIsSearch(true);

//   try {
//     const response = await axios.get(`${apiUrl}/chat/get-ticket/`, {
//       params: { query, page, page_size },
//       headers,
//     });

//     if (response.status === 200) {
//       const newResults =
//         Array.isArray(response.data) && response.data.length === 0
//           ? []
//           : response.data?.results || [];
//       setFilterValue((prev) =>
//         page === 1 ? newResults : [...prev, ...newResults]
//       );

//       if (response.data.results.length < page_size) {
//         setHasMore(false);
//       } else {
//         setPage(page + 1);
//       }
//     }
//   } catch (error) {
//     if (e.response?.status === 500) {
//       toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
//         position: "top-left",
//       });
//     }
//   } finally {
//     setIsSearch(false);
//     if (firstLoad) setFirstLoad(false);
//   }
// };

// const resetTickets = () => {
//   setFilterValue(allTickets);
//   setPage(1);
//   setHasMore(true);
// };

// useEffect(() => {
//   if (!isFetched.current) {
//     getAllTickets();
//     isFetched.current = true;
//   }
// }, []);

// useEffect(() => {
//   if (search.trim() === "") {
//     setFilterValue(allOrders);
//     setPage(1);
//     setHasMore(true);
//     return;
//   }
//   setPage(1);
//   setHasMore(true);
//   const delayDebounceFn = setTimeout(() => {
//     searchTickets(search.trim(), 1);
//   }, 1500);

//   return () => clearTimeout(delayDebounceFn);
// }, [search]);
