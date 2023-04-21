function ReservationForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("this is the submit button working")
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Start Date</label>
            <input type="date"></input>
            <label>End Date</label>
            <input type="date"></input>
            <button type="submit">Reserve</button>
        </form>
    )
}

export default ReservationForm;
