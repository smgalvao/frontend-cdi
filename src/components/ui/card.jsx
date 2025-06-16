import React from "react";

export function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl w-full mx-auto border border-gray-100">
      {title && (
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          {title}
        </h2>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
