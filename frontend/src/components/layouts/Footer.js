import React from "react";

export default function Footer() {
  return (
    <footer className="py-3 bg-light">
      <p className="text-center text-dark mb-0">
        &copy; {new Date().getFullYear()} All Rights Reserved
      </p>
    </footer>
  );
}
