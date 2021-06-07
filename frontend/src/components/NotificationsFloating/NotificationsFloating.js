import React, { useEffect, useState } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import api from "../../services/api";

const NotificationsFloating = ({ active, invites }) => {
  const [events, setEvents] = useState(invites);
  async function recuseEvent(event_id) {
    try {
      await api.post(`/rsvp/${event_id}`, {
        choice: false,
      });
      let newEvents = events.filter((event) => event.id !== event_id);
      setEvents(newEvents);
    } catch (error) {
      console.error(error);
    }
  }
  async function acceptEvent(event_id) {
    try {
      await api.post(`/rsvp/${event_id}`, {
        choice: true,
      });
      let newEvents = events.filter((event) => event.id !== event_id);
      setEvents(newEvents);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="notifications" active={active}>
      <h1>Convites evento</h1>
      {events?.map((event) => (
        <div key={event.id} className="event">
          <header>
            <h1>{event.name}</h1>
          </header>
          <p>{event.description}</p>
          <div className="event-footer">
            <div className="start">
              <h1>Começa</h1>
              <span className="date">{`${new Date(
                event.start
              ).getDay()}/${new Date(event.start).getMonth()}/${new Date(
                event.start
              ).getFullYear()}`}</span>
              <span className="hour">{`${
                new Date(event.start).getHours() < 10 ? "0" : ""
              }${new Date(event.start).getHours()}:${
                new Date(event.start).getMinutes() < 10 ? "0" : ""
              }${new Date(event.start).getMinutes()}`}</span>
            </div>
            <div className="end">
              <h1>Termina</h1>
              <span className="date">{`${new Date(
                event.end
              ).getDay()}/${new Date(event.end).getMonth()}/${new Date(
                event.end
              ).getFullYear()}`}</span>
              <span className="hour">{`${
                new Date(event.end).getHours() < 10 ? "0" : ""
              }${new Date(event.end).getHours()}:${
                new Date(event.end).getMinutes() < 10 ? "0" : ""
              }${new Date(event.end).getMinutes()}`}</span>
            </div>
          </div>
          <div className="choice">
            <CheckIcon className="icon" onClick={() => acceptEvent(event.id)} />
            <XIcon className="icon" onClick={() => recuseEvent(event.id)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsFloating;
