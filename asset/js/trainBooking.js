// DOM Elements
const trainNameElement = document.getElementById('train-name');
const trainNumberElement = document.getElementById('train-number');
const fromStationElement = document.getElementById('from-station');
const toStationElement = document.getElementById('to-station');
const departureTimeElement = document.getElementById('departure-time');
const arrivalTimeElement = document.getElementById('arrival-time');
const departureDateElement = document.getElementById('departure-date');
const arrivalDateElement = document.getElementById('arrival-date');
const classOptionsContainer = document.getElementById('class-options');
const passengerList = document.getElementById('passenger-list');
const addPassengerBtn = document.getElementById('add-passenger-btn');
const backBtn = document.getElementById('back-btn');
const bookingForm = document.getElementById('booking-form');
const baseFareElement = document.getElementById('base-fare');
const reservationChargesElement = document.getElementById('reservation-charges');
const gstElement = document.getElementById('gst');
const totalAmountElement = document.getElementById('total-amount');

// Train data from URL parameters
let trainData = {};
let selectedClass = null;
let passengerCount = 1;
const maxPassengers = 6;

// Sample station data (same as in search page)
const sampleStations = [
    { code: 'NDLS', name: 'New Delhi', state: 'Delhi' },
    { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu' },
    { code: 'CSTM', name: 'Mumbai CST', state: 'Maharashtra' },
    { code: 'HWH', name: 'Howrah Junction', state: 'West Bengal' },
    { code: 'SBC', name: 'Bangalore City Junction', state: 'Karnataka' },
    { code: 'SC', name: 'Secunderabad Junction', state: 'Telangana' },
    { code: 'MGS', name: 'Mughal Sarai Junction', state: 'Uttar Pradesh' },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus', state: 'Maharashtra' },
    { code: 'ADI', name: 'Ahmedabad Junction', state: 'Gujarat' },
    { code: 'PNBE', name: 'Patna Junction', state: 'Bihar' },
    { code: 'CNB', name: 'Kanpur Central', state: 'Uttar Pradesh' },
    { code: 'LKO', name: 'Lucknow Charbagh', state: 'Uttar Pradesh' },
    { code: 'JAT', name: 'Jammu Tawi', state: 'Jammu & Kashmir' },
    { code: 'PUNE', name: 'Pune Junction', state: 'Maharashtra' },
    { code: 'ASR', name: 'Amritsar Junction', state: 'Punjab' },
    { code: 'JP', name: 'Jaipur Junction', state: 'Rajasthan' },
    { code: 'BPL', name: 'Bhopal Junction', state: 'Madhya Pradesh' },
    { code: 'GHY', name: 'Guwahati', state: 'Assam' },
    { code: 'NJP', name: 'New Jalpaiguri', state: 'West Bengal' },
    { code: 'MYS', name: 'Mysore Junction', state: 'Karnataka' }
];

// Sample class data for the selected train (in a real app, this would come from the API)
const sampleClasses = [
    { code: 'SL', name: 'Sleeper', availability: 'Available', fare: 800 },
    { code: '3A', name: 'AC 3 Tier', availability: 'Available', fare: 2025 },
    { code: '2A', name: 'AC 2 Tier', availability: 'RAC 5', fare: 2850 },
    { code: '1A', name: 'AC First Class', availability: 'Not Available', fare: 5280 }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Get train data from URL parameters
    parseUrlParams();
    
    // Populate train information
    populateTrainInfo();
    
    // Populate class options
    populateClassOptions();
    
    // Add event listeners
    addPassengerBtn.addEventListener('click', addPassenger);
    backBtn.addEventListener('click', goBackToSearch);
    bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Initialize fare calculation
    updateFareCalculation();
});

