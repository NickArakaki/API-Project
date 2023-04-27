import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Redirect } from "react-router-dom";
import * as bookingActions from "../../store/bookings"
import UserReservationSummary from "./UserReservationSummary";

import "./UserReservations.css"

function UserReservations() {
    const sessionUser = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const userFutureBookings = useSelector(state => Object.values(state.bookings.userBookings.futureBookings))
    const userPastBookings = useSelector(state => Object.values(state.bookings.userBookings.pastBookings))

    useEffect(() => {
        dispatch(bookingActions.getAllUserBookingsThunk())
            .then(() => setIsLoaded(true))
            .catch(async (error) => {
                const data = await error;
                console.log(data);
            })
    }, [])

    if (!sessionUser) return <Redirect to={"/"} />

    return (
        <>
        {isLoaded ? (
            <div className="manage-trips-container">
                <h1 className="manage-trips-title">Trips</h1>
                <section>
                    <h2 className="manage-trips-section-heading">
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
                    <h2 className="manage-trips-section-heading">
                        Where You've Been
                    </h2>
                    <div className="user-past-trips-div user-trips-div">
                        {userPastBookings.map(booking => {
                            return (
                                <UserReservationSummary key={booking.id} reservation={booking} />
                            )
                        })}
                    </div>
                </section>
            </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}

export default UserReservations;
