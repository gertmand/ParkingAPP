import React from 'react';

var style = {
    backgroundColor: "#1b262c",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    color: 'white',
    fontFamily: 'sans-serif',
    fontWeight: 300,
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}

function Footer() {
    return (
        <div>
            <div style={phantom} />
                <div style={style}>
                    Copyright &copy; { new Date().getFullYear() } Parking Solution - All Rights Reserved
                </div>
        </div>
    )
}

export default Footer