// Parse URL parameters
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    trainData = {
        trainNumber: urlParams.get('trainNumber'),
        trainName: urlParams.get('trainName'),
        fromStation: urlParams.get('fromStation'),
        toStation: urlParams.get('toStation'),
        journeyDate: urlParams.get('journeyDate'),
        departureTime: urlParams.get('departureTime'),
        arrivalTime: urlParams.get('arrivalTime'),
        arrivalDay: urlParams.get('arrivalDay') || 1,
        quota: urlParams.get('quota') || 'GN'
    };
}

// Populate train information
function populateTrainInfo() {
    // Set train name and number
    trainNameElement.textContent = trainData.trainName || 'Unknown Train';
    trainNumberElement.textContent = `#${trainData.trainNumber || 'Unknown'}`;
    
    // Find full station names from station codes
    const fromStation = getStationByCode(trainData.fromStation);
    const toStation = getStationByCode(trainData.toStation);
    
    // Set station names
    fromStationElement.textContent = fromStation ? fromStation.name : trainData.fromStation;
    toStationElement.textContent = toStation ? toStation.name : trainData.toStation;
    
    // Format times
    const departureTime = formatTime(trainData.departureTime);
    const arrivalTime = formatTime(trainData.arrivalTime);
    
    // Set times
    departureTimeElement.textContent = departureTime;
    arrivalTimeElement.textContent = arrivalTime;
    
    // Format dates
    const departureDate = formatDate(trainData.journeyDate);
    const arrivalDate = calculateArrivalDate(trainData.journeyDate, parseInt(trainData.arrivalDay));
    
    // Set dates
    departureDateElement.textContent = departureDate;
    arrivalDateElement.textContent = arrivalDate;
}

// Get station details by station code
function getStationByCode(stationCode) {
    return sampleStations.find(station => station.code === stationCode);
}

// Format time from 24-hour format to 12-hour format
function formatTime(timeString) {
    if (!timeString) return 'Unknown';
    
    // Replace URL-encoded colon if present
    timeString = timeString.replace('%3A', ':');
    
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours);
    
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours}:${minutes} ${amPm}`;
}

// Format date to display format
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    
    return date.toLocaleDateString('en-IN', options);
}

// Calculate arrival date based on departure date and arrival day
function calculateArrivalDate(departureDateString, arrivalDay) {
    if (!departureDateString) return 'Unknown';
    
    const departureDate = new Date(departureDateString);
    const arrivalDate = new Date(departureDate);
    arrivalDate.setDate(departureDate.getDate() + (arrivalDay - 1));
    
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return arrivalDate.toLocaleDateString('en-IN', options);
}

// Populate class options
function populateClassOptions() {
    classOptionsContainer.innerHTML = '';
    
    sampleClasses.forEach(classOption => {
        const classElement = document.createElement('div');
        classElement.className = `class-option ${classOption.availability === 'Not Available' ? 'not-available' : ''}`;
        classElement.dataset.classCode = classOption.code;
        
        // Create class info section
        const classInfo = document.createElement('div');
        classInfo.className = 'class-info';
        
        const className = document.createElement('h4');
        className.textContent = `${classOption.name} (${classOption.code})`;
        
        const availability = document.createElement('p');
        availability.className = `availability ${getAvailabilityClass(classOption.availability)}`;
        availability.textContent = classOption.availability;
        
        classInfo.appendChild(className);
        classInfo.appendChild(availability);
        
        // Create fare section
        const fareInfo = document.createElement('div');
        fareInfo.className = 'fare-info';
        fareInfo.textContent = `₹${classOption.fare}`;
        
        // Append all to class element
        classElement.appendChild(classInfo);
        classElement.appendChild(fareInfo);
        
        // Add click event listener if class is available
        if (classOption.availability !== 'Not Available') {
            classElement.addEventListener('click', () => selectClass(classOption));
        }
        
        classOptionsContainer.appendChild(classElement);
    });
}

// Get CSS class based on availability status
function getAvailabilityClass(availability) {
    if (availability === 'Available') return 'available';
    if (availability === 'Not Available') return 'not-available';
    return 'waitlist'; // For RAC and other statuses
}

// Select a class
function selectClass(classOption) {
    // Remove selected class from all options
    const allClassOptions = document.querySelectorAll('.class-option');
    allClassOptions.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    const selectedElement = document.querySelector(`.class-option[data-class-code="${classOption.code}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    // Store selected class
    selectedClass = classOption;
    
    // Update fare calculations
    updateFareCalculation();
}

