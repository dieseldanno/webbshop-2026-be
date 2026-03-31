import Event from '../models/event.js';

export async function getEvents() {
    return await Event.find();
}

