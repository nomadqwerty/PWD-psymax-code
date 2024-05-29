"use client";
import React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
// import ReactDom from 'react-dom';
import { Col } from "react-bootstrap";
import "./modal.css";

export default function Modal({...props}) {
  if (typeof window === "object") {
    return createPortal(
      <>
        <Col id="modal_container" className="p-0 m-0">
          <div className="close-modal-btn-div">
            <button
              type="button"
              aria-label="Close"
              className="btn-close"
              onClick={props.onClose}
            ></button>
          </div>
          {props.children}
        </Col>
      </>,
      document.getElementById("portal")
    );
  }
  return null;
};
