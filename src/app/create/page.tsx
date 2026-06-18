"use client";

import { useState } from "react";
import { createEvent } from "./actions";

export default function CreatePage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await createEvent(formData);

    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <form action={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Título" className="w-full p-2" />

        <input
          name="description"
          placeholder="Descrição"
          className="w-full p-2"
        />

        <input
          name="date"
          type="datetime-local"
          className="w-full p-2"
        />

        <input
          name="location"
          placeholder="Local"
          className="w-full p-2"
        />

        <button className="bg-white text-black px-4 py-2">
          Criar evento
        </button>

        {error && <p className="text-red-400">{error}</p>}
      </form>
    </div>
  );
}