import React, { useState } from "react";
import axios from "axios";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";

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

export default BurnBarrel;
