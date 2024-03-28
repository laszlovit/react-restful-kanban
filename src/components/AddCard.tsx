// AddCard.tsx
import React, { useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

const AddCard = ({ column, setCards }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        "http://localhost:3000/api/tasks/post",
        {
          title: text.trim(),
          column,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCards((prevCards) => [...prevCards, response.data]);
    } catch (error) {
      console.error("Error adding card:", error);
    }

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

export default AddCard;
