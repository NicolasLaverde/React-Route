import { Await, defer, json, redirect, useRouteLoaderData } from "react-router-dom"
import EventItem from "../components/EventItem"
import { Suspense } from "react"
import EventsList from "../components/EventsList"

export default function EventDetailsPage() {
    const {event, events} = useRouteLoaderData('event-detail')


    return(
        <>
        <Suspense fallback={<p> ... Loading event</p>}>
            <Await resolve={event}>
                {loadedEvent => <EventItem event={loadedEvent} />}
            </Await>
        </Suspense>
        <Suspense fallback={<p style={{textAlign: 'center'}}>Loading...</p>}>
            <Await resolve={events}>
                {(loadedEvents) => <EventsList events={loadedEvents} />}
            </Await>
        </Suspense>
        </>
            
    )
}

 async function loaderEvent(eventId) {
    const id = eventId
    const response = await fetch(`http://localhost:8080/events/${id}`)
    if(!response.ok){
        throw json({message: 'Could not fetch details for selected event.'}, {
            status: 500
        })
    }
    const resData = await response.json()
    return resData.event
}

async function loadevents() {
    const response = await fetch('http://localhost:8080/events');
    if (!response.ok) {
      // return {isError: true, message: 'could not fetch event'}
      throw json({ message: 'Could not fetch events,'}, {status: 500})
    } else {
      const resData = await response.json()
      return resData.events  ; 
    }
  }

  export async function loader({request, params}){
    const id = params.eventId
    return defer({
        events: loadevents(),
        event: await loaderEvent(id)
    })
  }

export async function action({params, request}) {
    const eventId = params.eventId
    const response = await fetch('http://localhost:8080/events/' + eventId, {
        method: request.method
    })

    if(!response.ok) {
        throw json(
            { message: 'Could not delete event.'},
            { status: 500 }
        )
    }
    return redirect('/events')
}