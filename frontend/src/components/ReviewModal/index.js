import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from '../../store/reviews';
import "./ReviewModal.css";

export default function ReviewModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const inputValues = [1,2,3,4,5]
    const [review, setReview] = useState("");
    const [starRating, setStarRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formErrors, setFormErrors] = useState([]);

    const onSubmit = (e) => {
        e.preventDefault();
        // validate inputs
        const errors = [];
        if (starRating <= 0 || starRating > 5) errors.push("Please provide 1 to 5 stars")
        if (review.length < 10) errors.push("Please provide a review at least 10 characters long")

        if (errors.length) {
            setFormErrors(errors)
        } else {
            const userReview = {
                review,
                stars: starRating
            }

            dispatch(reviewActions.addSpotReviewThunk(spotId, userReview))
                .then(closeModal)
                .catch(async res => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setFormErrors(Object.values(data.errors));
                    }
                })
        }



        // if no errors dispatch and close modal
    }

    const buttonEnabled = (starRating > 0 && review.length > 10) ? true : false;

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

            <button type="submit" disabled={!buttonEnabled} className={`post_review_button ${buttonEnabled ? "enabled" : "disabled"}`}>Post Review</button>

        </form>
    )
}
