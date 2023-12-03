import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FaDownload, FaFacebook, FaTwitter } from "react-icons/fa";
import html2canvas from "html2canvas";

import "./App.css";

const QuoteApp = () => {
  const [quoteData, setQuoteData] = useState([]);
  const [currentQuote, setCurrentQuote] = useState({});
  const [quoteBackground, setQuoteBackground] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");

  // Define an array of possible background colors
  const backgroundColors = [
    "#cdb4db",
    "#ffc8dd",
    "#ffafcc",
    "#bde0fe",
    "#a2d2ff",
    "#ccd5ae",
  ];

  useEffect(() => {
    // Fetch quote data from API
    fetch("https://retoolapi.dev/TmU29a/data")
      .then((response) => response.json())
      .then((data) => {
        setQuoteData(data);
        setCurrentQuote(getRandomQuote(data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Fetch background image
    setBackgroundImage("/src/background.jpg");
  }, []);

  const getRandomQuote = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

    setQuoteBackground(randomColor); // Set the random background color
    return { ...data[randomIndex], background: randomColor };
  };

  const handleDownloadImage = () => {
    const quoteBox = document.querySelector(".quote-box");

    // Use html2canvas to capture the content as an image
    html2canvas(quoteBox, { scale: 2 })
      .then((canvas) => {
        // Create an "a" element to trigger the download
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "motivational_quote.png";

        // Append the "a" element to the body and trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error creating image:", error);
      });
  };

  const handleRandomizeQuote = () => {
    setCurrentQuote(getRandomQuote(quoteData));
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <div
              className="quote-box"
              style={{ backgroundColor: quoteBackground }}
            >
              <blockquote className="blockquote">
                <p>{currentQuote.quote}</p>
                <footer className="blockquote-footer">
                  {currentQuote.author}
                </footer>
              </blockquote>
            </div>

            <div className="buttons">
              <Button variant="success" onClick={handleRandomizeQuote}>
                Randomize Quote
              </Button>
              <Button variant="primary" onClick={handleDownloadImage}>
                <FaDownload /> Download Quote
              </Button>

              <FacebookShareButton
                url={window.location.href}
                quote={currentQuote.quote}
              >
                <Button variant="info">
                  <FaFacebook /> Share on Facebook
                </Button>
              </FacebookShareButton>

              <TwitterShareButton
                url={window.location.href}
                title={currentQuote.quote}
              >
                <Button variant="info">
                  <FaTwitter /> Share on Twitter
                </Button>
              </TwitterShareButton>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default QuoteApp;
