import React, { Fragment, useState } from "react";
import "./Slider.css";
import BtnSlider from "./BtnSlider";
import dataSlider from "./dataSlider";
import { Box, Divider, Typography } from "@mui/material";

export default function Slider() {
  const [slideIndex, setSlideIndex] = useState(1);

  const nextSlide = () => {
    if (slideIndex !== dataSlider.length) {
      setSlideIndex(slideIndex + 1);
    } else if (slideIndex === dataSlider.length) {
      setSlideIndex(1);
    }
  };

  const prevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
    } else if (slideIndex === 1) {
      setSlideIndex(dataSlider.length);
    }
  };

  const moveDot = (index) => {
    setSlideIndex(index);
  };

  return (
    <Fragment>
      <div className="container-slider">
        {dataSlider.map((obj, index) => {
          return (
            <div
              key={obj.id}
              className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
            >
              <Box component="img" src={`/images/landing${index + 1}.jpg`} sx={{ height: '400px' }} />
              <Typography sx={{ marginLeft: 2, color: '#25353D' }} gutterBottom variant="h4" component="div">
                {obj.title}
              </Typography>
              <Divider sx={{ m: 1 }} />
              <Typography sx={{ marginLeft: 2 }} variant="body1" color="#8C9498">
                {obj.subTitle}
              </Typography>
            </div>
          );
        })}
        {/* <BtnSlider moveSlide={nextSlide} direction={"next"} />
      <BtnSlider moveSlide={prevSlide} direction={"prev"} /> */}
        <div className="container-dots">
          {Array.from({ length: 4 }).map((item, index) => (
            <div
              key={index}
              onClick={() => moveDot(index + 1)}
              className={slideIndex === index + 1 ? "dot active" : "dot"}
            ></div>
          ))}
        </div>

      </div>

    </Fragment>
  );
}
