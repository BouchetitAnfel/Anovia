import React from "react";
import "../styles/welcome.css";
import getstarted from "../assets/getstarted.svg";
import Shapes from "../assets/Shapes.svg";
import { Link } from "react-router-dom";

const Welcome = () => {
    return (<>
            
            <div className="nav-links">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
            </div>
            
            <div className="content-wrapper">
                <h1>ANOVIA PMS<br />WEBSITE</h1>
                <p>Specialized Website For Administration Staff And Managers</p>
                <Link to="/Login">
                    <button className="start-button">Get started</button>
                </Link>
            </div>
            
            <img src={Shapes} className="Shapes" alt="Background shapes" />
            <img src={getstarted} alt="getstarted" className="getstarted" />
            </>
    );
};

export default Welcome;