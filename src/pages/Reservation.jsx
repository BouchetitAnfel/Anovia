import React, { useState } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import { User, Mail, Phone, Calendar, Home, Users, FileText, CreditCard, DollarSign, Check, Save, AlertCircle } from 'lucide-react';
import '../styles/Reservation.css';

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [reservationStatus, setReservationStatus] = useState('pending');
  const [specialRequests, setSpecialRequests] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomNumber: '',
    guests: 1,
    specialRequests: [],
    rate: 149.99,
    paymentMethod: 'cash',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length !== 16) {
        setErrors({
          ...errors,
          cardNumber: 'Card number must be 16 digits'
        });
      }
    }
    
    if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length < 3) {
        setErrors({
          ...errors,
          cvv: 'CVV must be at least 3 digits'
        });
      }
    }
  };

  const handleSpecialRequestChange = (request) => {
    let updatedRequests = [...formData.specialRequests];
    
    if (updatedRequests.includes(request)) {
      updatedRequests = updatedRequests.filter(item => item !== request);
    } else {
      if (updatedRequests.length < 2) {
        updatedRequests.push(request);
      } else {
        updatedRequests.shift();
        updatedRequests.push(request);
      }
    }
    
    setFormData({
      ...formData,
      specialRequests: updatedRequests
    });
    
    setSpecialRequests(updatedRequests);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setFormData({
      ...formData,
      paymentMethod: method
    });
  };

  const handlePaymentConfirmation = () => {
    const cardErrors = {};
    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        cardErrors.cardNumber = 'Card number is required';
      } else {
        const digitsOnly = formData.cardNumber.replace(/\D/g, '');
        if (digitsOnly.length !== 16) {
          cardErrors.cardNumber = 'Wrong card number - must be 16 digits';
        }
      }
      
      if (!formData.cardHolder.trim()) cardErrors.cardHolder = 'Card holder name is required';
      if (!formData.expiryDate.trim()) cardErrors.expiryDate = 'Expiry date is required';
      
      if (!formData.cvv.trim()) {
        cardErrors.cvv = 'CVV is required';
      } else {
        const digitsOnly = formData.cvv.replace(/\D/g, '');
        if (digitsOnly.length < 3) {
          cardErrors.cvv = 'CVV must be at least 3 digits';
        }
      }
      
      if (Object.keys(cardErrors).length > 0) {
        setErrors({...errors, ...cardErrors});
        return;
      }
    }
    
    setPaymentStatus('confirmed');
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    } else if (currentStep === 2) {
      if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
      if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
      if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (nextStep) => {
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const handleSaveReservation = () => {
    setReservationStatus('success');
    setTimeout(() => {
      setStep(1);
      setPaymentStatus('pending');
      setReservationStatus('pending');
      setSpecialRequests([]);
      setFormData({
        ...formData,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        roomNumber: '',
        guests: 1,
        specialRequests: [],
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });
    }, 3000);
  };

  return (
    <div className="dashboard">
      <SideBar />
      <NavigationBar />
      
      <div className="dashboard-content">
        <div className="reservation-container">
          <div className="reservation-header">
            <h1>New Reservation</h1>
            <div className="reservation-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Guest Info</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Room & Dates</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Payment</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${step >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-label">Confirmation</div>
              </div>
            </div>
          </div>

          <div className="reservation-content">
            {step === 1 && (
              <div className="details-section">
                <h3 className="section-title">Guest Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      First Name *
                    </label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Last Name *
                    </label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Mail size={16} />
                      Email *
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <Phone size={16} />
                      Phone *
                    </label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="next-btn"
                    onClick={() => handleNext(2)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="details-section">
                <h3 className="section-title">Room & Dates</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Calendar size={16} />
                      Check-In Date *
                    </label>
                    <input 
                      type="date" 
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required
                      className={errors.checkIn ? 'error' : ''}
                    />
                    {errors.checkIn && <div className="error-message">{errors.checkIn}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <Calendar size={16} />
                      Check-Out Date *
                    </label>
                    <input 
                      type="date" 
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required
                      className={errors.checkOut ? 'error' : ''}
                    />
                    {errors.checkOut && <div className="error-message">{errors.checkOut}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Home size={16} />
                      Room Number *
                    </label>
                    <input 
                      type="text" 
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      required
                      className={errors.roomNumber ? 'error' : ''}
                    />
                    {errors.roomNumber && <div className="error-message">{errors.roomNumber}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <Users size={16} />
                      Number of Guests *
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>
                    <FileText size={16} />
                    Special Requests (Select up to 2)
                  </label>
                  <div className="special-requests">
                    <div className="request-options">
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={formData.specialRequests.includes("Early check-in")}
                          onChange={() => handleSpecialRequestChange("Early check-in")}
                        />
                        <span className="checkmark"></span>
                        Early check-in
                      </label>
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={formData.specialRequests.includes("Late check-in")}
                          onChange={() => handleSpecialRequestChange("Late check-in")}
                        />
                        <span className="checkmark"></span>
                        Late check-in
                      </label>
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={formData.specialRequests.includes("Smoking room")}
                          onChange={() => handleSpecialRequestChange("Smoking room")}
                        />
                        <span className="checkmark"></span>
                        Smoking room
                      </label>
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={formData.specialRequests.includes("Extra towels")}
                          onChange={() => handleSpecialRequestChange("Extra towels")}
                        />
                        <span className="checkmark"></span>
                        Extra towels
                      </label>
                    </div>
                    {formData.specialRequests.length > 0 && (
                      <div className="selected-requests">
                        <p>Selected: {formData.specialRequests.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="back-btn"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button 
                    className="next-btn"
                    onClick={() => handleNext(3)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="details-section">
                <h3 className="section-title">Rate & Payment</h3>
                
                <div className="rate-info">
                  <div className="rate-header">
                    <h4>Room Rate</h4>
                    <div className="rate-amount">${formData.rate}/night</div>
                  </div>
                  
                  <div className="rate-calculation">
                    <div className="rate-row">
                      <span>Subtotal</span>
                      <span>${formData.rate}</span>
                    </div>
                    <div className="rate-row">
                      <span>Tax (12%)</span>
                      <span>${(formData.rate * 0.12).toFixed(2)}</span>
                    </div>
                    <div className="rate-row total">
                      <span>Total</span>
                      <span>${(formData.rate * 1.12).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="payment-method">
                  <h4>Payment Method *</h4>
                  <div className="payment-options">
                    <div 
                      className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodChange('cash')}
                    >
                      <DollarSign size={20} />
                      <span>Cash</span>
                    </div>
                    <div 
                      className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => handlePaymentMethodChange('card')}
                    >
                      <CreditCard size={20} />
                      <span>Credit Card</span>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>
                          <CreditCard size={16} />
                          Card Number *
                        </label>
                        <input 
                          type="text" 
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          required
                          maxLength="19"
                          className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>
                          <User size={16} />
                          Card Holder Name *
                        </label>
                        <input 
                          type="text" 
                          name="cardHolder"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          required
                          className={errors.cardHolder ? 'error' : ''}
                        />
                        {errors.cardHolder && <div className="error-message">{errors.cardHolder}</div>}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <Calendar size={16} />
                          Expiry Date *
                        </label>
                        <input 
                          type="text" 
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label>
                          <AlertCircle size={16} />
                          CVV *
                        </label>
                        <input 
                          type="text" 
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="XXX"
                          required
                          minLength="3"
                          maxLength="4"
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                      </div>
                    </div>
                    
                    <button 
                      className="confirm-payment-btn"
                      onClick={handlePaymentConfirmation}
                    >
                      Confirm Payment
                    </button>
                    
                    {paymentStatus === 'confirmed' && (
                      <div className="payment-confirmation">
                        <Check size={20} />
                        <span>Payment Confirmed</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    className="back-btn"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button 
                    className="next-btn"
                    onClick={() => setStep(4)}
                    disabled={paymentMethod === 'card' && paymentStatus !== 'confirmed'}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="details-section">
                <h3 className="section-title">Reservation Summary</h3>
                
                <div className="reservation-summary">
                  <div className="summary-section">
                    <h4>Guest Information</h4>
                    <div className="summary-item">
                      <span>Name:</span>
                      <span>{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="summary-item">
                      <span>Email:</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="summary-item">
                      <span>Phone:</span>
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                  
                  <div className="summary-section">
                    <h4>Reservation Details</h4>
                    <div className="summary-item">
                      <span>Check-In:</span>
                      <span>{formData.checkIn}</span>
                    </div>
                    <div className="summary-item">
                      <span>Check-Out:</span>
                      <span>{formData.checkOut}</span>
                    </div>
                    <div className="summary-item">
                      <span>Room:</span>
                      <span>{formData.roomNumber}</span>
                    </div>
                    <div className="summary-item">
                      <span>Guests:</span>
                      <span>{formData.guests}</span>
                    </div>
                    {formData.specialRequests.length > 0 && (
                      <div className="summary-item">
                        <span>Special Requests:</span>
                        <span>{formData.specialRequests.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="summary-section">
                    <h4>Payment Information</h4>
                    <div className="summary-item">
                      <span>Payment Method:</span>
                      <span>{formData.paymentMethod === 'cash' ? 'Cash' : 'Credit Card'}</span>
                    </div>
                    <div className="summary-item">
                      <span>Total Amount:</span>
                      <span>${(formData.rate * 1.12).toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Payment Status:</span>
                      <span className="payment-status">{paymentStatus === 'confirmed' ? 'Paid' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions center">
                  <button 
                    className="back-btn"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </button>
                  <button 
                    className="save-reservation-btn"
                    onClick={handleSaveReservation}
                  >
                    <Save size={18} />
                    Save Reservation
                  </button>
                </div>
                
                {reservationStatus === 'success' && (
                  <div className="reservation-success">
                    <Check size={24} />
                    <span>Reservation Saved Successfully!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;