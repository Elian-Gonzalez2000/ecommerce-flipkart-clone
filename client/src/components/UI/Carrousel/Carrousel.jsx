import React from "react";
import "./styles.css";
import Carousel from "react-bootstrap/Carousel";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Carrousel = () => {
  return (
    <>
      <Carousel
        style={{ minHeight: "250px" }}
        wrap="true"
        touch={false}
        interval={1000}
        prevIcon={<BsChevronLeft />}
        nextIcon={<BsChevronRight />}
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/carrousel-flipkart-clone%2Fcarrousel-flipkart-clone1.webp?alt=media&token=d898221c-cb4d-4d68-a527-4f38aa1a3c66"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/carrousel-flipkart-clone%2Fcarrousel-flipkart-clone2.webp?alt=media&token=83163a73-e6b4-4696-8e8f-a94c8bb8c88b"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/carrousel-flipkart-clone%2Fcarrousel-flipkart-clone3.webp?alt=media&token=e9b4297e-75ef-47ef-a06a-984ad83b8a66"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/carrousel-flipkart-clone%2Fcarrousel-flipkart-clone5.webp?alt=media&token=7c59a5cd-75a2-416d-bd68-f91d5095a51f"
            alt="Four slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/carrousel-flipkart-clone%2Fcarrousel-flipkart-clone4.webp?alt=media&token=fef09b56-8fc1-4708-b0a6-29625943086e"
            alt="Fifth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/carrousel-flipkart-clone%2Fcarrousel-flipkart-clone6.webp?alt=media&token=9737262d-ab2f-4dca-8064-7c735bda1af4"
            alt="Six slide"
          />
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default Carrousel;
