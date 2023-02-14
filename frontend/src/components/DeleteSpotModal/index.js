import { useModal } from "../../context/Modal"

import "./DeleteSpotModal.css"

export default function DeleteSpotModal() {
    const { closeModal } = useModal();

    const confirmDelete = () => {
        // dispatch delete spot action thunk
    }

    return (
        <div className="delete_spot_modal_div">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <div className="delete_spot_modal_buttons_div">
                <button className="delete_spot_modal_button_delete">{"Yes (Delete Spot)"}</button>
                <button onClick={closeModal} className="delete_spot_modal_button_cancel">{"No (Keep Spot)"}</button>
            </div>
        </div>
    )
}
