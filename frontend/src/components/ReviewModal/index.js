import { useState } from "react";
import "./ReviewModal.css";

export default function ReviewModal() {
    const inputValues = [1,2,3,4,5]
    const [review, setReview] = useState("");
    const [starRating, setStarRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formErrors, setFormErrors] = useState([]);

    const onSubmit = (e) => {
        e.preventDefault();
        // validate inputs

        // if no errors dispatch and close modal
    }

    return (
        <form className="add_review_modal" onSubmit={onSubmit}>

            <h2 className="add_review_modal_title">How was your stay</h2>

            <textarea
                className="add_review_modal_review_input"
                placeholder="Leave your review here"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />

            <div className="add_review_modal_star_rating_div">
                <div className="add_review_modal_star__div">
                    {inputValues.map((inputValue, index) => {
                        const starFilled = inputValue <= (hover || starRating) ? "filled" : "not-filled";

                        return (
                            <label key={index}>
                                <input
                                    className="add_review_modal_star_radio_input"
                                    type="radio"
                                    name="star_rating"
                                    value={inputValue}
                                    onClick={() => setStarRating(inputValue)}
                                    />
                                <i
                                    className={`fa-solid fa-star star_icon ${starFilled}`}
                                    onMouseEnter={() => setHover(inputValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        )
                    })}
                </div>
                <div className="add_review_modal_star_rating_label">Stars</div>
            </div>

            <button type="submit" className={`post_review_button button`}>Post Review</button>

        </form>
    )
}