// Add a new passenger
function addPassenger() {
    if (passengerCount >= maxPassengers) {
        alert('Maximum 6 passengers allowed per booking');
        return;
    }
    
    passengerCount++;
    
    const passengerItem = document.createElement('div');
    passengerItem.className = 'passenger-item';
    passengerItem.dataset.passengerId = passengerCount;
    
    const passengerHeader = document.createElement('div');
    passengerHeader.className = 'passenger-header';
    
    const passengerTitle = document.createElement('h4');
    passengerTitle.textContent = `Passenger ${passengerCount}`;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-passenger';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => removePassenger(passengerItem));
    
    passengerHeader.appendChild(passengerTitle);
    passengerHeader.appendChild(removeBtn);
    
    passengerItem.innerHTML = `
        <div class="form-group">
            <label for="name-${passengerCount}">Name</label>
            <input type="text" id="name-${passengerCount}" name="name-${passengerCount}" required>
        </div>
        <div class="form-group">
            <label for="age-${passengerCount}">Age</label>
            <input type="number" id="age-${passengerCount}" name="age-${passengerCount}" min="1" max="120" required>
        </div>
        <div class="form-group">
            <label for="gender-${passengerCount}">Gender</label>
            <select id="gender-${passengerCount}" name="gender-${passengerCount}" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div class="form-group">
            <label for="berth-${passengerCount}">Berth Preference</label>
            <select id="berth-${passengerCount}" name="berth-${passengerCount}">
                <option value="no-preference">No Preference</option>
                <option value="lower">Lower</option>
                <option value="middle">Middle</option>
                <option value="upper">Upper</option>
                <option value="side-lower">Side Lower</option>
                <option value="side-upper">Side Upper</option>
            </select>
        </div>
        <div class="form-group checkbox-group">
            <input type="checkbox" id="senior-${passengerCount}" name="senior-${passengerCount}">
            <label for="senior-${passengerCount}">Senior Citizen</label>
        </div>
    `;
    
    passengerItem.insertBefore(passengerHeader, passengerItem.firstChild);
    passengerList.appendChild(passengerItem);
    
    // Update fare calculation
    updateFareCalculation();
    
    // Disable add button if max reached
    if (passengerCount >= maxPassengers) {
        addPassengerBtn.disabled = true;
    }
}

// Remove a passenger
function removePassenger(passengerElement) {
    passengerList.removeChild(passengerElement);
    passengerCount--;
    
    // Re-number remaining passengers
    const passengers = document.querySelectorAll('.passenger-item');
    passengers.forEach((passenger, index) => {
        const passengerNum = index + 1;
        passenger.dataset.passengerId = passengerNum;
        passenger.querySelector('h4').textContent = `Passenger ${passengerNum}`;
    });
    
    // Update fare calculation
    updateFareCalculation();
    
    // Enable add button if below max
    if (passengerCount < maxPassengers) {
        addPassengerBtn.disabled = false;
    }
}

// Update fare calculation
function updateFareCalculation() {
    if (!selectedClass) {
        // No class selected, show zeros
        baseFareElement.textContent = '₹0';
        reservationChargesElement.textContent = '₹0';
        gstElement.textContent = '₹0';
        totalAmountElement.textContent = '₹0';
        return;
    }
    
    // Calculate base fare (fare per passenger * number of passengers)
    const baseFare = selectedClass.fare * passengerCount;
    
    // Reservation charges (fixed per passenger)
    const reservationCharge = 20 * passengerCount;
    
    // GST (5% of base fare)
    const gst = Math.ceil(baseFare * 0.05);
    
    // Total amount
    const totalAmount = baseFare + reservationCharge + gst;
    
    // Update UI
    baseFareElement.textContent = `₹${baseFare}`;
    reservationChargesElement.textContent = `₹${reservationCharge}`;
    gstElement.textContent = `₹${gst}`;
    totalAmountElement.textContent = `₹${totalAmount}`;
}

