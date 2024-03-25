import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

export const CustomKanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("Token:", token);
        const response = await axios.get(
          "http://localhost:3000/api/tasks/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchCards();
  }, [cards]);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.cardId);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    const indicators = getIndicators();
    clearHighlights(indicators);
    setActive(false);

    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      try {
        // Update the column locally
        const updatedCards = cards.map((card) => {
          if (card.id === cardId) {
            return { ...card, column };
          } else {
            return card;
          }
        });
        setCards(updatedCards);

        // Update the column in the database
        const token = await getAccessTokenSilently();
        await axios.put(
          `http://localhost:3000/api/tasks/update/${cardId}`,
          {
            column,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating card:", error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    const indicators = getIndicators(); // Get the list of elements
    clearHighlights(indicators); // Pass the list of elements to clearHighlights
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c._id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ title, _id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={_id} column={column} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, { title, _id, column, cardId: _id })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    console.log("Card ID:", cardId);

    if (!cardId) {
      console.error("Card ID is undefined");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.delete(
        `http://localhost:3000/api/tasks/delete/${cardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete Response:", response.data);
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error deleting card:", error);
    }

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

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

export default CustomKanban;
