"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarStyles.css";

export default function CalendarApp() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [event, setEvent] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [editNum, seteditNum] = useState(null); 
  const [editMode, setEditMode] = useState(false); 

  const editEvent = (newDate) => {
    if (editMode) exitEditMode(); 
    setDate(newDate);
  };

  const addEvent = () => {
    const dateKey = date.toDateString();
    if (!event || !eventTime) return;

    const newEvent = { description: event, time: eventTime };

    if (editNum !== null) {
      const newEvents = {
        ...events,
        [dateKey]: events[dateKey].map((evt, idx) =>
          idx === editNum ? newEvent : evt
        ),
      };
      setEvents(newEvents);
      exitEditMode();
    } else {
      const newEvents = {
        ...events,
        [dateKey]: [...(events[dateKey] || []), newEvent].sort((a, b) =>
          a.time.localeCompare(b.time)
        ),
      };
      setEvents(newEvents);
      setEvent("");
      setEventTime("");
    }
  };

  const displayEvent = (eventData, idx, dateKey) => {
    setEvent(eventData.description);
    setEventTime(eventData.time);
    seteditNum(idx);
    setEditMode(true);
  };

  const editButtonClick = (eventData, idx) => {
    setEvent(eventData.description);
    setEventTime(eventData.time);
    seteditNum(idx);
    setEditMode(true);
  };

  const exitEditMode = () => {
    setEditMode(false);
    seteditNum(null);
    setEvent("");
    setEventTime("");
  };

  const convertTime = (time24) => {
      const [hour, minute] = time24.split(":");
    const date = new Date();
    date.setHours(hour, minute);

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = date.toDateString();
      if (events[dateKey]) {
        return (
          <div
            className="tile-events"
            onClick={(e) => {
              if (editMode) exitEditMode(); // Exit edit mode if clicking elsewhere
              e.stopPropagation(); // Prevent unintended edit mode exit
            }}
          >
            {events[dateKey].map((evt, idx) => (
              <span
                key={idx}
                className="indiv-event"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent unintended edit mode exit
                  displayEvent(evt, idx, dateKey);
                }}
              >
                {convertTime(evt.time)} - {evt.description}
              </span>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        onChange={editEvent}
        value={date}
        tileContent={tileContent}
      />
      <h2>Selected Date: {date.toDateString()}</h2>
      <div>
        <input
          type="text"
          placeholder="Event description"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
        <button onClick={addEvent}>
          {editMode ? "Save Changes" : "Add Event"}
        </button>
      </div>
      <h3>Events for {date.toDateString()}:</h3>
      <ul>
        {(events[date.toDateString()] || []).map((evt, idx) => (
          <li key={idx}>
            {convertTime(evt.time)} - {evt.description}{" "}
            <button onClick={() => editButtonClick(evt, idx)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
