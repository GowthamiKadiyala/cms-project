import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableBlock(props) {
  // Hook up the drag physics
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  // Styles to make it look good while dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* 1. The Handle (Grab this icon to drag) */}
      <div
        {...listeners}
        style={{
          cursor: "grab",
          fontSize: "24px",
          color: "#ccc",
          padding: "0 5px",
        }}
      >
        ☰
      </div>

      {/* 2. The Content (Inputs, Images, etc.) */}
      <div style={{ flex: 1 }}>{props.children}</div>

      {/* 3. Delete Button */}
      <button
        onClick={props.onRemove}
        style={{
          background: "#ffebee",
          color: "#c62828",
          border: "none",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  );
}
