import "./UserReservations.css"

function UserReservations() {
    return (
        <>
            <h1>Trips</h1>
            <section>
                <h2>
                    Where You're Going
                </h2>
                <div className="user-upcoming-trips-div user-trips-div">
                    {/* Map over user upcoming trips */}
                </div>
            </section>
            <section>
                <h2>
                    Where You've Been
                </h2>
                <div className="user-past-trips-div user-trips-div">
                    {/* Map over user past trips */}
                </div>
            </section>
        </>
    )
}

export default UserReservations;
