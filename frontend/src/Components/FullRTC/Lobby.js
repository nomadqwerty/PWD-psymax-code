"use client";
// import { useRouter } from "next/navigation";
import "./lobby.css";
import { Navbar } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";

const Lobby = () => {
  if (typeof window !== "undefined") {
    // const router = useRouter();
    const form = document.getElementById("join-form");
    if (form)
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let inviteCode = e.target.invite_link.value;
        let clientName = e.target.client_name.value;
        // router.push(`rtc?accessKey=${inviteCode}`);

        window.location = `/rtc?accessKey=${inviteCode}&clientName=${clientName}`;
      });
  }
  return (
    <div>
      <Navbar className="p-3">
        <nav className="navbar fluid">
          <img className="navbar-logo" src="/icons/logo.svg" alt="" />
        </nav>
      </Navbar>

      <Row className="form-container">
        <Col xs={12} className="form-col  p-0">
              <h1 className="w-100 lobby-title text-center">Videosprechstunde</h1>
              <p className="text-center mt-3 m-0 w-100">
                Falls Sie noch keinen Zugangscode erhalten haben kontaktieren
                Sie bitte Ihre Behandler:in.
              </p>

              <form id="join-form">
                <input
                  type="text"
                  className="form-input mt-3 m-0 p-3 "
                  name="client_name"
                  placeholder="Enter Name Wie möchten Sie sich nennen?"
                  required
                ></input>
                <br></br>
                <input
                  type="text"
                  className="form-input m-0 mt-3 p-3"
                  name="invite_link"
                  placeholder="Enter Access Key Wie lautet Ihr Zugangscode? "
                  required
                ></input>
                <br></br>
                <input
                  className="btn submitBtn m-0 mt-3"
                  type="submit"
                  value="Join / Beitreten "
                ></input>
              </form>
            </Col>
          
      </Row>
    </div>
  );
};

export default Lobby;