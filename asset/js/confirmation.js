// Import jsPDF if using a module system
// import { jsPDF } from "jspdf";

// DOM Elements
const pnrNumberElement = document.getElementById('pnr-number');
const pnrDisplayElement = document.getElementById('pnr-display');
const bookingDateElement = document.getElementById('booking-date');
const trainNameElement = document.getElementById('train-name');
const trainNumberElement = document.getElementById('train-number');
const trainClassElement = document.getElementById('train-class');
const trainQuotaElement = document.getElementById('train-quota');
const fromStationElement = document.getElementById('from-station');
const toStationElement = document.getElementById('to-station');
const departureTimeElement = document.getElementById('departure-time');
const arrivalTimeElement = document.getElementById('arrival-time');
const departureDateElement = document.getElementById('departure-date');
const arrivalDateElement = document.getElementById('arrival-date');
const passengerListElement = document.getElementById('passenger-list');
const baseFareElement = document.getElementById('base-fare');
const reservationChargesElement = document.getElementById('reservation-charges');
const gstElement = document.getElementById('gst');
const totalAmountElement = document.getElementById('total-amount');

// Buttons
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const emailBtn = document.getElementById('email-btn');

// Sample station data (same as in booking page)
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
    { code: 'JAT', name: 'Jammu Tawi', state: 'Jammu & Kashmir' }
];

// Sample train data
const sampleTrains = [
    { number: '12301', name: 'Howrah Rajdhani', type: 'Rajdhani' },
    { number: '12951', name: 'Mumbai Rajdhani', type: 'Rajdhani' },
    { number: '12259', name: 'Sealdah Duronto', type: 'Duronto' },
    { number: '12650', name: 'Karnataka Sampark Kranti', type: 'Sampark Kranti' },
    { number: '12622', name: 'Tamil Nadu Express', type: 'Superfast' },
    { number: '12909', name: 'Garib Rath Express', type: 'Garib Rath' },
    { number: '12308', name: 'Jodhpur Howrah Express', type: 'Express' },
    { number: '12382', name: 'Poorva Express', type: 'Express' }
];

// Helper functions
function getStationNameByCode(code) {
    const station = sampleStations.find(station => station.code === code);
    return station ? station.name : code;
}

function getTrainNameByNumber(number) {
    const train = sampleTrains.find(train => train.number === number);
    return train ? train.name : 'Unknown Train';
}

function generateRandomPNR() {
    return '2' + Math.floor(Math.random() * 9000000000 + 1000000000);
}

