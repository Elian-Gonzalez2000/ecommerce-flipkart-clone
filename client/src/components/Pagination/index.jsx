// components/Pagination.jsx
import React from "react";
import "./styles.css"; // puro CSS

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  siblingCount = 1,
  infoPages = false,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPageRange = () => {
    const totalPageNumbers = siblingCount * 2 + 5;
    const range = [];

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      const leftSibling = Math.max(currentPage - siblingCount, 1);
      const rightSibling = Math.min(currentPage + siblingCount, totalPages);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        const leftRange = Array.from(
          { length: 3 + 2 * siblingCount },
          (_, i) => i + 1
        );
        range.push(...leftRange, "...", totalPages);
      } else if (showLeftDots && !showRightDots) {
        const rightRange = Array.from(
          { length: 3 + 2 * siblingCount },
          (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
        );
        range.push(1, "...", ...rightRange);
      } else {
        range.push(
          1,
          "...",
          ...Array.from(
            { length: rightSibling - leftSibling + 1 },
            (_, i) => leftSibling + i
          ),
          "...",
          totalPages
        );
      }
    }

    return range;
  };

  const pages = createPageRange();

  const handleClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      {infoPages && (
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
      )}
      <button
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          color: `${
            currentPage === 1 ? "var(--text-dark-color)" : "var(--first-color)"
          }`,
        }}
      >
        PREVIOUS
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          className={`pagination-button ${
            page === currentPage ? "active" : ""
          } ${page === "..." ? "dots" : ""}`}
          disabled={page === "..."}
          onClick={() => handleClick(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          color: `${
            currentPage === totalPages
              ? "var(--text-dark-color)"
              : "var(--first-color)"
          }`,
        }}
      >
        NEXT
      </button>
    </div>
  );
};

export default Pagination;
