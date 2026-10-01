import axios from 'axios';

export const createConsultationMeeting = async (accessToken, meetingDetails) => {
  const event = {
    summary: `Thesis Consultation: ${meetingDetails.topic}`,
    start: { dateTime: meetingDetails.startTime },
    end: { dateTime: meetingDetails.endTime },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const response = await axios.post(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    event,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return response.data.hangoutsLink; // Returns direct Google Meet link
};