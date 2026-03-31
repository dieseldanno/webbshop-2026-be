import Event from '../models/event.js';

export async function getEvents() {
    return await Event.find().sort({ date: 1 }); // Sort by date ascending
}

export async function createEvent(eventData) {
    const event = new Event(eventData);
    return await event.save();
}