// Go back to search page
function goBackToSearch() {
    window.location.href = 'index.html'; // Assuming search is on index.html
}

// Handle booking form submission
function handleBookingSubmit(event) {
    event.preventDefault();
    
    // Validate class selection
    if (!selectedClass) {
        alert('Please select a travel class');
        return;
    }
    
    // Get form data
    const formData = new FormData(bookingForm);
    const bookingData = {
        // Train data
        trainNumber: trainData.trainNumber,
        trainName: trainData.trainName,
        fromStation: trainData.fromStation,
        toStation: trainData.toStation,
        departureDate: trainData.journeyDate,
        arrivalDate: calculateArrivalDate(trainData.journeyDate, parseInt(trainData.arrivalDay)),
        departureTime: trainData.departureTime,
        arrivalTime: trainData.arrivalTime,
        
        // Selected class
        trainClass: selectedClass.code,
        trainQuota: trainData.quota || 'GN',
        
        // Booking details
        pnr: generateRandomPNR(),
        bookingDate: formatDate(new Date()),
        
        // Passenger information
        passengers: [],
        
        // Contact information
        contact: {
            email: formData.get('email'),
            phone: formData.get('phone'),
            smsUpdates: formData.get('sms-updates') === 'on'
        }
    };
    
    // Get passenger data
    for (let i = 1; i <= passengerCount; i++) {
        bookingData.passengers.push({
            name: formData.get(`name-${i}`),
            age: formData.get(`age-${i}`),
            gender: formData.get(`gender-${i}`),
            berthPreference: formData.get(`berth-${i}`),
            seniorCitizen: formData.get(`senior-${i}`) === 'on',
            seatNumber: generateRandomSeatNumber(selectedClass.code),
            status: 'Confirmed'
        });
    }
    
    // Calculate fares
    const baseFare = selectedClass.fare * passengerCount;
    const reservationCharge = 20 * passengerCount;
    const gst = Math.ceil(baseFare * 0.05);
    const totalAmount = baseFare + reservationCharge + gst;
    
    // Add fare details
    bookingData.baseFare = baseFare.toFixed(2);
    bookingData.reservationCharges = reservationCharge.toFixed(2);
    bookingData.gst = gst.toFixed(2);
    bookingData.totalAmount = totalAmount.toFixed(2);
    
    // In a real app, we would send this data to the server
    console.log('Booking data:', bookingData);
    
    // Store in sessionStorage (not localStorage) for confirmation page
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Show confirmation before redirecting
    if (confirm(`Proceed to payment for ₹${totalAmount}?`)) {
        // Redirect to confirmation page
        window.location.href = '/asset/html/confirmation.html';
    }
}

// Generate a random PNR number
function generateRandomPNR() {
    return '2' + Math.floor(Math.random() * 9000000000 + 1000000000);
}

// Generate a random seat number based on class
function generateRandomSeatNumber(classCode) {
    let prefix = '';
    let maxSeatNum = 72;
    
    switch(classCode) {
        case 'SL':
            prefix = 'S';
            maxSeatNum = 72;
            break;
        case '3A':
            prefix = 'B';
            maxSeatNum = 64;
            break;
        case '2A':
            prefix = 'A';
            maxSeatNum = 48;
            break;
        case '1A':
            prefix = 'H';
            maxSeatNum = 24;
            break;
        default:
            prefix = 'S';
            maxSeatNum = 72;
    }
    
    // Generate random coach number (1-10)
    const coachNum = Math.floor(Math.random() * 10) + 1;
    
    // Generate random seat number
    const seatNum = Math.floor(Math.random() * maxSeatNum) + 1;
    
    return `${prefix}${coachNum}-${seatNum}`;
}