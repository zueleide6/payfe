import React, { useEffect, useState, useRef } from "react";

export default function PaybisLoad({ socket, currentUser, currentId }) {
  return (
    <div className="auth-wrapper__inner">
      <div className="auth-wrapper__body">
        <div>
          <div className="LoadNaquelas" >
            <div className="spinnerA"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
