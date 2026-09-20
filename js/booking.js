/**
 * SALON VELLORA - LUXURY APPOINTMENT BOOKING ENGINE
 * Dynamic Service Catalog, Slot Picker, Validation, Receipt Generation & WhatsApp Integration
 * Structured for future Laravel REST API (POST /api/v1/appointments)
 */

const SALON_SERVICES = {
  hair: [
    { id: 'hair-cut', name: 'Precision Haircut & Blow Dry Ritual', duration: '60 min', price: 'Rs. 4,500+' },
    { id: 'hair-balayage', name: 'Haute Balayage & French Glossing', duration: '180 min', price: 'Rs. 22,000+' },
    { id: 'hair-keratin', name: 'Brazilian Keratin Smoothing Infusion', duration: '150 min', price: 'Rs. 18,500+' },
    { id: 'hair-botox', name: 'Deep Collagen & Caviar Hair Botox', duration: '120 min', price: 'Rs. 14,000+' },
    { id: 'hair-scalp', name: 'Revitalizing Herbal Scalp Detox Spa', duration: '75 min', price: 'Rs. 6,500+' }
  ],
  beauty: [
    { id: 'beauty-hydra', name: 'Luxury 24K Gold HydraFacial Glow', duration: '90 min', price: 'Rs. 12,500' },
    { id: 'beauty-glow', name: 'Organic Radiance & Brightening Facial', duration: '75 min', price: 'Rs. 7,800' },
    { id: 'beauty-brow', name: 'Brow Sculpting, Tint & Keratin Lamination', duration: '60 min', price: 'Rs. 5,000' },
    { id: 'beauty-waxing', name: 'Silk Extract Full Body Waxing Ritual', duration: '90 min', price: 'Rs. 9,500' },
    { id: 'beauty-thread', name: 'Deluxe Face Threading & Rosewater Calm', duration: '45 min', price: 'Rs. 2,200' }
  ],
  nails: [
    { id: 'nails-russian', name: 'Couture Russian Gel Manicure', duration: '75 min', price: 'Rs. 5,800' },
    { id: 'nails-extensions', name: 'Polygel Sculpting & 3D Luxury Nail Art', duration: '120 min', price: 'Rs. 9,200+' },
    { id: 'nails-pedi', name: 'Botanical Rose Spa Pedicure & Paraffin', duration: '80 min', price: 'Rs. 6,200' },
    { id: 'nails-chrome', name: 'Glazed Velvet Chrome Gel Overlay', duration: '60 min', price: 'Rs. 4,800' }
  ],
  bridal: [
    { id: 'bridal-kandyan', name: 'Royal Kandyan Bridal Dressing & Jewellery', duration: 'Full Day', price: 'Rs. 75,000+' },
    { id: 'bridal-western', name: 'Western Haute Couture Bridal Dressing', duration: 'Full Day', price: 'Rs. 65,000+' },
    { id: 'bridal-reception', name: 'Homecoming & Evening Reception Glamour', duration: '4 hours', price: 'Rs. 45,000+' },
    { id: 'bridal-journey', name: 'Signature 30-Day Pre-Bridal Glow Program', duration: 'Multi-Visit', price: 'Rs. 85,000+' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingSystem();
  initServiceCardTriggers();
  initDateConstraints();
});

let selectedTimeSlot = '';

function initBookingSystem() {
  const categorySelect = document.getElementById('bookingCategory');
  const serviceSelect = document.getElementById('bookingService');
  const timeSlotButtons = document.querySelectorAll('.time-slot-btn');
  const bookingForm = document.getElementById('salonBookingForm');
  const whatsappBtn = document.getElementById('btnBookViaWhatsApp');
  const modalBackdrop = document.getElementById('receiptModalBackdrop');
  const closeReceiptBtn = document.getElementById('btnCloseReceipt');

  if (!categorySelect || !serviceSelect) return;

  // Populate services based on selected category
  const populateServices = (categoryKey, preselectedServiceId = null) => {
    serviceSelect.innerHTML = '<option value="">-- Choose Desired Treatment --</option>';
    
    if (categoryKey && SALON_SERVICES[categoryKey]) {
      SALON_SERVICES[categoryKey].forEach(srv => {
        const option = document.createElement('option');
        option.value = srv.name;
        option.setAttribute('data-id', srv.id);
        option.textContent = `${srv.name} (${srv.duration} • ${srv.price})`;
        if (preselectedServiceId && srv.id === preselectedServiceId) {
          option.selected = true;
        }
        serviceSelect.appendChild(option);
      });
      serviceSelect.disabled = false;
    } else {
      serviceSelect.disabled = true;
    }
  };

  categorySelect.addEventListener('change', (e) => {
    populateServices(e.target.value);
  });

  // Time Slot Selection
  timeSlotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      timeSlotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeSlot = btn.getAttribute('data-slot');
      
      const timeInputError = document.getElementById('timeSlotError');
      if (timeInputError) timeInputError.style.display = 'none';
    });
  });

  // Online Reservation Submission Handler
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateBookingForm()) {
        return;
      }

      const bookingPayload = getBookingFormData();

      // Structure designed for easy Laravel API consumption:
      // fetch('/api/v1/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      //   body: JSON.stringify(bookingPayload)
      // });

      // Save locally for frontend session demonstration
      saveAppointmentLocally(bookingPayload);

      // Display the luxury animated confirmation voucher
      showConfirmationReceipt(bookingPayload);

      // Reset form
      bookingForm.reset();
      timeSlotButtons.forEach(b => b.classList.remove('active'));
      selectedTimeSlot = '';
    });
  }

  // Book via WhatsApp CTA Handler
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const category = categorySelect.options[categorySelect.selectedIndex]?.text || '';
      const service = serviceSelect.value;
      const date = document.getElementById('bookingDate').value;
      const stylist = document.getElementById('bookingStylist').value;
      const notes = document.getElementById('bookingNotes').value.trim();

      if (!name || !service) {
        showToast('Please enter your name and select a service to chat on WhatsApp.', 'fa-exclamation-circle');
        return;
      }

      const message = `🌸 *Appointment Inquiry - Salon Vellora* 🌸\n\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Contact:* ${phone || 'N/A'}\n` +
        `✨ *Service:* ${service}\n` +
        `📅 *Preferred Date:* ${date || 'Flexible'}\n` +
        `⏰ *Preferred Time:* ${selectedTimeSlot || 'Flexible'}\n` +
        `💇‍♀️ *Stylist Preference:* ${stylist || 'Any Senior Stylist'}\n` +
        (notes ? `📝 *Special Notes:* ${notes}\n\n` : '\n') +
        `📍 *Location:* Galwatawaththa Junction, Pinnaduwa, Galle\n` +
        `Please confirm availability. Thank you!`;

      const whatsappUrl = `https://wa.me/94764618020?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Close receipt modal
  if (closeReceiptBtn && modalBackdrop) {
    closeReceiptBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
      }
    });
  }

  // Make populateServices accessible globally for "Book This Service" triggers
  window.populateSalonServices = populateServices;
}

/* --------------------------------------------------------------------------
   FORM VALIDATION
   -------------------------------------------------------------------------- */
function validateBookingForm() {
  let isValid = true;

  const nameInput = document.getElementById('bookingName');
  const phoneInput = document.getElementById('bookingPhone');
  const serviceInput = document.getElementById('bookingService');
  const dateInput = document.getElementById('bookingDate');
  const timeSlotError = document.getElementById('timeSlotError');

  // Name validation
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    nameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    nameInput.classList.remove('is-invalid');
  }

  // Phone validation (Sri Lankan or International)
  const phoneVal = phoneInput.value.trim().replace(/\s+/g, '');
  const phoneRegex = /^(\+94|0)?7[0-9]{8}$/;
  if (!phoneVal || !phoneRegex.test(phoneVal)) {
    phoneInput.classList.add('is-invalid');
    isValid = false;
  } else {
    phoneInput.classList.remove('is-invalid');
  }

  // Service selection
  if (!serviceInput.value) {
    serviceInput.classList.add('is-invalid');
    isValid = false;
  } else {
    serviceInput.classList.remove('is-invalid');
  }

  // Date selection
  if (!dateInput.value) {
    dateInput.classList.add('is-invalid');
    isValid = false;
  } else {
    dateInput.classList.remove('is-invalid');
  }

  // Time slot selection
  if (!selectedTimeSlot) {
    if (timeSlotError) timeSlotError.style.display = 'block';
    isValid = false;
  } else {
    if (timeSlotError) timeSlotError.style.display = 'none';
  }

  return isValid;
}

/* --------------------------------------------------------------------------
   EXTRACT FORM DATA (Laravel Ready Payload)
   -------------------------------------------------------------------------- */
function getBookingFormData() {
  const refNumber = 'VEL-' + Math.floor(100000 + Math.random() * 900000);
  return {
    reference: refNumber,
    client_name: document.getElementById('bookingName').value.trim(),
    client_phone: document.getElementById('bookingPhone').value.trim(),
    client_email: document.getElementById('bookingEmail').value.trim(),
    category: document.getElementById('bookingCategory').value,
    service_name: document.getElementById('bookingService').value,
    appointment_date: document.getElementById('bookingDate').value,
    appointment_time: selectedTimeSlot,
    stylist_preference: document.getElementById('bookingStylist').value || 'Any Senior Stylist',
    notes: document.getElementById('bookingNotes').value.trim(),
    created_at: new Date().toISOString()
  };
}

/* --------------------------------------------------------------------------
   LOCAL STORAGE PERSISTENCE
   -------------------------------------------------------------------------- */
function saveAppointmentLocally(appointment) {
  try {
    const existing = JSON.parse(localStorage.getItem('salonVelloraBookings') || '[]');
    existing.push(appointment);
    localStorage.setItem('salonVelloraBookings', JSON.stringify(existing));
  } catch (e) {
    console.warn('Local storage error:', e);
  }
}

/* --------------------------------------------------------------------------
   CONFIRMATION RECEIPT MODAL
   -------------------------------------------------------------------------- */
function showConfirmationReceipt(data) {
  const modalBackdrop = document.getElementById('receiptModalBackdrop');
  if (!modalBackdrop) return;

  document.getElementById('receiptRef').textContent = data.reference;
  document.getElementById('receiptClient').textContent = data.client_name;
  document.getElementById('receiptService').textContent = data.service_name;
  document.getElementById('receiptDateTime').textContent = `${data.appointment_date} at ${data.appointment_time}`;
  document.getElementById('receiptStylist').textContent = data.stylist_preference;

  modalBackdrop.classList.add('active');
  showToast('Your reservation has been recorded! We look forward to pampering you. 🌸', 'fa-check-circle');
}

/* --------------------------------------------------------------------------
   HOOK "BOOK THIS SERVICE" BUTTONS IN SERVICE CARDS
   -------------------------------------------------------------------------- */
function initServiceCardTriggers() {
  document.querySelectorAll('.btn-book-service[data-category]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      const serviceId = this.getAttribute('data-service-id');

      const categorySelect = document.getElementById('bookingCategory');
      const bookingSection = document.getElementById('booking');

      if (categorySelect && window.populateSalonServices) {
        categorySelect.value = category;
        window.populateSalonServices(category, serviceId);
      }

      if (bookingSection) {
        const headerOffset = 90;
        const elementPosition = bookingSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Flash form container gently
        const formWrap = document.querySelector('.booking-form-wrap');
        if (formWrap) {
          formWrap.style.boxShadow = '0 0 30px rgba(238, 125, 156, 0.55)';
          setTimeout(() => {
            formWrap.style.boxShadow = '';
          }, 1500);
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   DATE CONSTRAINTS (Minimum date is today)
   -------------------------------------------------------------------------- */
function initDateConstraints() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  dateInput.value = today;
}
