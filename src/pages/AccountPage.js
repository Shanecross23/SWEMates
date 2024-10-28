import React, { useState } from 'react';
import '../styles/AccountPage.css';

function AccountPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data to the console
    console.log('Form Data:', formData);
    // Backend handling can be added later
    alert('Preferences submitted successfully!');
    // Optionally, reset the form
    setFormData({
      name: '',
      address: '',
      cuisine: '',
    });
  };

  return (
    <main className="account-page">
      <h2>Update Your Preferences</h2>
      <form className="preferences-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your address"
          />
        </label>

        <label>
          Cuisine Preference:
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            required
            placeholder="Enter your preferred cuisine"
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

export default AccountPage;