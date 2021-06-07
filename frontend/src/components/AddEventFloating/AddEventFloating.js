import React from "react";
import { PlusIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import api from "../../services/api";

const AddEventFloating = ({ events, active }) => {
  const { register, handleSubmit } = useForm();
  async function handleAddEvent(data) {
    try {
      await api.post("/events", data);
      console.log("Evento criado com sucesso");
    } catch (error) {
      console.log("Não foi possível criar o evento");
    }
  }
  return (
    <div className="floating" events={events} active={active}>
      <h1>Criar evento</h1>
      <form onSubmit={handleSubmit(handleAddEvent)}>
        <label>Nome:</label>
        <input
          {...register("name")}
          name="name"
          type="text"
          required
          placeholder="Digite o nome do serviço"
        />
        <label>Descrição:</label>
        <input
          {...register("description")}
          name="description"
          type="text"
          required
          placeholder="Digite a descrição do serviço"
        />
        <label>Ínicio:</label>
        <input
          {...register("start")}
          name="start"
          type="datetime-local"
          required
          placeholder="dd/mm/yyyy"
        />
        <label>Fim:</label>
        <input
          {...register("end")}
          name="end"
          type="datetime-local"
          required
          placeholder="dd/mm/yyyy"
        />
        <button type="submit">
          <PlusIcon id="addiconcheck" />
        </button>
      </form>
    </div>
  );
};

export default AddEventFloating;
