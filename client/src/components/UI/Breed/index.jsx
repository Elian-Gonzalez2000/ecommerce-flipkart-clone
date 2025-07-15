const Breed = (categories) => {
  return (
    <div>
      <ul>
        <li>
          <Link to="#">Home</Link>
          <IoIosArrowForward />
        </li>
        <li>
          <Link to="#">Mobiles</Link>
          <IoIosArrowForward />
        </li>
        <li>
          <Link to="#">Samsung</Link>
          <IoIosArrowForward />
        </li>
        <li>
          <span>{product && product.name}</span>
        </li>
      </ul>
    </div>
  );
};

export default Breed;
