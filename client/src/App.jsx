import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableBlock } from "./SortableBlock";
import axios from "axios";

function App() {
  const PAGE_ID = "9999"; // We will simulate editing the "Homepage"
  const [blocks, setBlocks] = useState([]);

  // 1. FETCH ON LOAD (Triggers Redis "Get")
  useEffect(() => {
    const loadPage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/contents/${PAGE_ID}`
        );
        // If we have saved data, use the latest version. Otherwise use defaults.
        if (res.data.length > 0) {
          setBlocks(res.data[0].data);
        } else {
          setBlocks([
            { id: "1", type: "header", content: "Start Building..." },
          ]);
        }
      } catch (err) {
        console.error("Error loading page:", err);
      }
    };
    loadPage();
  }, []);

  // 2. SAVE PAGE (Triggers Redis "Invalidate")
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5001/api/contents", {
        typeId: PAGE_ID,
        data: blocks, // We save the entire block list as one JSON object
      });
      alert("Saved to Database & Cache Cleared!");
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  // --- STANDARD DND CODE BELOW (No Changes) ---
  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: "" }]);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateContent = (id, text) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content: text } : b)));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        fontFamily: "sans-serif",
        padding: "0 20px",
      }}
    >
      <h1>Day 6: Redis Performance Mode</h1>
      <p style={{ color: "#666" }}>
        Watch your <b>Server Terminal</b> when you refresh!
      </p>
      <hr />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          padding: "15px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <button onClick={() => addBlock("header")} style={btnStyle}>
          + Header
        </button>
        <button onClick={() => addBlock("text")} style={btnStyle}>
          + Text
        </button>
        <button
          onClick={handleSave}
          style={{ ...btnStyle, background: "green", marginLeft: "auto" }}
        >
          Save Page
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              id={block.id}
              onRemove={() => removeBlock(block.id)}
            >
              {block.type === "header" && (
                <input
                  value={block.content}
                  onChange={(e) => updateContent(block.id, e.target.value)}
                  placeholder="Header"
                  style={{
                    ...inputStyle,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                />
              )}
              {block.type === "text" && (
                <textarea
                  value={block.content}
                  onChange={(e) => updateContent(block.id, e.target.value)}
                  placeholder="Text"
                  style={{ ...inputStyle, minHeight: "60px" }}
                />
              )}
            </SortableBlock>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

const btnStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "4px",
};
const inputStyle = {
  width: "100%",
  padding: "5px",
  outline: "none",
  border: "none",
  background: "transparent",
};

export default App;