function formatDate(date) {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function calculateTotalFare(baseFare, reservationCharges, gst) {
    return parseFloat(baseFare) + parseFloat(reservationCharges) + parseFloat(gst);
}

// Function to populate ticket details from URL parameters or session storage
function populateTicketDetails() {
    // Check if we have data in session storage (from the booking page)
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData')) || {};
    
    // If no data in session storage, try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Generate a PNR if not available
    const pnr = bookingData.pnr || urlParams.get('pnr') || generateRandomPNR();
    
    // Set booking date as today if not available
    const bookingDate = bookingData.bookingDate || urlParams.get('bookingDate') || formatDate(new Date());
    
    // Get train information
    const trainNumber = bookingData.trainNumber || urlParams.get('trainNumber') || '12301';
    const trainName = bookingData.trainName || urlParams.get('trainName') || getTrainNameByNumber(trainNumber);
    const trainClass = bookingData.trainClass || urlParams.get('trainClass') || '2A';
    const trainQuota = bookingData.trainQuota || urlParams.get('trainQuota') || 'GN';
    
    // Get station information
    const fromCode = bookingData.fromStation || urlParams.get('fromStation') || 'NDLS';
    const toCode = bookingData.toStation || urlParams.get('toStation') || 'HWH';
    const fromStation = getStationNameByCode(fromCode);
    const toStation = getStationNameByCode(toCode);
    
    // Get departure and arrival information
    const departureDate = bookingData.departureDate || urlParams.get('departureDate') || formatDate(new Date());
    const arrivalDate = bookingData.arrivalDate || urlParams.get('arrivalDate') || formatDate(new Date(Date.now() + 86400000)); // Next day by default
    const departureTime = bookingData.departureTime || urlParams.get('departureTime') || '06:00';
    const arrivalTime = bookingData.arrivalTime || urlParams.get('arrivalTime') || '08:30';
    
    // Get passenger information
    let passengers = bookingData.passengers || [];
    if (passengers.length === 0 && urlParams.has('passengerCount')) {
        const count = parseInt(urlParams.get('passengerCount')) || 1;
        for (let i = 0; i < count; i++) {
            passengers.push({
                name: urlParams.get(`passengerName${i}`) || `Passenger ${i+1}`,
                age: urlParams.get(`passengerAge${i}`) || Math.floor(Math.random() * 60 + 18),
                gender: urlParams.get(`passengerGender${i}`) || (Math.random() > 0.5 ? 'Male' : 'Female'),
                seatNumber: urlParams.get(`passengerSeat${i}`) || `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 72 + 1)}`,
                status: urlParams.get(`passengerStatus${i}`) || 'Confirmed'
            });
        }
    }
    
    // If still no passengers, add a default one
    if (passengers.length === 0) {
        passengers.push({
            name: 'John Doe',
            age: 30,
            gender: 'Male',
            seatNumber: 'B22',
            status: 'Confirmed'
        });
    }
    
    // Get fare information
    const baseFare = bookingData.baseFare || urlParams.get('baseFare') || '1250.00';
    const reservationCharges = bookingData.reservationCharges || urlParams.get('reservationCharges') || '40.00';
    const gst = bookingData.gst || urlParams.get('gst') || '65.00';
    const totalAmount = calculateTotalFare(baseFare, reservationCharges, gst);
    
    // Update DOM elements
    pnrNumberElement.textContent = pnr;
    pnrDisplayElement.textContent = pnr;
    bookingDateElement.textContent = bookingDate;
    trainNameElement.textContent = trainName;
    trainNumberElement.textContent = trainNumber;
    trainClassElement.textContent = trainClass;
    trainQuotaElement.textContent = trainQuota;
    fromStationElement.textContent = `${fromStation} (${fromCode})`;
    toStationElement.textContent = `${toStation} (${toCode})`;
    departureTimeElement.textContent = departureTime;
    arrivalTimeElement.textContent = arrivalTime;
    departureDateElement.textContent = departureDate;
    arrivalDateElement.textContent = arrivalDate;
    
    // Update fare information
    baseFareElement.textContent = `₹${baseFare}`;
    reservationChargesElement.textContent = `₹${reservationCharges}`;
    gstElement.textContent = `₹${gst}`;
    totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
    
    // Update passenger list
    passengerListElement.innerHTML = '';
    passengers.forEach((passenger, index) => {
        const passengerRow = document.createElement('tr');
        passengerRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${passenger.name}</td>
            <td>${passenger.age}</td>
            <td>${passenger.gender}</td>
            <td>${passenger.seatNumber}</td>
            <td><span class="status ${passenger.status.toLowerCase()}">${passenger.status}</span></td>
        `;
        passengerListElement.appendChild(passengerRow);
    });
    
    // Save ticket data for download/print/email functions
    window.ticketData = {
        pnr,
        bookingDate,
        trainNumber,
        trainName,
        trainClass,
        trainQuota,
        fromStation: `${fromStation} (${fromCode})`,
        toStation: `${toStation} (${toCode})`,
        departureTime,
        arrivalTime,
        departureDate,
        arrivalDate,
        passengers,
        baseFare,
        reservationCharges,
        gst,
        totalAmount: totalAmount.toFixed(2)
    };
}

// Download ticket as PDF
function downloadTicket() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Indian Railways E-Ticket", 105, 20, { align: "center" });
    
    // Add logo placeholder
    doc.rect(20, 30, 30, 10);
    doc.setFontSize(8);
    doc.text("IR LOGO", 35, 36, { align: "center" });
    
    // Add PNR and booking date
    doc.setFontSize(11);
    doc.text(`PNR Number: ${window.ticketData.pnr}`, 60, 35);
    doc.text(`Booking Date: ${window.ticketData.bookingDate}`, 60, 40);
    
    // Add train information
    doc.setFontSize(14);
    doc.text(`${window.ticketData.trainName} (${window.ticketData.trainNumber})`, 20, 55);
    doc.setFontSize(11);
    doc.text(`Class: ${window.ticketData.trainClass} | Quota: ${window.ticketData.trainQuota}`, 20, 62);
    
    // Add journey information
    doc.text(`From: ${window.ticketData.fromStation}`, 20, 72);
    doc.text(`Departure: ${window.ticketData.departureDate} at ${window.ticketData.departureTime}`, 120, 72);
    
    doc.text(`To: ${window.ticketData.toStation}`, 20, 79);
    doc.text(`Arrival: ${window.ticketData.arrivalDate} at ${window.ticketData.arrivalTime}`, 120, 79);
    
    // Add passenger information
    doc.setFontSize(12);
    doc.text("Passenger Details:", 20, 90);
    
    // Table headers
    doc.setFontSize(10);
    doc.text("No.", 20, 97);
    doc.text("Name", 35, 97);
    doc.text("Age", 85, 97);
    doc.text("Gender", 100, 97);
    doc.text("Seat", 125, 97);
    doc.text("Status", 145, 97);
    
    // Add line under headers
    doc.line(20, 99, 190, 99);
    
    // Add passenger data
    let yPos = 105;
    window.ticketData.passengers.forEach((passenger, index) => {
        doc.text(`${index + 1}`, 20, yPos);
        doc.text(`${passenger.name}`, 35, yPos);
        doc.text(`${passenger.age}`, 85, yPos);
        doc.text(`${passenger.gender}`, 100, yPos);
        doc.text(`${passenger.seatNumber}`, 125, yPos);
        doc.text(`${passenger.status}`, 145, yPos);
        yPos += 7;
    });
    
    // Add line after passenger data
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Add fare details
    doc.setFontSize(12);
    doc.text("Fare Details:", 20, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.text(`Base Fare: ₹${window.ticketData.baseFare}`, 20, yPos);
    yPos += 7;
    doc.text(`Reservation Charges: ₹${window.ticketData.reservationCharges}`, 20, yPos);
    yPos += 7;
    doc.text(`GST: ₹${window.ticketData.gst}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Amount: ₹${window.ticketData.totalAmount}`, 20, yPos);
    
    // Add footer
    yPos += 15;
    doc.setFontSize(8);
    doc.text("This is a computer-generated e-ticket and does not require a signature.", 105, yPos, { align: "center" });
    
    // Save the PDF
    doc.save(`IR_Ticket_${window.ticketData.pnr}.pdf`);
}

// Print ticket
function printTicket() {
    window.print();
}

// Email ticket (mock function)
function emailTicket() {
    const email = prompt("Please enter your email address:");
    
    if (!email) {
        alert("Email address is required to send the ticket.");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    
    // Show sending indicator
    const originalText = emailBtn.textContent;
    emailBtn.textContent = "Sending...";
    emailBtn.disabled = true;
    
    // Simulate sending (would be replaced with actual API call)
    setTimeout(() => {
        alert(`Ticket has been sent to ${email}`);
        emailBtn.textContent = originalText;
        emailBtn.disabled = false;
    }, 2000);
}

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Initialize the page
function init() {
    // Populate ticket details
    populateTicketDetails();
    
    // Add event listeners to buttons
    downloadBtn.addEventListener('click', downloadTicket);
    printBtn.addEventListener('click', printTicket);
    emailBtn.addEventListener('click', emailTicket);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);