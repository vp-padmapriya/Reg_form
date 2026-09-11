import { useState } from "react";
import "./App.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    address: "",
    pinCode: "",
    bloodGroup: "",
    gender: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      setMessage("Phone number must contain exactly 10 digits.");
      return;
    }

    if (formData.pinCode.length !== 6) {
      setMessage("PIN code must contain exactly 6 digits.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({
        message: "The server returned an invalid response."
      }));

      if (response.ok) {
        setMessage("Registration successful! 🎉");

        setFormData({
          name: "",
          fatherName: "",
          motherName: "",
          email: "",
          phone: "",
          address: "",
          pinCode: "",
          bloodGroup: "",
          gender: ""
        });
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="page">

      <div className="registration-card">

        <h1>Student Registration</h1>

        <p className="subtitle">
          Please fill in your details carefully
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="field name-field">
            <label>Student Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Father Name */}
          <div className="field father-field">
            <label>Father's Name</label>
            <input
              type="text"
              name="fatherName"
              placeholder="Enter father's name"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mother Name */}
          <div className="field mother-field">
            <label>Mother's Name</label>
            <input
              type="text"
              name="motherName"
              placeholder="Enter mother's name"
              value={formData.motherName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="field email-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="field phone-field">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="10 digit phone number"
              value={formData.phone}
              onChange={(e) => {

                const value = e.target.value.replace(/\D/g, "");

                if (value.length <= 10) {
                  setFormData({
                    ...formData,
                    phone: value
                  });
                }

              }}
              required
            />

            {formData.phone.length > 0 &&
              formData.phone.length < 10 && (
                <small className="error">
                  ⚠ Phone number must contain 10 digits
                </small>
              )}

            {formData.phone.length === 10 && (
              <small className="success">
                ✓ Valid phone number
              </small>
            )}

          </div>

          {/* Address */}
          <div className="field address-field">
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* PIN */}
          <div className="field pin-field">
            <label>PIN Code</label>

            <input
              type="text"
              name="pinCode"
              placeholder="6 digit PIN code"
              value={formData.pinCode}
              onChange={(e) => {

                const value = e.target.value.replace(/\D/g, "");

                if (value.length <= 6) {
                  setFormData({
                    ...formData,
                    pinCode: value
                  });
                }

              }}
              required
            />

            {formData.pinCode.length > 0 &&
              formData.pinCode.length < 6 && (
                <small className="error">
                  ⚠ PIN code must contain 6 digits
                </small>
              )}

            {formData.pinCode.length === 6 && (
              <small className="success">
                ✓ Valid PIN code
              </small>
            )}

          </div>

          {/* Blood Group */}
          <div className="field blood-field">
            <label>Blood Group</label>

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Gender */}
          <div className="field gender-field">

            <label>Gender</label>

            <div className="gender-options">

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                />
                Other
              </label>

            </div>

          </div>

          {/* Button */}
          <button type="submit">
            Confirm Registration
          </button>

          {/* Message */}
          {message && (
            <p className="message">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}

export default App;