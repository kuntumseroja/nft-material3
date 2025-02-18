import React from "react";

export function Card({ children }) {
  return <div className="bg-white shadow-md p-4 rounded">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="border-b p-2 text-lg font-bold">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}
