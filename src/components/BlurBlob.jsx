import React from "react";
import PropTypes from "prop-types";

const BlurBlob = ({ blobs = [] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {blobs.map((blob, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: blob.top || "50%",
            left: blob.left || "50%",
            width: blob.width || "300px",
            height: blob.height || "300px",
            transform: "translate(-50%, -50%)",
            animationDelay: blob.delay || "0s",
          }}
        >
          <div
            className={`w-full h-full rounded-full blur-3xl opacity-30 ${blob.color}`}
            style={{
              animation: "blobMove 8s infinite ease-in-out",
            }}
          />
        </div>
      ))}
    </div>
  );
};

BlurBlob.propTypes = {
  blobs: PropTypes.arrayOf(
    PropTypes.shape({
      top: PropTypes.string,
      left: PropTypes.string,
      width: PropTypes.string,
      height: PropTypes.string,
      color: PropTypes.string,
      delay: PropTypes.string,
    })
  ),
};

export default BlurBlob;