import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import * as bookingActions from "../../store/bookings"
import UserReservationSummary from "./UserReservationSummary";

import "./UserReservations.css"

function UserReservations() {
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const userFutureBookings = useSelector(state => Object.values(state.bookings.userBookings.futureBookings))
    const userPastBookings = useSelector(state => Object.values(state.bookings.userBookings.pastBookings))

    useEffect(() => {
        dispatch(bookingActions.getAllUserBookingsThunk())
            .then(() => setIsLoaded(true))
    }, [])

    return (
        <>
        {isLoaded ? (
            <>
                <h1>Trips</h1>
                <section>
                    <h2>
                        Where You're Going
                    </h2>
                    <div className="user-upcoming-trips-div user-trips-div">
                        {userFutureBookings.map(booking => {
                            return (
                                <div key={booking.id}>
                                    <UserReservationSummary reservation={booking} />
                                </div>
                            )
                        })}
                    </div>
                </section>
                <section>
                    <h2>
                        Where You've Been
                    </h2>
                    <div className="user-past-trips-div user-trips-div">
                        {userPastBookings.map(booking => {
                            return (
                                <UserReservationSummary key={booking.id} reservation={booking} />
                            )
                        })}
                        {/* Map over user past trips */}
                    </div>
                </section>
            </>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default UserReservations;
