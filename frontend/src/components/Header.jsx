import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <div className="d-header-wrap">
      <header className="d-header clearfix">
        <div className="wrap">
          <div className="contents clearfix">
            <div className="title">
              <a href={"/"}>
                <svg
                  width="110"
                  height="22"
                  viewBox="0 0 110 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.717 10.0886C31.2285 9.41126 30.605 8.89023 29.8657 8.53854C29.12 8.18034 28.3036 7.84168 27.4294 7.52907C26.5552 7.21645 25.7324 6.96246 24.9931 6.7801C24.2474 6.59774 23.611 6.36328 23.1096 6.09626C22.5954 5.82272 22.3382 5.51011 22.3382 5.17145C22.3382 4.55274 22.6789 4.0708 23.3539 3.72562C24.016 3.38696 24.7553 3.21762 25.5524 3.21762C26.343 3.21762 27.0823 3.38696 27.7508 3.72562C28.4129 4.05777 28.7536 4.5332 28.7665 5.13889H31.9163C31.9099 3.80377 31.3056 2.60542 30.1293 1.58292C28.94 0.553903 27.4037 0.0263672 25.5588 0.0263672C23.7139 0.0263672 22.1775 0.54739 20.9883 1.58292C19.8055 2.61194 19.2013 3.8168 19.2013 5.17145C19.2013 6.20047 19.5484 7.09272 20.2362 7.83517C20.924 8.57763 21.7726 9.14424 22.7625 9.52198C23.7525 9.89972 24.7488 10.2254 25.7324 10.4989C26.7159 10.7724 27.5644 11.0525 28.2587 11.3456C28.9658 11.6451 29.3193 11.9968 29.3193 12.4006C29.3193 13.0389 28.9208 13.5338 28.1429 13.8595C27.3716 14.1851 26.5037 14.3479 25.5588 14.3479C24.6138 14.3479 23.746 14.1851 22.9746 13.8595C22.2097 13.5338 21.8111 13.0519 21.7983 12.4332H18.6484C18.6613 13.7488 19.3041 14.9406 20.5641 15.9696C21.8368 17.0117 23.5146 17.5392 25.5524 17.5392C27.5901 17.5392 29.2679 17.0117 30.5407 15.9696C31.8135 14.9276 32.4563 13.7292 32.4563 12.4006C32.4499 11.5409 32.1992 10.7659 31.717 10.0886Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M8.67812 0C6.29967 0 4.23621 0.866196 2.54558 2.57905C0.854954 4.29191 0 6.38251 0 8.79223V21.3944H3.34911V15.7544C4.87903 16.9657 6.66608 17.5845 8.65883 17.5845C11.0437 17.5845 13.1072 16.7183 14.7978 15.0054C16.4884 13.2926 17.3498 11.202 17.3498 8.79223C17.3498 6.38251 16.4949 4.29191 14.8042 2.57905C13.12 0.872709 11.0566 0 8.67812 0ZM14.0071 8.79223C14.0071 10.2902 13.4993 11.5341 12.4451 12.5892C11.3973 13.6508 10.163 14.1653 8.67812 14.1653C7.1932 14.1653 5.95898 13.6508 4.91117 12.5892C3.86337 11.5276 3.34911 10.2902 3.34911 8.79223C3.34911 7.29429 3.85694 6.05036 4.91117 4.99529C5.95898 3.93371 7.1932 3.4192 8.67812 3.4192C10.163 3.4192 11.3973 3.93371 12.4451 4.99529C13.4993 6.05687 14.0071 7.29429 14.0071 8.79223Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M66.4809 0C64.141 0 62.3346 0.937839 61.1133 2.79398C59.8855 0.944352 58.0856 0 55.7457 0C53.7658 0 52.0752 0.690353 50.7252 2.05152C49.3753 3.41269 48.6875 5.13206 48.6875 7.15753V17.3109H52.0366V7.15753C52.0366 6.11549 52.3902 5.2558 53.123 4.51986C53.8558 3.78392 54.7108 3.42571 55.7393 3.42571C56.7678 3.42571 57.6227 3.78392 58.3556 4.51986C59.0884 5.2558 59.4419 6.122 59.4419 7.15753V17.3109H62.791V7.15753C62.791 6.11549 63.1446 5.2558 63.8774 4.51986C64.6102 3.78392 65.4652 3.42571 66.4937 3.42571C67.5222 3.42571 68.3772 3.78392 69.11 4.51986C69.8428 5.2558 70.1964 6.122 70.1964 7.15753V17.3109H73.5455V7.15753C73.5455 5.12555 72.8641 3.41269 71.5077 2.05152C70.1514 0.690353 68.4608 0 66.4809 0Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M83.7152 0C81.3368 0 79.2733 0.866196 77.5827 2.57905C75.8921 4.29191 75.0371 6.38251 75.0371 8.79223C75.0371 11.202 75.8985 13.2925 77.5891 15.0054C79.2797 16.7183 81.3496 17.5845 83.7281 17.5845C85.7208 17.5845 87.5079 16.9723 89.0378 15.7544V17.3109H92.3869V8.79223C92.3869 6.38251 91.532 4.29191 89.8413 2.57905C88.1571 0.872708 86.0937 0 83.7152 0ZM89.0442 8.79223C89.0442 10.2902 88.5364 11.5341 87.4822 12.5892C86.4344 13.6508 85.2002 14.1653 83.7152 14.1653C82.2303 14.1653 80.9961 13.6508 79.9483 12.5892C78.9005 11.5276 78.3862 10.2902 78.3862 8.79223C78.3862 7.29429 78.8941 6.05036 79.9483 4.99529C80.9961 3.93371 82.2303 3.4192 83.7152 3.4192C85.2002 3.4192 86.4344 3.93371 87.4822 4.99529C88.5364 6.05687 89.0442 7.29429 89.0442 8.79223Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M40.7488 11.3578C40.7488 11.3513 40.7424 11.3513 40.7424 11.3447L36.3326 0.461914H32.3535L38.936 15.1352L35.8119 21.9996H39.611L48.9127 0.461914H45.1586L40.7488 11.3578Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M97.1756 0.273438H92.8301L98.7183 8.81818L100.885 5.65298L97.1756 0.273438Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M105.654 11.0065L104.144 8.81818L105.654 6.61035L110 0.273438H105.744L99.8945 8.84423L105.776 17.3108H110L105.654 11.0065Z"
                    fill="#0E0E0E"
                  />
                  <path
                    d="M92.8301 17.311H97.1756L100.891 11.9705L98.7183 8.81836L92.8301 17.311Z"
                    fill="#0E0E0E"
                  />
                </svg>
              </a>
            </div>
            <div className="middleOptions">
              <div className="menu-container">
                <button
                  type="button"
                  className="mr-3 radius4 text-sm p-2.5 text-center inline-flex items-center interFonts"
                >
                  <span className="interFonts text-center logintxt mr-1">
                    Produkt
                  </span>
                  <span>
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1.5L3.99987 4.5L7 1.5"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div className="menu-content">
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.74902 15H7.18836C7.28685 15 7.38438 15.0194 7.47538 15.0571C7.56637 15.0948 7.64905 15.15 7.71869 15.2197L9.52935 17.0303C9.599 17.1 9.68168 17.1552 9.77267 17.1929C9.86366 17.2306 9.96119 17.25 10.0597 17.25H13.9384C14.0369 17.25 14.1344 17.2306 14.2254 17.1929C14.3164 17.1552 14.3991 17.1 14.4687 17.0303L16.2794 15.2197C16.349 15.15 16.4317 15.0948 16.5227 15.0571C16.6137 15.0194 16.7112 15 16.8097 15H20.249"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Praxisverwaltung
                  </a>
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.0002 15L16.5 20.25H7.5L12.0002 15Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 18H4.5C4.10218 18 3.72064 17.842 3.43934 17.5607C3.15804 17.2794 3 16.8978 3 16.5V6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5H19.5C19.8978 4.5 20.2794 4.65804 20.5607 4.93934C20.842 5.22064 21 5.60218 21 6V16.5C21 16.8978 20.842 17.2794 20.5607 17.5607C20.2794 17.842 19.8978 18 19.5 18H18"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Videosprechstunde
                  </a>
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 2.25V5.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 2.25V5.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.75 8.25H20.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Terminplanung
                  </a>
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 13.5C9.57107 13.5 11.25 11.8211 11.25 9.75C11.25 7.67893 9.57107 6 7.5 6C5.42893 6 3.75 7.67893 3.75 9.75C3.75 11.8211 5.42893 13.5 7.5 13.5Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.25 7.5H23.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.25 12H23.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 16.5H23.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.68945 18C2.02236 16.712 2.77377 15.5711 3.8256 14.7565C4.87743 13.942 6.17008 13.5 7.50043 13.5C8.83077 13.5 10.1234 13.942 11.1753 14.7565C12.2271 15.5711 12.9785 16.712 13.3114 18"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Fragebogeneditor
                  </a>
                </div>
              </div>

              <div className="menu-container">
                <button
                  type="button"
                  className="mr-3 radius4 text-sm p-2.5 text-center inline-flex items-center interFonts"
                >
                  <span className="interFonts text-center logintxt mr-1">
                    Lösungen
                  </span>
                  <span>
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1.5L3.99987 4.5L7 1.5"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div className="menu-content">
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.74902 15H7.18836C7.28685 15 7.38438 15.0194 7.47538 15.0571C7.56637 15.0948 7.64905 15.15 7.71869 15.2197L9.52935 17.0303C9.599 17.1 9.68168 17.1552 9.77267 17.1929C9.86366 17.2306 9.96119 17.25 10.0597 17.25H13.9384C14.0369 17.25 14.1344 17.2306 14.2254 17.1929C14.3164 17.1552 14.3991 17.1 14.4687 17.0303L16.2794 15.2197C16.349 15.15 16.4317 15.0948 16.5227 15.0571C16.6137 15.0194 16.7112 15 16.8097 15H20.249"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Praxisverwaltung
                  </a>
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.0002 15L16.5 20.25H7.5L12.0002 15Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 18H4.5C4.10218 18 3.72064 17.842 3.43934 17.5607C3.15804 17.2794 3 16.8978 3 16.5V6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5H19.5C19.8978 4.5 20.2794 4.65804 20.5607 4.93934C20.842 5.22064 21 5.60218 21 6V16.5C21 16.8978 20.842 17.2794 20.5607 17.5607C20.2794 17.842 19.8978 18 19.5 18H18"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Videosprechstunde
                  </a>
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 2.25V5.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 2.25V5.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.75 8.25H20.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Terminplanung
                  </a>
                  <a href="#" className="submenu">
                    <span className="mr-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 13.5C9.57107 13.5 11.25 11.8211 11.25 9.75C11.25 7.67893 9.57107 6 7.5 6C5.42893 6 3.75 7.67893 3.75 9.75C3.75 11.8211 5.42893 13.5 7.5 13.5Z"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.25 7.5H23.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.25 12H23.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 16.5H23.25"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.68945 18C2.02236 16.712 2.77377 15.5711 3.8256 14.7565C4.87743 13.942 6.17008 13.5 7.50043 13.5C8.83077 13.5 10.1234 13.942 11.1753 14.7565C12.2271 15.5711 12.9785 16.712 13.3114 18"
                          stroke="#0E0E0E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Fragebogeneditor
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="mr-3 radius4 text-sm p-2.5 text-center inline-flex items-center interFonts"
              >
                <span className="interFonts text-center logintxt">
                  Weiterempfehlen
                </span>
              </button>
              <button
                type="button"
                className="mr-3 radius4 text-sm p-2.5 text-center inline-flex items-center interFonts"
              >
                <span className="interFonts text-center logintxt">Preis</span>
              </button>
            </div>
            <div className="panel clearfix">
              <button
                type="button"
                className="mr-3 radius4 text-sm p-2.5 text-center inline-flex items-center interFonts"
                onClick={() => router?.push("/register")}
              >
                <span className="interFonts text-center logintxt">
                  Registrieren
                </span>
              </button>
              <button
                type="button"
                className="radius4 text-sm p-2.5 text-center inline-flex items-center interFonts"
                onClick={() => router.push("/login")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                    stroke="#0E0E0E"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M2.90527 20.2491C3.82736 18.6531 5.15322 17.3278 6.74966 16.4064C8.34611 15.485 10.1569 15 12.0002 15C13.8434 15 15.6542 15.4851 17.2506 16.4065C18.8471 17.3279 20.1729 18.6533 21.0949 20.2493"
                    stroke="#0E0E0E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  className="blinking-icon"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    fill="#2B86FC"
                    stroke="#EEEEEE"
                    strokeWidth="2"
                  />
                </svg>

                <span className="interFonts text-center logintxt">
                  Anmelden
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
