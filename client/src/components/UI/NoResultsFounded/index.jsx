import errorSearch from "../../../images/error-no-search-results.png";

function NoResultsFounded() {
  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "var(--white-color)",
        width: "98%",
        maxWidth: "1664px",
        marginLeft: "auto",
        padding: "3rem 0",
        marginRight: "auto",
      }}
    >
      <img
        src={errorSearch}
        alt="Products not found"
        style={{ width: "300px" }}
      />
      <h2 style={{ margin: "1rem auto" }}>Sorry, no results found!</h2>
      <p
        style={{
          margin: "1rem auto",
          fontSize: "1.3rem",
          color: "var(--gray-dark-color)",
        }}
      >
        Please check the spelling or try searching for something else
      </p>
    </div>
  );
}

export default NoResultsFounded;
