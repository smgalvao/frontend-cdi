import React from "react";

export function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl w-full mx-auto border border-gray-100">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}
