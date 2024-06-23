import { useParams } from "react-router-dom";
const BookAppointment = () => {
   const key = useParams().key;
	return (
		<div>
			<h1>Book Appointment {key}</h1>
		</div>
	);
};
export default BookAppointment;
